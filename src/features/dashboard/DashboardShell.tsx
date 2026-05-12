import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  BedDouble,
  CalendarDays,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Globe2,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  Settings2,
  Sparkles,
  Sun,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Overview } from "./Overview";
import { OccupancyBoard } from "../occupancy/OccupancyBoard";
import { InventoryList } from "../inventory/InventoryList";
import { StaffTable } from "../staff/StaffTable";
import { BillingView } from "../billing/BillingView";
import { Analytics } from "../analytics/Analytics";
import { ChannelManager } from "../channels/ChannelManager";
import { KitchenPOS } from "../kitchen/KitchenPOS";
import { Settings } from "../settings/Settings";
import { FrontDesk } from "../frontdesk/FrontDesk";
import { RoomsGrid } from "../rooms/RoomsGrid";
import { GuestManagement } from "../guests/GuestManagement";
import { Housekeeping } from "../housekeeping/Housekeeping";
import { Button } from "../../components/ui/button";

type View =
  | "overview"
  | "frontdesk"
  | "occupancy"
  | "rooms"
  | "guests"
  | "housekeeping"
  | "inventory"
  | "staff"
  | "billing"
  | "analytics"
  | "channel"
  | "kitchen"
  | "settings";

const navItems: {
  id: View;
  label: string;
  icon: typeof LayoutDashboard;
  ownerOnly?: boolean;
}[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "frontdesk", label: "Front Desk", icon: Sparkles },
  { id: "occupancy", label: "Booking Calendar", icon: CalendarDays },
  { id: "rooms", label: "Rooms", icon: BedDouble },
  { id: "guests", label: "Guests", icon: UserRound },
  { id: "housekeeping", label: "Housekeeping", icon: ClipboardList },
  { id: "billing", label: "Billing & Folio", icon: CreditCard },
  { id: "kitchen", label: "Kitchen & POS", icon: ChefHat },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "staff", label: "Staff", icon: Users, ownerOnly: true },
  { id: "channel", label: "Channel Sync", icon: Globe2, ownerOnly: true },
  { id: "analytics", label: "Analytics", icon: BarChart3, ownerOnly: true },
  { id: "settings", label: "Settings", icon: Settings2, ownerOnly: true },
];

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export function DashboardShell() {
  const { user, property, setUserRole, logout } = useAuth() as any;
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState<View>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isOwner = user?.role === "Owner";

  const resolvedView = useMemo<View>(() => {
    if (!isOwner && (view === "channel" || view === "staff" || view === "analytics" || view === "settings")) {
      return "overview";
    }
    return view;
  }, [isOwner, view]);

  const navigate = (target: View) => {
    setView(target);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 hidden flex-col overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-5 lg:flex transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent 
          collapsed={sidebarCollapsed} 
          property={property} 
          user={user} 
          isOwner={isOwner} 
          resolvedView={resolvedView} 
          navigate={navigate} 
          setSidebarCollapsed={setSidebarCollapsed} 
          setUserRole={setUserRole} 
        />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar panel */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white dark:bg-slate-900 px-4 py-5 shadow-2xl lg:hidden"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-950 dark:bg-slate-100">
                  <BedDouble className="h-4 w-4 text-white dark:text-slate-950" />
                </div>
                <span className="font-semibold text-slate-950 dark:text-slate-50">Aangan ERP</span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent 
              property={property} 
              user={user} 
              isOwner={isOwner} 
              resolvedView={resolvedView} 
              navigate={navigate} 
              setSidebarCollapsed={setSidebarCollapsed} 
              setUserRole={setUserRole} 
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="rounded-lg p-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-50 capitalize">
                {resolvedView.replace("-", " ")}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
              <button 
                onClick={logout}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 dark:border-rose-900 bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm transition hover:bg-rose-50 dark:hover:bg-rose-950"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content — extra bottom padding on mobile for bottom nav */}
        <main className="flex-1 min-w-0 p-4 pb-24 sm:p-6 sm:pb-6 lg:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={resolvedView}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mx-auto max-w-7xl"
            >
              {resolvedView === "overview" && <Overview />}
              {resolvedView === "frontdesk" && <FrontDesk />}
              {resolvedView === "occupancy" && <OccupancyBoard />}
              {resolvedView === "rooms" && <RoomsGrid />}
              {resolvedView === "guests" && <GuestManagement />}
              {resolvedView === "housekeeping" && <Housekeeping />}
              {resolvedView === "inventory" && <InventoryList />}
              {resolvedView === "staff" && <StaffTable />}
              {resolvedView === "billing" && <BillingView />}
              {resolvedView === "analytics" && <Analytics />}
              {resolvedView === "channel" && <ChannelManager />}
              {resolvedView === "kitchen" && <KitchenPOS />}
              {resolvedView === "settings" && <Settings />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ 
  collapsed = false, 
  property, 
  user, 
  isOwner, 
  resolvedView, 
  navigate, 
  setSidebarCollapsed, 
  setUserRole 
}: { 
  collapsed?: boolean;
  property: any;
  user: any;
  isOwner: boolean;
  resolvedView: View;
  navigate: (target: View) => void;
  setSidebarCollapsed: (v: boolean) => void;
  setUserRole: (role: string) => void;
}) {
  return (
    <>
      {/* Brand */}
      <div className={`mb-6 flex items-center gap-2 ${collapsed ? "justify-center px-0" : "px-2"}`}>
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-950 dark:bg-slate-100">
          <BedDouble className="h-4 w-4 text-white dark:text-slate-950" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
              {property?.name || "Aangan ERP"}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Homestay ERP</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems
          .filter((item) => !item.ownerOnly || isOwner)
          .map((item) => {
            const active = resolvedView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                title={collapsed ? item.label : ""}
                className={`flex items-center rounded-xl transition-all ${
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
                } ${
                  active
                    ? "bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-slate-50"
                }`}
              >
                <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-white dark:text-slate-950" : "text-slate-400 dark:text-slate-500"}`} />
                {!collapsed && <span className="truncate text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto pt-6">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
              {user?.name?.[0]}
            </div>
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-950 dark:text-slate-50">{user?.name}</p>
                <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">{user?.email}</p>
              </div>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                title="Collapse sidebar"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant={isOwner ? "default" : "outline"}
                className="flex-1 px-1 text-[10px] h-7"
                onClick={() => setUserRole("Owner")}
              >
                Owner
              </Button>
              <Button
                size="sm"
                variant={!isOwner ? "default" : "outline"}
                className="flex-1 px-1 text-[10px] h-7"
                onClick={() => setUserRole("Staff")}
              >
                Staff
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DashboardShell;
