
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  description?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  icon,
  trend,
  className,
  description
}: MetricCardProps) => {
  return (
    <div className={cn(
      "bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md", 
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            {description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <h3 className="text-2xl font-semibold text-dashboard-primary">{value}</h3>
          {trend && (
            <p className={cn(
              "text-sm mt-2 flex items-center",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              <span className="text-xs text-gray-500 ml-1">vs. minggu lalu</span>
            </p>
          )}
        </div>
        <div className="text-dashboard-accent p-2 bg-blue-50 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};
