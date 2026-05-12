import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Globe2,
  Link2,
  Loader2,
  RefreshCw,
  Send,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";

type SyncStatus = "Connected" | "Syncing" | "Disconnected";

type OTAChannel = {
  id: string;
  name: string;
  icon: typeof Globe2;
  status: SyncStatus;
  lastSync: string;
  enabled: boolean;
  bookingsThisMonth: number;
  revenueThisMonth: number;
};

const initialChannels: OTAChannel[] = [
  {
    id: "ota-mmt",
    name: "MakeMyTrip",
    icon: Send,
    status: "Connected",
    lastSync: "2 min ago",
    enabled: true,
    bookingsThisMonth: 8,
    revenueThisMonth: 42000,
  },
  {
    id: "ota-agoda",
    name: "Agoda",
    icon: Link2,
    status: "Connected",
    lastSync: "5 min ago",
    enabled: true,
    bookingsThisMonth: 5,
    revenueThisMonth: 28000,
  },
  {
    id: "ota-booking",
    name: "Booking.com",
    icon: Globe2,
    status: "Disconnected",
    lastSync: "3 hours ago",
    enabled: false,
    bookingsThisMonth: 0,
    revenueThisMonth: 0,
  },
  {
    id: "ota-airbnb",
    name: "Airbnb",
    icon: Building2,
    status: "Connected",
    lastSync: "1 min ago",
    enabled: true,
    bookingsThisMonth: 12,
    revenueThisMonth: 68000,
  },
  {
    id: "ota-goibibo",
    name: "Goibibo",
    icon: Zap,
    status: "Disconnected",
    lastSync: "Yesterday",
    enabled: false,
    bookingsThisMonth: 0,
    revenueThisMonth: 0,
  },
];

const statusConfig: Record<
  SyncStatus,
  { variant: "success" | "warning" | "outline"; icon: typeof CheckCircle2; dot: string }
> = {
  Connected: { variant: "success", icon: CheckCircle2, dot: "bg-emerald-500" },
  Syncing: { variant: "warning", icon: Loader2, dot: "bg-amber-400" },
  Disconnected: { variant: "outline", icon: AlertCircle, dot: "bg-slate-300" },
};

const OTA_COLORS: Record<string, string> = {
  MakeMyTrip: "#f97316",
  Agoda: "#ef4444",
  "Booking.com": "#3b82f6",
  Airbnb: "#ec4899",
  Goibibo: "#10b981",
  Direct: "#0f172a",
};

export function ChannelManager() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [channels, setChannels] = useState<OTAChannel[]>(initialChannels);
  const [syncingIds, setSyncingIds] = useState<string[]>([]);
  const [masterSync, setMasterSync] = useState(true);

  function toggleChannel(id: string) {
    setChannels((current) =>
      current.map((ch) =>
        ch.id === id
          ? {
              ...ch,
              enabled: !ch.enabled,
              status: ch.enabled ? "Disconnected" : "Connected",
            }
          : ch,
      ),
    );
  }

  function syncChannel(id: string) {
    setSyncingIds((ids) => [...ids, id]);
    setChannels((current) =>
      current.map((ch) => (ch.id === id ? { ...ch, status: "Syncing" } : ch)),
    );
    setTimeout(() => {
      setSyncingIds((ids) => ids.filter((i) => i !== id));
      setChannels((current) =>
        current.map((ch) =>
          ch.id === id ? { ...ch, status: "Connected", lastSync: "Just now", enabled: true } : ch,
        ),
      );
    }, 2000);
  }

  const revenueData = channels
    .filter((ch) => ch.revenueThisMonth > 0)
    .map((ch) => ({ name: ch.name, revenue: ch.revenueThisMonth }));

  const totalRevenue = channels.reduce((s, ch) => s + ch.revenueThisMonth, 0);
  const connectedCount = channels.filter((ch) => ch.status === "Connected").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Multi-channel booking manager
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Channel Manager
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {connectedCount} of {channels.length} channels connected · Manage availability sync.
          </p>
        </div>

        {/* Master sync toggle */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm font-medium text-slate-950 dark:text-slate-50">Master Auto-Sync</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sync all connected channels.</p>
            </div>
            <Switch
              checked={masterSync}
              onClick={() => setMasterSync((v) => !v)}
            />
          </div>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Connected Channels", value: connectedCount },
          { label: "Bookings This Month", value: channels.reduce((s, ch) => s + ch.bookingsThisMonth, 0) },
          { label: "OTA Revenue", value: `₹${(totalRevenue / 1000).toFixed(0)}k` },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="pt-5">
                <p className="text-sm text-slate-500 dark:text-slate-400">{kpi.label}</p>
                <p className="mt-1 text-3xl font-semibold text-slate-950 dark:text-slate-50">{kpi.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* OTA channel cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {channels.map((channel, i) => {
          const config = statusConfig[channel.status];
          const StatusIcon = channel.status === "Syncing" ? Loader2 : config.icon;
          const isSyncing = syncingIds.includes(channel.id);

          return (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -3 }}
            >
              <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-shadow hover:shadow-lg">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="grid h-10 w-10 place-items-center rounded-2xl text-white shadow-md"
                        style={{ backgroundColor: OTA_COLORS[channel.name] ?? "#0f172a" }}
                      >
                        <channel.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{channel.name}</CardTitle>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${config.dot} ${isSyncing ? "animate-pulse" : ""}`} />
                          <CardDescription className="text-[11px]">
                            {isSyncing ? "Syncing…" : channel.status}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                    <Badge variant={config.variant} className="text-[10px]">
                      <StatusIcon className={`mr-1 h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
                      {isSyncing ? "Syncing" : channel.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 p-4">
                  {channel.status === "Connected" && (
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2">
                        <p className="text-base font-semibold text-slate-950 dark:text-slate-50">
                          {channel.bookingsThisMonth}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">Bookings</p>
                      </div>
                      <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2">
                        <p className="text-base font-semibold text-slate-950 dark:text-slate-50">
                          ₹{(channel.revenueThisMonth / 1000).toFixed(0)}k
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">Revenue</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5">
                    <div>
                      <p className="text-xs font-medium text-slate-950 dark:text-slate-50">Channel sync</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        Last: {channel.lastSync}
                      </p>
                    </div>
                    <Switch
                      checked={channel.enabled}
                      onClick={() => toggleChannel(channel.id)}
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full gap-2 text-xs"
                    size="sm"
                    disabled={isSyncing}
                    onClick={() => syncChannel(channel.id)}
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                    {isSyncing ? "Syncing…" : channel.enabled ? "Sync Now" : "Connect"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue bar chart */}
      {revenueData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
              <CardTitle>OTA Revenue Split</CardTitle>
              <CardDescription>Revenue contribution per channel this month</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueData} barSize={32}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]}
                    contentStyle={{
                      borderRadius: 10,
                      fontSize: 12,
                      border: "1px solid #e2e8f0",
                      backgroundColor: isDark ? "#0f172a" : "#fff",
                      borderColor: isDark ? "#1e293b" : "#e2e8f0",
                    }}
                    itemStyle={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                    labelStyle={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                    cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9" }}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                    {revenueData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.name === "Direct" && isDark ? "#f8fafc" : (OTA_COLORS[entry.name] ?? "#0f172a")}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

export default ChannelManager;
