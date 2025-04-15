
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useState } from "react";
import { ChartContainer } from "@/components/ui/chart";

export const TransponderAllocation = () => {
  // Mock data - would be replaced with actual API data
  const data = [
    { name: 'Operasional', value: 12 },
    { name: 'Backup', value: 6 },
    { name: 'TV', value: 8 },
    { name: 'Lainnya', value: 4 },
  ];

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'];
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const chartConfig = {
    Operasional: {
      label: "Operasional",
      color: COLORS[0],
    },
    Backup: {
      label: "Backup",
      color: COLORS[1],
    },
    TV: {
      label: "TV",
      color: COLORS[2],
    },
    Lainnya: {
      label: "Lainnya",
      color: COLORS[3],
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alokasi Transponder</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px] flex flex-col">
          <ChartContainer config={chartConfig} className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} transponder`, name]}
                  contentStyle={{ 
                    borderRadius: "0.375rem",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
                  }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center" 
                  formatter={(value, entry, index) => (
                    <span className="text-sm text-gray-700">{value} ({data[index].value})</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
