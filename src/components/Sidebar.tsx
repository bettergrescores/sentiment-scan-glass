
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart3, Search, Home, FileText, Package2, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AuthHeader from "@/components/AuthHeader";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const location = useLocation();
  
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
    <Sidebar>
      <SidebarHeader className="border-b px-3 py-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center text-white font-bold">
            BK
          </div>
          <span className="font-bold text-lg">BlueKaktus</span>
        </div>
        <SidebarTrigger className="absolute right-2 top-4 md:hidden" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    tooltip={item.name}
                    isActive={location.pathname === item.path}
                    asChild
                  >
                    <Link to={item.path}>
                      {item.icon}
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge 
                          className="ml-auto"
                          variant="tag"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-3">
        <AuthHeader />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
