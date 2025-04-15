
import { Home, BarChart2, Activity, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: BarChart2, label: "Analytics", path: "/analytics" },
  { icon: Activity, label: "Monitoring", path: "/monitoring" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Sidebar = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-64 bg-dashboard-primary text-white h-screen p-4", className)}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Monitor Pro</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <a
                href={item.path}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
