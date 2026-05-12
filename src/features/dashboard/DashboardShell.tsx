import { useMemo, useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { OccupancyBoard } from "../occupancy/OccupancyBoard";
import { InventoryList } from "../inventory/InventoryList";
import { StaffTable } from "../staff/StaffTable";
import { BillingView } from "../billing/BillingView";
import { Analytics } from "../analytics/Analytics";
import { ChannelManager } from "../channels/ChannelManager";
import { KitchenPOS } from "../kitchen/KitchenPOS";
import { Settings } from "../settings/Settings";
import { FrontDesk } from "../frontdesk/FrontDesk";
import { Button } from "../../components/ui/button";

export function DashboardShell() {
  const { user, property, setUserRole, logout } = useAuth() as any;
  const [view, setView] = useState<"frontdesk" | "occupancy" | "inventory" | "staff" | "billing" | "analytics" | "channel" | "kitchen" | "settings">(
    "occupancy",
  );

  const isOwner = user?.role === "Owner";
  const navItemClass = (targetView: typeof view) =>
    `rounded p-2 text-left transition ${
      view === targetView
        ? "bg-slate-950 text-white shadow-sm"
        : "hover:bg-slate-50 text-slate-700"
    }`;

  const resolvedView = useMemo(() => {
    if (view === "channel" && !isOwner) {
      return "occupancy";
    }

    if (view === "staff" && !isOwner) {
      return "occupancy";
    }

    if (view === "analytics" && !isOwner) {
      return "occupancy";
    }

    return view;
  }, [isOwner, view]);

  return (
    <div className="min-h-screen bg-slate-50 lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-6 lg:block">
        <h3 className="text-lg font-semibold">
          {property?.name || "Homestay"}
        </h3>
        <nav className="mt-6 flex flex-col gap-2">
          <button
            className={navItemClass("frontdesk")}
            onClick={() => setView("frontdesk")}
          >
            Front Desk
          </button>
          <button
            className={navItemClass("occupancy")}
            onClick={() => setView("occupancy")}
          >
            Occupancy Board
          </button>
          <button
            className={navItemClass("inventory")}
            onClick={() => setView("inventory")}
          >
            Inventory
          </button>
          <button
            className={navItemClass("billing")}
            onClick={() => setView("billing")}
          >
            Billing & Folio
          </button>
          <button
            className={navItemClass("kitchen")}
            onClick={() => setView("kitchen")}
          >
            Kitchen & POS
          </button>
          {isOwner && (
            <button
              className={navItemClass("staff")}
              onClick={() => setView("staff")}
            >
              Staff Management
            </button>
          )}
          {isOwner && (
            <button
              className={navItemClass("channel")}
              onClick={() => setView("channel")}
            >
              Channel Sync
            </button>
          )}
          {isOwner && (
            <button
              className={navItemClass("analytics")}
              onClick={() => setView("analytics")}
            >
              Analytics
            </button>
          )}
          {isOwner && (
            <button
              className={navItemClass("settings")}
              onClick={() => setView("settings")}
            >
              Settings
            </button>
          )}
        </nav>
      </aside>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Aangan ERP
            </p>
            <h1 className="text-2xl font-bold">
              {property?.name || "Homestay Dashboard"}
            </h1>
            <p className="text-sm text-slate-500">
              {user?.name} · {user?.role}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-slate-600">Role switcher</label>
            <div className="flex items-center gap-2">
              <Button
                variant={user?.role === "Owner" ? "default" : "outline"}
                onClick={() => setUserRole("Owner")}
              >
                Owner
              </Button>
              <Button
                variant={user?.role === "Staff" ? "default" : "outline"}
                onClick={() => setUserRole("Staff")}
              >
                Staff
              </Button>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <main className="pb-8">
          {resolvedView === "frontdesk" && <FrontDesk />}
          {resolvedView === "occupancy" && <OccupancyBoard />}
          {resolvedView === "inventory" && <InventoryList />}
          {resolvedView === "billing" && <BillingView />}
          {resolvedView === "kitchen" && <KitchenPOS />}
          {resolvedView === "settings" && <Settings />}
          {resolvedView === "analytics" && <Analytics />}
          {resolvedView === "staff" && <StaffTable />}
          {resolvedView === "channel" && <ChannelManager />}
        </main>
      </div>
    </div>
  );
}

export default DashboardShell;
