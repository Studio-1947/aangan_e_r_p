import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  BedDouble,
  CalendarDays,
  ChefHat,
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

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-slate-950 dark:bg-slate-100">
          <BedDouble className="h-4 w-4 text-white dark:text-slate-950" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
            {property?.name || "Aangan ERP"}
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">Homestay ERP</p>
        </div>
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
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                  active
                    ? "bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-slate-50"
                }`}
              >
                <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-white dark:text-slate-950" : "text-slate-400 dark:text-slate-500"}`} />
                {item.label}
              </button>
            );
          })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto pt-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3">
          <p className="text-xs font-medium text-slate-950 dark:text-slate-50">{user?.name}</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">{user?.email}</p>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              variant={isOwner ? "default" : "outline"}
              className="flex-1 text-xs"
              onClick={() => setUserRole("Owner")}
            >
              Owner
            </Button>
            <Button
              size="sm"
              variant={!isOwner ? "default" : "outline"}
              className="flex-1 text-xs"
              onClick={() => setUserRole("Staff")}
            >
              Staff
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-5 lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col overflow-y-auto border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-5 lg:hidden"
            >
              <button
                className="mb-4 ml-auto flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-60">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 lg:hidden"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500 hidden sm:block">
                Aangan ERP
              </p>
              <h1 className="text-base font-semibold text-slate-950 dark:text-slate-50 sm:text-lg">
                {navItems.find((n) => n.id === resolvedView)?.label ?? "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
              {user?.name}
            </span>
            <span className="hidden rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300 sm:block">
              {user?.role}
            </span>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Logout</span>
            </Button>
          </div>
        </header>

        {/* Page content — extra bottom padding on mobile for bottom nav */}
        <main className="flex-1 p-4 pb-24 sm:p-6 sm:pb-6 lg:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={resolvedView}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {resolvedView === "overview" && <Overview />}
              {resolvedView === "frontdesk" && <FrontDesk />}
              {resolvedView === "occupancy" && <OccupancyBoard />}
              {resolvedView === "rooms" && <RoomsGrid />}
              {resolvedView === "guests" && <GuestManagement />}
              {resolvedView === "housekeeping" && <Housekeeping />}
              {resolvedView === "inventory" && <InventoryList />}
              {resolvedView === "billing" && <BillingView />}
              {resolvedView === "kitchen" && <KitchenPOS />}
              {resolvedView === "settings" && <Settings />}
              {resolvedView === "analytics" && <Analytics />}
              {resolvedView === "staff" && <StaffTable />}
              {resolvedView === "channel" && <ChannelManager />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur lg:hidden">
          {[
            { id: "overview" as View, icon: LayoutDashboard, label: "Home" },
            { id: "occupancy" as View, icon: CalendarDays, label: "Calendar" },
            { id: "frontdesk" as View, icon: Sparkles, label: "Desk" },
            { id: "rooms" as View, icon: BedDouble, label: "Rooms" },
            { id: "billing" as View, icon: CreditCard, label: "Billing" },
          ].map((item) => {
            const active = resolvedView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-center"
              >
                <item.icon
                  className={`h-5 w-5 transition-colors ${active ? "text-slate-950 dark:text-slate-50" : "text-slate-400 dark:text-slate-600"}`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors ${active ? "text-slate-950 dark:text-slate-50" : "text-slate-400 dark:text-slate-600"}`}
                >
                  {item.label}
                </span>
                {active && (
                  <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-slate-950 dark:bg-slate-50" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default DashboardShell;
