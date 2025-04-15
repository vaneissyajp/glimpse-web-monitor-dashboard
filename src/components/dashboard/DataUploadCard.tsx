
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileSpreadsheet, AlertCircle, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const DataUploadCard = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleFile(selectedFile);
    }
  };

  const handleFile = (selectedFile: File) => {
    // Check file type
    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExt !== 'csv' && fileExt !== 'xlsx' && fileExt !== 'xls') {
      toast({
        title: "Format file tidak valid",
        description: "Harap unggah file dengan format CSV atau Excel (.xlsx, .xls)",
        variant: "destructive"
      });
      return;
    }
    
    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      setFile(null);
      
      toast({
        title: "Upload Berhasil",
        description: "Data telah berhasil diperbarui",
        variant: "default"
      });
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="h-5 w-5" />
          <span>Upload Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging ? "border-dashboard-accent bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-dashboard-primary">
                <FileSpreadsheet className="h-10 w-10" />
              </div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={handleUpload} disabled={uploading}>
                  {uploading ? "Mengunggah..." : "Upload File"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setFile(null)}
                  disabled={uploading}
                >
                  Batal
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <UploadCloud className="h-10 w-10" />
              </div>
              <div>
                <p className="font-medium text-gray-700">
                  Drag & drop file atau klik untuk memilih
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  File CSV atau Excel (.xlsx, .xls)
                </p>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Pilih File
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </div>
              <div className="text-xs text-gray-500">
                <p className="flex items-center justify-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Maksimal 10MB per file</span>
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Format Terakhir Diupload</p>
          <div className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-gray-500" />
              <span>transponder_data_template.xlsx</span>
            </div>
            <div className="flex items-center text-green-600 gap-1">
              <Check className="h-4 w-4" />
              <span>Valid</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
