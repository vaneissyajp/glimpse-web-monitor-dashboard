import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Papa from "papaparse";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Upload, Plus, Edit, Save, X, Trash2 } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Transponder, getAllTransponders, saveAllTransponders, addTransponder as dbAddTransponder, updateTransponder as dbUpdateTransponder, deleteTransponder as dbDeleteTransponder, importFromCSV } from "@/lib/db";

const frequencyBandOptions = [
  "C-Band Standard (5.925-6.425 GHz)",
  "C-Band Extended (6.425-7.075 GHz)",
  "Ku-Band (12-18 GHz)",
] as const;

type FrequencyBand = typeof frequencyBandOptions[number];

const frequencyBandColors: Record<FrequencyBand, { bg: string; text: string; border: string }> = {
  "C-Band Standard (5.925-6.425 GHz)": {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200"
  },
  "C-Band Extended (6.425-7.075 GHz)": {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200"
  },
  "Ku-Band (12-18 GHz)": {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-200"
  },
};

const TransponderPage = () => {
  const [transponders, setTransponders] = useState<Transponder[]>([]);
  const [error, setError] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTransponder, setEditedTransponder] = useState<Transponder | null>(null);
  const [deleteTransponder, setDeleteTransponder] = useState<Transponder | null>(null);
  const [newTransponder, setNewTransponder] = useState<Omit<Transponder, 'id'>>({
    name: "",
    utilizedBandwidth: 0,
    totalBandwidth: 100,
    frequencyBand: "C-Band Standard (5.925-6.425 GHz)",
    purpose: "",
    status: "Inactive"
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load data from database on component mount
  useEffect(() => {
    const data = getAllTransponders();
    setTransponders(data);
  }, []);

  // Calculate bandwidth utilization metrics for each frequency band
  const bandwidthMetrics = useMemo(() => {
    const metrics: Record<FrequencyBand, { 
      totalBandwidth: number; 
      utilizedBandwidth: number; 
      utilizationPercentage: number;
      transponderCount: number;
    }> = {
      "C-Band Standard (5.925-6.425 GHz)": { totalBandwidth: 0, utilizedBandwidth: 0, utilizationPercentage: 0, transponderCount: 0 },
      "C-Band Extended (6.425-7.075 GHz)": { totalBandwidth: 0, utilizedBandwidth: 0, utilizationPercentage: 0, transponderCount: 0 },
      "Ku-Band (12-18 GHz)": { totalBandwidth: 0, utilizedBandwidth: 0, utilizationPercentage: 0, transponderCount: 0 },
    };

    transponders.forEach(transponder => {
      const band = transponder.frequencyBand as FrequencyBand;
      if (metrics[band]) {
        metrics[band].totalBandwidth += transponder.totalBandwidth;
        metrics[band].utilizedBandwidth += transponder.utilizedBandwidth;
        metrics[band].transponderCount += 1;
      }
    });

    // Calculate utilization percentages
    Object.keys(metrics).forEach(band => {
      const key = band as FrequencyBand;
      if (metrics[key].totalBandwidth > 0) {
        metrics[key].utilizationPercentage = (metrics[key].utilizedBandwidth / metrics[key].totalBandwidth) * 100;
      }
    });

    return metrics;
  }, [transponders]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getFrequencyBandStyle = (band: FrequencyBand) => {
    const colors = frequencyBandColors[band];
    return `${colors.bg} ${colors.text} ${colors.border} border rounded-md px-2 py-1`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError("");

    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
        setError("Please upload a CSV file");
        return;
      }

      Papa.parse(file, {
        header: true,
        complete: (results) => {
          try {
            const parsedData = results.data.map((row: any, index) => ({
              id: index + 1,
              name: row.name,
              utilizedBandwidth: parseFloat(row.utilizedBandwidth),
              totalBandwidth: parseFloat(row.totalBandwidth),
              frequencyBand: row.frequencyBand,
              purpose: row.purpose,
              status: row.status,
            }));

            if (parsedData.some(item => 
              !item.name || 
              isNaN(item.utilizedBandwidth) || 
              isNaN(item.totalBandwidth) || 
              !item.frequencyBand ||
              !item.purpose || 
              !item.status
            )) {
              setError("Invalid data format. Please check the CSV file structure.");
              return;
            }

            // Update both state and database
            setTransponders(parsedData);
            importFromCSV(parsedData);
          } catch (err) {
            setError("Error parsing CSV file. Please check the file format.");
          }
        },
        error: (error) => {
          setError(`Error reading file: ${error.message}`);
        },
      });
    }
  };

  const downloadTemplate = () => {
    const headers = "name,utilizedBandwidth,totalBandwidth,frequencyBand,purpose,status\n";
    const sampleData = 'Transponder X,50,100,"C-Band Standard (5.925-6.425 GHz)",Sample Purpose,Active';
    const csvContent = headers + sampleData;
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transponder_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const startEditing = (transponder: Transponder) => {
    setEditingId(transponder.id);
    setEditedTransponder({ ...transponder });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedTransponder(null);
  };

  const saveEditing = () => {
    if (editedTransponder) {
      // Update both state and database
      const updatedTransponders = transponders.map(t => 
        t.id === editedTransponder.id ? editedTransponder : t
      );
      setTransponders(updatedTransponders);
      dbUpdateTransponder(editedTransponder);
      
      setEditingId(null);
      setEditedTransponder(null);
    }
  };

  const handleDelete = (transponder: Transponder) => {
    setDeleteTransponder(transponder);
  };

  const confirmDelete = () => {
    if (deleteTransponder) {
      // Update both state and database
      const updatedTransponders = transponders.filter(t => t.id !== deleteTransponder.id);
      setTransponders(updatedTransponders);
      dbDeleteTransponder(deleteTransponder.id);
      
      setDeleteTransponder(null);
    }
  };

  const handleNewTransponderSubmit = () => {
    if (!newTransponder.name || !newTransponder.purpose) {
      setError("Name and purpose are required");
      return;
    }

    // Add to database and get the new transponder with ID
    const addedTransponder = dbAddTransponder(newTransponder);
    
    // Update state
    setTransponders([...transponders, addedTransponder]);
    
    // Reset form
    setNewTransponder({
      name: "",
      utilizedBandwidth: 0,
      totalBandwidth: 100,
      frequencyBand: "C-Band Standard (5.925-6.425 GHz)",
      purpose: "",
      status: "Inactive"
    });
    setIsDialogOpen(false);
  };

  const exportData = () => {
    // Create CSV header
    const headers = "name,utilizedBandwidth,totalBandwidth,frequencyBand,purpose,status\n";
    
    // Convert transponder data to CSV rows
    const csvRows = transponders.map(t => 
      `"${t.name}",${t.utilizedBandwidth},${t.totalBandwidth},"${t.frequencyBand}","${t.purpose}","${t.status}"`
    ).join('\n');
    
    const csvContent = headers + csvRows;
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transponder_data_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-dashboard-primary mb-2">Transponder Status</h1>
          <p className="text-gray-600">Monitoring dan pengelolaan transponder satelit</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Ikhtisar Transponder</h2>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transponder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Transponder</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label>Name</label>
                    <Input
                      value={newTransponder.name}
                      onChange={(e) => setNewTransponder({ ...newTransponder, name: e.target.value })}
                      placeholder="Enter transponder name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Utilized Bandwidth (MHz)</label>
                    <Input
                      type="number"
                      value={newTransponder.utilizedBandwidth}
                      onChange={(e) => setNewTransponder({ ...newTransponder, utilizedBandwidth: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Total Bandwidth (MHz)</label>
                    <Input
                      type="number"
                      value={newTransponder.totalBandwidth}
                      onChange={(e) => setNewTransponder({ ...newTransponder, totalBandwidth: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Frequency Band</label>
                    <Select
                      value={newTransponder.frequencyBand}
                      onValueChange={(value) => setNewTransponder({ ...newTransponder, frequencyBand: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyBandOptions.map((band) => (
                          <SelectItem 
                            key={band} 
                            value={band}
                            className={getFrequencyBandStyle(band)}
                          >
                            {band}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label>Purpose</label>
                    <Input
                      value={newTransponder.purpose}
                      onChange={(e) => setNewTransponder({ ...newTransponder, purpose: e.target.value })}
                      placeholder="Enter purpose"
                    />
                  </div>
                  <div className="space-y-2">
                    <label>Status</label>
                    <Select
                      value={newTransponder.status}
                      onValueChange={(value) => setNewTransponder({ ...newTransponder, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleNewTransponderSubmit}>
                    Add Transponder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="relative">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <Button asChild variant="outline">
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </label>
              </Button>
              <div className="text-center mt-1">
                <a 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    downloadTemplate();
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  template_data.csv
                </a>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Bandwidth Utilization Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(bandwidthMetrics).map(([band, metrics]) => {
            const bandTyped = band as FrequencyBand;
            const colors = frequencyBandColors[bandTyped];
            const utilizationColor = 
              metrics.utilizationPercentage >= 90 ? "bg-red-500" :
              metrics.utilizationPercentage >= 70 ? "bg-yellow-500" :
              "bg-green-500";

            return (
              <Card key={band} className={`${colors.border} border-2`}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className={`font-medium ${colors.text}`}>{band}</h3>
                      <Badge className={colors.bg}>
                        {metrics.transponderCount} Transponder{metrics.transponderCount !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Bandwidth Utilization</span>
                        <span className="font-medium">
                          {metrics.utilizedBandwidth.toFixed(1)} / {metrics.totalBandwidth} MHz
                        </span>
                      </div>
                      <div className="space-y-1">
                        <Progress value={metrics.utilizationPercentage} className={utilizationColor} />
                        <div className="text-right text-sm">
                          {metrics.utilizationPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Export Data Button */}
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={exportData} size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        <AlertDialog open={!!deleteTransponder} onOpenChange={() => setDeleteTransponder(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Transponder</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {deleteTransponder?.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Bandwidth Utilization</TableHead>
                  <TableHead className="text-right">Total Bandwidth (MHz)</TableHead>
                  <TableHead>Frequency Band</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transponders.map((transponder) => {
                  const isEditing = editingId === transponder.id;
                  const utilizationPercentage = (
                    isEditing && editedTransponder 
                      ? (editedTransponder.utilizedBandwidth / editedTransponder.totalBandwidth)
                      : (transponder.utilizedBandwidth / transponder.totalBandwidth)
                  ) * 100;

                  return (
                    <TableRow key={transponder.id}>
                      <TableCell className="font-medium">
                        {isEditing ? (
                          <Input
                            value={editedTransponder?.name}
                            onChange={(e) => setEditedTransponder({ ...editedTransponder!, name: e.target.value })}
                          />
                        ) : (
                          transponder.name
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            {isEditing ? (
                              <Input
                                type="number"
                                value={editedTransponder?.utilizedBandwidth}
                                onChange={(e) => setEditedTransponder({ 
                                  ...editedTransponder!, 
                                  utilizedBandwidth: parseFloat(e.target.value) || 0 
                                })}
                                className="w-24"
                              />
                            ) : (
                              <span className="text-sm">
                                {transponder.utilizedBandwidth} MHz ({utilizationPercentage.toFixed(1)}%)
                              </span>
                            )}
                          </div>
                          <Progress
                            value={utilizationPercentage}
                            className={getUtilizationColor(utilizationPercentage)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editedTransponder?.totalBandwidth}
                            onChange={(e) => setEditedTransponder({ 
                              ...editedTransponder!, 
                              totalBandwidth: parseFloat(e.target.value) || 0 
                            })}
                            className="w-24"
                          />
                        ) : (
                          transponder.totalBandwidth
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Select
                            value={editedTransponder?.frequencyBand}
                            onValueChange={(value) => setEditedTransponder({ ...editedTransponder!, frequencyBand: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {frequencyBandOptions.map((band) => (
                                <SelectItem 
                                  key={band} 
                                  value={band}
                                  className={getFrequencyBandStyle(band)}
                                >
                                  {band}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className={getFrequencyBandStyle(transponder.frequencyBand as FrequencyBand)}>
                            {transponder.frequencyBand}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            value={editedTransponder?.purpose}
                            onChange={(e) => setEditedTransponder({ ...editedTransponder!, purpose: e.target.value })}
                          />
                        ) : (
                          transponder.purpose
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Select
                            value={editedTransponder?.status}
                            onValueChange={(value) => setEditedTransponder({ ...editedTransponder!, status: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className={getStatusColor(transponder.status)}>
                            {transponder.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={cancelEditing}>
                              <X className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={saveEditing}>
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => startEditing(transponder)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(transponder)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TransponderPage;
