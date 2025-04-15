
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface BandwidthUtilizationProps {
  timeRange: string;
}

export const BandwidthUtilization = ({ timeRange }: BandwidthUtilizationProps) => {
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [band, setBand] = useState("all");
  
  // Mock data - would be replaced with actual API data
  const data = [
    { name: '00:00', cBand: 60, kuBand: 45 },
    { name: '03:00', cBand: 65, kuBand: 48 },
    { name: '06:00', cBand: 68, kuBand: 52 },
    { name: '09:00', cBand: 75, kuBand: 58 },
    { name: '12:00', cBand: 80, kuBand: 62 },
    { name: '15:00', cBand: 72, kuBand: 65 },
    { name: '18:00', cBand: 78, kuBand: 70 },
    { name: '21:00', cBand: 82, kuBand: 68 },
    { name: '00:00', cBand: 78, kuBand: 65 },
  ];

  const chartConfig = {
    cBand: {
      label: "C-Band",
      color: "#0ea5e9",
    },
    kuBand: {
      label: "Ku-Band",
      color: "#6366f1",
    },
  };

  const renderChart = () => {
    if (chartType === "area") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorKuBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" />
            <YAxis unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {(band === "all" || band === "c") && (
              <Area 
                type="monotone" 
                dataKey="cBand" 
                name="C-Band"
                stroke="#0ea5e9" 
                fillOpacity={1} 
                fill="url(#colorCBand)" 
              />
            )}
            {(band === "all" || band === "ku") && (
              <Area 
                type="monotone" 
                dataKey="kuBand" 
                name="Ku-Band"
                stroke="#6366f1" 
                fillOpacity={1} 
                fill="url(#colorKuBand)" 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" />
            <YAxis unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {(band === "all" || band === "c") && (
              <Bar 
                dataKey="cBand" 
                name="C-Band"
                fill="#0ea5e9" 
                radius={[4, 4, 0, 0]}
              />
            )}
            {(band === "all" || band === "ku") && (
              <Bar 
                dataKey="kuBand" 
                name="Ku-Band"
                fill="#6366f1" 
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
          <CardTitle>Utilisasi Bandwidth</CardTitle>
          <div className="flex flex-wrap gap-2">
            <ToggleGroup type="single" value={band} onValueChange={(value) => value && setBand(value)}>
              <ToggleGroupItem value="all" size="sm">Semua</ToggleGroupItem>
              <ToggleGroupItem value="c" size="sm">C-Band</ToggleGroupItem>
              <ToggleGroupItem value="ku" size="sm">Ku-Band</ToggleGroupItem>
            </ToggleGroup>
            
            <ToggleGroup type="single" value={chartType} onValueChange={(value) => value && setChartType(value as "area" | "bar")}>
              <ToggleGroupItem value="area" size="sm">Area</ToggleGroupItem>
              <ToggleGroupItem value="bar" size="sm">Bar</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          {renderChart()}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium text-gray-900">{`Time: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}%`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};
