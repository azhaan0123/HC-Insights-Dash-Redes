import { NavLink, Link, useLocation, useNavigate } from "react-router";
import { 
  MessageSquarePlus, 
  ChevronRight, 
  UserCog, 
  UserPlus, 
  Settings, 
  Users, 
  Activity, 
  Palette, 
  LayoutTemplate, 
  MessageSquare, 
  BookOpen, 
  Info, 
  LogOut,
  Check,
  Pipette,
  Accessibility,
  Moon,
  Type,
  Contrast,
  HelpCircle,
  ClipboardList,
  FileText,
  Shield,
  LayoutGrid,
} from "../../lib/icons";
import { NAV_ITEMS, HCC_NAV_ITEMS, ACO_NAV_ITEMS, OUTCOMES_NAV_ITEMS, MIPS_NAV_ITEMS, EMPLOYER_NAV_ITEMS, SMARTYPANTS_NAV_ITEMS, SYSTEM_NAV_ITEMS, type NavItem } from "../../lib/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  useSidebar,
} from "../ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Switch } from "../ui/switch";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuCheckboxItem
} from "../ui/dropdown-menu";
import { cn } from "../ui/utils";
import { useState } from "react";
import { useThemeContext } from "../../contexts/ThemeContext";
import { useOnboardingTour } from "../../contexts/OnboardingTourContext";

const THEME_COLORS = [
  { id: "pink", value: "#e32168" },
  { id: "watermelon", value: "#FF6B2B" },
  { id: "blue", value: "#2563eb" },
  { id: "teal", value: "#0d9488" },
  { id: "orange", value: "#f59e0b" },
  { id: "purple", value: "#8b5cf6" },
  { id: "yellow", value: "#fbbf24" },
  { id: "lightblue", value: "#0ea5e9" }
];

function NavMenu({ items }: { items: NavItem[] }) {
  const { pathname } = useLocation();
  return (
    <SidebarMenu>
      {items.map((item) => {
        const active = pathname === item.path || pathname.startsWith(item.path + "/");
        const Icon = item.icon;

        if (item.subItems && item.subItems.length > 0) {
          return (
            <Collapsible
              key={item.key}
              asChild
              defaultOpen={active}
              className="group/collapsible"
            >
              <SidebarMenuItem id={item.tourId}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.label} isActive={active}>
                    <Icon />
                    <span className="truncate flex-1 text-left">{item.label}</span>
                    <ChevronRight className="ml-auto shrink-0 transition-[transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                  <SidebarMenuSub className="pb-2 relative">
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.path;
                      return (
                        <SidebarMenuSubItem key={subItem.key}>
                          <SidebarMenuSubButton asChild isActive={isSubActive}>
                            <NavLink to={subItem.path}>
                              <span>{subItem.label}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        }

        return (
          <SidebarMenuItem key={item.key} id={item.tourId}>
            <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
              <NavLink to={item.path}>
                <Icon />
                <span>{item.label}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function AppSidebar() {
  const { startTour } = useOnboardingTour();
  const navigate = useNavigate();
  const [showAboutVersion, setShowAboutVersion] = useState(false);
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  const isHcc = pathname.startsWith("/hcc");
  const isAco = pathname.startsWith("/aco");
  const isOutcomes = pathname.startsWith("/outcomes");
  const isMips = pathname.startsWith("/mips");
  const isEmployer = pathname.startsWith("/employer");
  const isSmartyPants = pathname.startsWith("/smartypants");

  const { 
    primaryColor, setPrimaryColor, 
    isDarkMode, setIsDarkMode, 
    isHighContrast, setIsHighContrast, 
    isLargeText, setIsLargeText 
  } = useThemeContext();

  let navItems = NAV_ITEMS;
  let groupLabel = "Analytics";

  if (isHcc) {
    navItems = HCC_NAV_ITEMS;
    groupLabel = "HCC Insights";
  } else if (isAco) {
    navItems = ACO_NAV_ITEMS;
    groupLabel = "ACO Insights";
  } else if (isOutcomes) {
    navItems = OUTCOMES_NAV_ITEMS;
    groupLabel = "Patient Outcomes";
  } else if (isMips) {
    navItems = MIPS_NAV_ITEMS;
    groupLabel = "MIPS Nexus";
  } else if (isEmployer) {
    navItems = EMPLOYER_NAV_ITEMS;
    groupLabel = "Employer Analytics";
  } else if (isSmartyPants) {
    navItems = SMARTYPANTS_NAV_ITEMS;
    groupLabel = "SmartyPants DPC";
  }

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-1 py-1.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-sm text-primary-foreground">
            A
          </span>
          {!collapsed && (
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate tracking-tight text-foreground" style={{ fontWeight: 600 }}>
                ACME DPC
              </span>
              <span className="truncate text-[11px] text-muted-foreground/70">Your Logo Here</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="pb-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Workspace Portal">
                <Link to="/" className="text-primary font-bold hover:bg-primary/10 transition-colors">
                  <LayoutGrid className="size-4 text-primary" />
                  <span>Workspace Portal</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {isMips && !collapsed && (
          <div className="px-3 pt-2">
            <select className="w-full text-xs font-semibold bg-muted/50 border border-border rounded-md px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="Dr. Amanda Johnson">Dr. Amanda Johnson</option>
              <option value="Dr. Christopher Nelson">Dr. Christopher Nelson</option>
              <option value="All Providers">All Providers</option>
            </select>
          </div>
        )}
        <SidebarGroup id="tour-step-1">
          <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
          <NavMenu items={navItems} />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <NavMenu items={SYSTEM_NAV_ITEMS} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton id="tour-step-16" tooltip="Get Help" asChild>
              <a href="https://intercom.help/health-compiler-inc/en" target="_blank" rel="noopener noreferrer">
                <HelpCircle />
                <span>Get Help</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu onOpenChange={(open) => { if (!open) setShowAboutVersion(false); }}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton tooltip={isMips ? "Dr. Amanda Johnson" : "HC Superadmin"} className="h-auto py-1.5 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <Avatar className="size-7 rounded-md">
                    <AvatarFallback className={cn("rounded-md text-xs text-primary-foreground", isMips ? "bg-blue-600" : "bg-primary")}>
                      {isMips ? "A" : "HS"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-sm text-foreground">{isMips ? "Dr. Amanda Johnson" : "HC Superadmin"}</span>
                    <span className="truncate text-[11px] text-muted-foreground/70">{isMips ? "Administrator" : "hc_superadmin@gmail.com"}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" side="top" align="center" sideOffset={4}>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8 rounded-md">
                      <AvatarFallback className="rounded-md bg-primary text-xs text-primary-foreground">HS</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium text-foreground">HC Superadmin</span>
                      <span className="truncate text-xs text-muted-foreground">hc_superadmin@gmail.com</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin/users" className="flex items-center cursor-pointer w-full text-foreground hover:text-primary transition-colors">
                    <UserCog className="mr-2 size-4 text-muted-foreground group-hover:text-primary" />
                    <span>Manage Users</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/onboarding" className="flex items-center cursor-pointer w-full text-foreground hover:text-primary transition-colors">
                    <UserPlus className="mr-2 size-4 text-muted-foreground group-hover:text-primary" />
                    <span>Onboarding Management</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/organization" className="flex items-center cursor-pointer w-full text-foreground hover:text-primary transition-colors">
                    <Settings className="mr-2 size-4 text-muted-foreground group-hover:text-primary" />
                    <span>Manage Organization</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/patient-counts" className="flex items-center cursor-pointer w-full text-foreground hover:text-primary transition-colors">
                    <Users className="mr-2 size-4 text-muted-foreground group-hover:text-primary" />
                    <span>Organization Patient Counts</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/integration-batches" className="flex items-center cursor-pointer w-full text-foreground hover:text-primary transition-colors">
                    <Activity className="mr-2 size-4 text-muted-foreground group-hover:text-primary" />
                    <span>Inbound Integration Batches</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/survey-config" className="flex items-center cursor-pointer w-full text-foreground hover:text-primary transition-colors">
                    <ClipboardList className="mr-2 size-4 text-muted-foreground group-hover:text-primary" />
                    <span>Survey Configuration</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/templates" className="flex items-center cursor-pointer w-full text-foreground hover:text-primary transition-colors">
                    <FileText className="mr-2 size-4 text-muted-foreground group-hover:text-primary" />
                    <span>Templates</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/audit-log" className="flex items-center cursor-pointer w-full text-foreground hover:text-primary transition-colors">
                    <Shield className="mr-2 size-4 text-muted-foreground group-hover:text-primary" />
                    <span>Trust & Audit Log</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Palette className="mr-2" />
                    Color Theme
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="p-3 w-[220px]">
                      <div className="font-medium text-foreground/90 text-sm mb-3">Select Primary Color</div>
                      <div className="grid grid-cols-4 gap-2">
                        {THEME_COLORS.map((color) => (
                          <button
                            key={color.id}
                            className={cn(
                              "size-9 rounded-md flex items-center justify-center transition-all",
                              primaryColor === color.value ? "ring-2 ring-ring/30 ring-offset-1" : "hover:scale-110"
                            )}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setPrimaryColor(color.value)}
                          >
                            {primaryColor === color.value && <Check className="size-5 text-white" strokeWidth={3} />}
                          </button>
                        ))}
                        {/* Custom Color Button */}
                        <div className="relative size-9 rounded-md border border-dashed border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer overflow-hidden group">
                          <Pipette className="size-4 text-muted-foreground group-hover:text-foreground/90" />
                          <input 
                            type="color" 
                            className="absolute inset-[-10px] opacity-0 cursor-pointer w-[200%] h-[200%]"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                          />
                        </div>
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Accessibility className="mr-2" />
                    Accessibility
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="w-[200px]">
                      <DropdownMenuItem className="flex items-center justify-between" onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center">
                          <Moon className="mr-2 size-4" />
                          <span>Dark Mode</span>
                        </div>
                        <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center justify-between" onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center">
                          <Contrast className="mr-2 size-4" />
                          <span>High Contrast</span>
                        </div>
                        <Switch checked={isHighContrast} onCheckedChange={setIsHighContrast} />
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center justify-between" onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center">
                          <Type className="mr-2 size-4" />
                          <span>Large Text</span>
                        </div>
                        <Switch checked={isLargeText} onCheckedChange={setIsLargeText} />
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={() => navigate("/admin/survey-config")} className="cursor-pointer">
                  <LayoutTemplate className="mr-2" />
                  Survey Config
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin/templates")} className="cursor-pointer">
                  <MessageSquare className="mr-2" />
                  Templates
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/wiki")} className="cursor-pointer">
                  <BookOpen className="mr-2" />
                  Technical Specs (/wiki)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={startTour} className="cursor-pointer">
                  <BookOpen className="mr-2" />
                  Guide
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault();
                    setShowAboutVersion(true);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAboutVersion(true);
                  }}
                  onMouseLeave={() => setShowAboutVersion(false)}
                >
                  <Info className="mr-2" />
                  <span>About{showAboutVersion && " v24.0.3"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/login")} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
