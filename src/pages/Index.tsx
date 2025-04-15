
import { Activity, Users, Server, AlertCircle, UploadCloud, PieChart, Signal, Radio } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { BandwidthUtilization } from "@/components/dashboard/BandwidthUtilization";
import { TransponderAllocation } from "@/components/dashboard/TransponderAllocation";
import { TerminalStatus } from "@/components/dashboard/TerminalStatus";
import { DataUploadCard } from "@/components/dashboard/DataUploadCard";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [timeRange, setTimeRange] = useState("today");
  
  const metrics = [
    {
      title: "Transponder Aktif",
      value: "24/30",
      icon: <Radio className="w-6 h-6" />,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Utilisasi C-Band",
      value: "72%",
      icon: <Signal className="w-6 h-6" />,
      trend: { value: 5, isPositive: true }
    },
    {
      title: "Utilisasi Ku-Band",
      value: "68%",
      icon: <Server className="w-6 h-6" />,
      trend: { value: 3, isPositive: false }
    },
    {
      title: "Total Terminal",
      value: "1,458",
      icon: <Activity className="w-6 h-6" />,
      trend: { value: 12, isPositive: true }
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-dashboard-primary mb-2">Dashboard Monitoring Satelit</h1>
          <p className="text-gray-600">Monitoring utilisasi transponder satelit</p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-xl font-semibold mb-2 md:mb-0">Ikhtisar Utilisasi</h2>
          <div className="flex space-x-2">
            <Tabs defaultValue={timeRange} onValueChange={setTimeRange}>
              <TabsList>
                <TabsTrigger value="today">Hari Ini</TabsTrigger>
                <TabsTrigger value="week">Minggu Ini</TabsTrigger>
                <TabsTrigger value="month">Bulan Ini</TabsTrigger>
                <TabsTrigger value="quarter">Kuartal</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              trend={metric.trend}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BandwidthUtilization timeRange={timeRange} />
          <TransponderAllocation />
        </div>

        {/* Wrap all TabsContent components inside a single Tabs component */}
        <Tabs defaultValue={timeRange} value={timeRange} onValueChange={setTimeRange}>
          <TabsContent value="today" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <TerminalStatus />
              </div>
              <div>
                <DataUploadCard />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="week" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <TerminalStatus timeRange="week" />
              </div>
              <div>
                <DataUploadCard />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="month" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <TerminalStatus timeRange="month" />
              </div>
              <div>
                <DataUploadCard />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="quarter" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <TerminalStatus timeRange="quarter" />
              </div>
              <div>
                <DataUploadCard />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
