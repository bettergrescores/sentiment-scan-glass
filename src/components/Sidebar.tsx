
import { useState } from "react";
import { Home, BarChart2, Tag, FileText, Database, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const navItems = [
    { title: "Dashboard", icon: Home, path: "/" },
    { title: "Sentiment Analysis", icon: BarChart2, path: "/sentiment" },
    { title: "Product Insights", icon: Tag, path: "/insights" },
    { title: "Reports", icon: FileText, path: "/reports" },
    { title: "Sample Data", icon: Database, path: "/samples" },
  ];

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        {expanded ? <X size={20} /> : <Menu size={20} />}
      </Button>
      <div
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-full",
          expanded ? "w-64 fixed inset-0 z-40" : "w-0 md:w-64",
          "md:relative"
        )}
      >
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary truncate">
            Fashion Feedback Analyzer
          </h1>
        </div>
        <nav className="flex-1 overflow-auto p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors",
                    location.pathname === item.path
                      ? "bg-gray-100 text-primary font-medium"
                      : "text-gray-700"
                  )}
                >
                  <item.icon size={18} />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Fashion Feedback Analyzer v1.0
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
