
import { Home, BarChart2, Radio, Database, Upload, Users, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Radio, label: "Transponder", path: "/transponder" },
  { icon: BarChart2, label: "Utilisasi", path: "/utilization" },
  { icon: Database, label: "Terminal", path: "/terminal" },
  { icon: Upload, label: "Upload Data", path: "/upload" },
  { icon: Users, label: "Pengguna", path: "/users" },
  { icon: Settings, label: "Pengaturan", path: "/settings" },
];

export const Sidebar = ({ className }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />
      
      <div className={cn(
        "lg:w-64 bg-dashboard-primary text-white h-screen fixed lg:sticky top-0 z-50 transition-all duration-300 transform",
        isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:translate-x-0",
        className
      )}>
        <div className="flex items-center justify-between p-4 mb-4">
          <h1 className="text-2xl font-bold">SatMonitor</h1>
          <button 
            className="p-1 rounded-full hover:bg-white/10 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="px-2">
          <ul className="space-y-1">
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
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-white/10 p-3 rounded-lg text-sm">
            <p className="font-semibold">Update Terakhir:</p>
            <p className="text-gray-300">18 Apr 2025, 14:30 WIB</p>
          </div>
        </div>
      </div>
      
      <button 
        className="fixed top-4 left-4 z-30 bg-dashboard-primary text-white p-2 rounded-md lg:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
};
