import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";
import {
  BedDouble,
  CalendarCheck,
  CheckSquare,
  IndianRupee,
  TrendingUp,
  Users,
} from "lucide-react";
import { format, parseISO, isToday, isTomorrow } from "date-fns";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { demoBookings, demoRooms } from "../../data/mockData";

const revenueTrend = [
  { month: "Jan", revenue: 48000 },
  { month: "Feb", revenue: 56000 },
  { month: "Mar", revenue: 63000 },
  { month: "Apr", revenue: 71000 },
  { month: "May", revenue: 88000 },
  { month: "Jun", revenue: 76000 },
  { month: "Jul", revenue: 92000 },
  { month: "Aug", revenue: 84000 },
  { month: "Sep", revenue: 97000 },
  { month: "Oct", revenue: 85000 },
  { month: "Nov", revenue: 101000 },
  { month: "Dec", revenue: 118000 },
];

const bookingSourceData = [
  { name: "Direct", value: 34, color: "#0f172a" },
  { name: "Airbnb", value: 28, color: "#ef4444" },
  { name: "Booking.com", value: 20, color: "#3b82f6" },
  { name: "MakeMyTrip", value: 12, color: "#f97316" },
  { name: "Agoda", value: 6, color: "#10b981" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.07 },
  }),
};

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  index,
}: {
  icon: typeof BedDouble;
  label: string;
  value: string;
  hint: string;
  index: number;
}) {
  return (
    <motion.div custom={index} variants={fadeUp} initial="hidden" animate="visible">
      <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardContent className="flex items-start justify-between gap-4 pt-6">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              {value}
            </div>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</p>
          </div>
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 shadow-md shadow-slate-950/20">
            <Icon className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 shadow-lg text-sm">
      <p className="font-semibold text-slate-950 dark:text-slate-50">{label}</p>
      <p className="text-slate-500 dark:text-slate-400">
        ₹{Number(payload[0].value).toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export function Overview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const kpis = useMemo(() => {
    const occupiedRooms = demoRooms.filter((r) => r.status === "Occupied").length;
    const availableRooms = demoRooms.filter((r) => r.status === "Available").length;
    const occupancyPct = Math.round((occupiedRooms / demoRooms.length) * 100);
    const revenueToday = demoBookings.reduce(
      (sum, b) => sum + (demoRooms.find((r) => r.id === b.roomId)?.nightlyRate ?? 0),
      0,
    );
    const todayCheckIns = demoBookings.filter((b) =>
      isToday(parseISO(b.checkIn)),
    ).length;
    const upcomingCheckIns = demoBookings.filter(
      (b) => isToday(parseISO(b.checkIn)) || isTomorrow(parseISO(b.checkIn)),
    ).length;

    return { occupancyPct, availableRooms, revenueToday, todayCheckIns, upcomingCheckIns };
  }, []);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
          Overview
        </p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
          Good {getGreeting()}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {format(new Date(), "EEEE, d MMMM yyyy")} · Here's what's happening today.
        </p>
      </motion.div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          index={0}
          icon={TrendingUp}
          label="Occupancy Rate"
          value={`${kpis.occupancyPct}%`}
          hint={`${demoRooms.length - kpis.availableRooms} of ${demoRooms.length} rooms occupied`}
        />
        <KpiCard
          index={1}
          icon={IndianRupee}
          label="Revenue Today"
          value={`₹${kpis.revenueToday.toLocaleString("en-IN")}`}
          hint="Estimated from active bookings"
        />
        <KpiCard
          index={2}
          icon={CalendarCheck}
          label="Upcoming Check-ins"
          value={String(kpis.upcomingCheckIns)}
          hint="Today + tomorrow arrivals"
        />
        <KpiCard
          index={3}
          icon={BedDouble}
          label="Available Rooms"
          value={String(kpis.availableRooms)}
          hint="Ready for new bookings"
        />
        <KpiCard
          index={4}
          icon={Users}
          label="OTA Booking Split"
          value="66%"
          hint="OTA-sourced vs direct bookings"
        />
        <KpiCard
          index={5}
          icon={CheckSquare}
          label="Pending Tasks"
          value="4"
          hint="Housekeeping + maintenance"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Revenue trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue across the year (₹)</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenueTrend} barSize={18}>
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: isDark ? "#94a3b8" : "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: isDark ? "#64748b" : "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9" }}
                  />
                  <Bar
                    dataKey="revenue"
                    radius={[6, 6, 0, 0]}
                    fill={isDark ? "#f8fafc" : "#0f172a"}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Booking source pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
              <CardTitle>Booking Sources</CardTitle>
              <CardDescription>Channel split this month</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={bookingSourceData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {bookingSourceData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>
                    )}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Share"]}
                    contentStyle={{
                      borderRadius: 10,
                      fontSize: 12,
                      border: "1px solid #e2e8f0",
                      backgroundColor: isDark ? "#0f172a" : "#fff",
                      borderColor: isDark ? "#1e293b" : "#e2e8f0",
                    }}
                    itemStyle={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                    labelStyle={{ color: isDark ? "#f8fafc" : "#0f172a" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Widgets row */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Today's arrivals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
              <CardTitle>Today's Arrivals</CardTitle>
              <CardDescription>Guests checking in today</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100 dark:divide-slate-800 p-0">
              {demoBookings
                .filter((b) => isToday(parseISO(b.checkIn)) || isTomorrow(parseISO(b.checkIn)))
                .slice(0, 3)
                .map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-950 dark:text-slate-50">
                        {booking.guestName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Room {booking.roomLabel} · Check-in{" "}
                        {format(parseISO(booking.checkIn), "d MMM")}
                      </p>
                    </div>
                    <Badge variant="outline">Arriving</Badge>
                  </div>
                ))}
              {demoBookings.filter(
                (b) => isToday(parseISO(b.checkIn)) || isTomorrow(parseISO(b.checkIn)),
              ).length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-slate-400">
                  No arrivals today or tomorrow.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest reservations across all channels</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100 dark:divide-slate-800 p-0">
              {demoBookings.slice(0, 4).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-950 dark:text-slate-50">
                      {booking.guestName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Room {booking.roomLabel} ·{" "}
                      {format(parseISO(booking.checkIn), "d MMM")} –{" "}
                      {format(parseISO(booking.checkOut), "d MMM")}
                    </p>
                  </div>
                  <Badge variant="success">Confirmed</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export default Overview;
