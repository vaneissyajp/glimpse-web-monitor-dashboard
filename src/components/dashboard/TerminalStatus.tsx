
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TerminalStatusProps {
  timeRange?: string;
}

export const TerminalStatus = ({ timeRange = "today" }: TerminalStatusProps) => {
  // Mock data - would be replaced with actual API data
  const barData = [
    { name: 'Transponder 1', operasional: 125, nonOperasional: 12 },
    { name: 'Transponder 2', operasional: 98, nonOperasional: 8 },
    { name: 'Transponder 3', operasional: 156, nonOperasional: 15 },
    { name: 'Transponder 4', operasional: 172, nonOperasional: 9 },
    { name: 'Transponder 5', operasional: 132, nonOperasional: 11 },
    { name: 'Transponder 6', operasional: 116, nonOperasional: 14 },
  ];

  const tableData = [
    { id: 1, terminal: "KCS-001", network: "VSAT", workUnitType: "Kantor Pusat", status: "Aktif", lastUpdated: "18/04/2025 13:45" },
    { id: 2, terminal: "KCS-046", network: "VSAT", workUnitType: "Cabang", status: "Aktif", lastUpdated: "18/04/2025 13:32" },
    { id: 3, terminal: "KCS-089", network: "RF", workUnitType: "Cabang", status: "Nonaktif", lastUpdated: "17/04/2025 08:15" },
    { id: 4, terminal: "KCS-102", network: "VSAT", workUnitType: "Unit", status: "Aktif", lastUpdated: "18/04/2025 12:50" },
    { id: 5, terminal: "KCS-113", network: "RF", workUnitType: "Unit", status: "Aktif", lastUpdated: "18/04/2025 10:22" },
  ];

  const chartConfig = {
    operasional: {
      label: "Operasional",
      color: "#0ea5e9",
    },
    nonOperasional: {
      label: "Non-Operasional",
      color: "#f87171",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Terminal</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Grafik</TabsTrigger>
            <TabsTrigger value="table">Tabel</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="space-y-4">
            <ChartContainer config={chartConfig} className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} terminal`, undefined]}
                    contentStyle={{ 
                      borderRadius: "0.375rem",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="operasional" 
                    name="Operasional" 
                    stackId="a" 
                    fill="#0ea5e9"
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="nonOperasional" 
                    name="Non-Operasional" 
                    stackId="a" 
                    fill="#f87171"
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="table">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Terminal</TableHead>
                    <TableHead>Jaringan</TableHead>
                    <TableHead>Tipe Unit Kerja</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Update Terakhir</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell className="font-medium">{row.terminal}</TableCell>
                      <TableCell>{row.network}</TableCell>
                      <TableCell>{row.workUnitType}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          row.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {row.status}
                        </span>
                      </TableCell>
                      <TableCell>{row.lastUpdated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
