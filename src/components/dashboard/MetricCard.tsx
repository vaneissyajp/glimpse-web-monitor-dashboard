
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  icon,
  trend,
  className 
}: MetricCardProps) => {
  return (
    <div className={cn(
      "bg-dashboard-card p-6 rounded-xl shadow-sm", 
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-dashboard-primary">{value}</h3>
          {trend && (
            <p className={cn(
              "text-sm mt-2",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="text-dashboard-accent">
          {icon}
        </div>
      </div>
    </div>
  );
};
