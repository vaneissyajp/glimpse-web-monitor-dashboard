
import { Activity, Users, Server, AlertCircle } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";

const Index = () => {
  const metrics = [
    {
      title: "Active Users",
      value: "1,234",
      icon: <Users className="w-6 h-6" />,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Server Load",
      value: "68%",
      icon: <Server className="w-6 h-6" />,
      trend: { value: 5, isPositive: false }
    },
    {
      title: "Response Time",
      value: "123ms",
      icon: <Activity className="w-6 h-6" />,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Error Rate",
      value: "0.12%",
      icon: <AlertCircle className="w-6 h-6" />,
      trend: { value: 2, isPositive: true }
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dashboard-primary mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome to your monitoring dashboard</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">System Performance</h2>
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            Chart akan ditambahkan di sini
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
