
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart3, Search, Home, FileText, Package2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AuthHeader from "@/components/AuthHeader";

const Sidebar = () => {
  const location = useLocation();
  const isMobileView = window.innerWidth < 768;
  
  const menuItems = [
    { 
      name: "Dashboard", 
      icon: <Home className="h-5 w-5" />, 
      path: "/" 
    },
    { 
      name: "Sentiment Analysis", 
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/sentiment",
      badge: "New"
    },
    { 
      name: "Product Insights", 
      icon: <Search className="h-5 w-5" />,
      path: "/insights" 
    },
    { 
      name: "Reports", 
      icon: <FileText className="h-5 w-5" />,
      path: "/reports" 
    },
    { 
      name: "Samples", 
      icon: <Package2 className="h-5 w-5" />,
      path: "/samples" 
    }
  ];

  return (
    <div className="min-w-56 bg-white border-r h-screen sticky top-0">
      <div className="flex flex-col h-full">
        {/* Logo and product name */}
        <div className="p-4 border-b flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center text-white font-bold">
              FF
            </div>
            <span className="font-bold text-lg hidden md:inline">Fashion Feedback</span>
          </Link>
          <div className="md:hidden">
            <AuthHeader />
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 p-3 space-y-1 overflow-auto">
          {menuItems.map((item) => (
            <Button
              key={item.name}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left relative",
                location.pathname === item.path ? "font-medium" : "font-normal"
              )}
              asChild
            >
              <Link to={item.path}>
                <span className="mr-2">{item.icon}</span>
                <span className={cn(isMobileView ? "sr-only" : "")}>
                  {item.name}
                </span>
                {item.badge && (
                  <Badge 
                    className="absolute right-2 top-2"
                    variant="tag"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </Button>
          ))}
        </div>
        
        {/* User profile section (desktop only) */}
        <div className="border-t p-3 hidden md:block">
          <AuthHeader />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
