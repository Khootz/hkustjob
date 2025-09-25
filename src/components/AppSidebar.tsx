import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Mail,
  Settings,
  Activity,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Jobs", url: "/jobs", icon: Briefcase },
  { title: "Cover Letters", url: "/cover-letters", icon: FileText },
  { title: "Email Outbox", url: "/emails", icon: Mail },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Activity & Logs", url: "/activity", icon: Activity },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const getNavClass = ({ isActive: active }: { isActive: boolean }) =>
    active
      ? "glass-panel text-primary font-semibold shadow-lg"
      : "glass-button hover:glass-hover text-foreground/80 hover:text-foreground";

  return (
    <Sidebar className={`glass-panel border-r border-glass-border ${state === "collapsed" ? "w-16" : "w-64"}`}>
      <SidebarHeader className="p-6 border-b border-glass-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl gradient-primary">
            <Zap className="h-6 w-6 text-white" />
          </div>
          {state !== "collapsed" && (
            <div>
              <h1 className="text-lg font-bold gradient-text">JobFlow</h1>
              <p className="text-xs text-muted-foreground">Automated Applications</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground mb-3">
            {state !== "collapsed" && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"} 
                      className={getNavClass}
                    >
                      <item.icon className={`h-5 w-5 ${state === "collapsed" ? "mx-auto" : "mr-3"}`} />
                      {state !== "collapsed" && <span className="text-sm font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}