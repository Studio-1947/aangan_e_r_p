import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Globe2,
  LayoutDashboard,
  Link2,
  Send,
  Sparkles,
  Users,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { Button } from "../../components/ui/button";

const features = [
  {
    icon: LayoutDashboard,
    title: "Smart Dashboard",
    description:
      "Real-time occupancy, revenue, and task overview — everything at a glance.",
  },
  {
    icon: CalendarDays,
    title: "Booking Calendar",
    description:
      "Visual room-by-room calendar with multi-day spans, status colors, and quick-add.",
  },
  {
    icon: BedDouble,
    title: "Room Management",
    description:
      "Manage room types, rates, amenities, and availability with one click.",
  },
  {
    icon: Users,
    title: "Guest Profiles",
    description:
      "Full guest history, preferences, notes timeline, and payment status in one place.",
  },
  {
    icon: BarChart3,
    title: "Revenue Analytics",
    description:
      "OTA performance, RevPAR, occupancy trends, and seasonal demand — owner only.",
  },
  {
    icon: UtensilsCrossed,
    title: "Kitchen & POS",
    description:
      "Post F&B charges directly to guest folios. Keep your billing tight.",
  },
];

const otas = [
  { name: "Airbnb", icon: Building2, color: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800" },
  { name: "Booking.com", icon: Globe2, color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { name: "Agoda", icon: Link2, color: "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800" },
  { name: "MakeMyTrip", icon: Send, color: "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-800" },
  { name: "Goibibo", icon: Zap, color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
];

const stats = [
  { value: "2 min", label: "Setup time" },
  { value: "5 OTAs", label: "Integrations" },
  { value: "100%", label: "Frontend demo" },
];

const DashboardMockup = () => (
  <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-950/20">
    {/* Mock topbar */}
    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
      </div>
      <div className="rounded-full bg-slate-200 dark:bg-slate-700 px-3 py-0.5 text-[10px] text-slate-500 dark:text-slate-400">
        Aangan ERP — Dashboard
      </div>
      <div className="h-5 w-14 rounded-full bg-slate-200 dark:bg-slate-700" />
    </div>

    <div className="flex">
      {/* Mock sidebar */}
      <div className="hidden w-36 flex-shrink-0 border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3 sm:block">
        {["Dashboard", "Bookings", "Rooms", "Guests", "Analytics"].map(
          (item, i) => (
            <div
              key={item}
              className={`mb-1 rounded-lg px-3 py-2 text-[10px] font-medium ${
                i === 0
                  ? "bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {item}
            </div>
          ),
        )}
      </div>

      {/* Mock content */}
      <div className="flex-1 p-4">
        {/* KPI cards */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          {[
            { label: "Occupancy", value: "78%" },
            { label: "Revenue", value: "₹1.2L" },
            { label: "Check-ins", value: "3 today" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm"
            >
              <p className="text-[9px] text-slate-400 dark:text-slate-500">{card.label}</p>
              <p className="mt-1 text-sm font-bold text-slate-950 dark:text-slate-50">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Mock bar chart */}
        <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm">
          <p className="mb-2 text-[9px] font-semibold text-slate-400 dark:text-slate-500">
            REVENUE TREND
          </p>
          <div className="flex h-16 items-end gap-1">
            {[40, 55, 45, 70, 60, 80, 65, 90, 75, 88, 95, 100].map(
              (h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-slate-950 to-emerald-500"
                  style={{ height: `${h}%` }}
                />
              ),
            )}
          </div>
        </div>

        {/* Mock booking strip */}
        <div className="mt-3 space-y-1.5">
          {[
            { name: "Karan Verma", room: "101", status: "Checked In", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" },
            { name: "Maya Iyer", room: "103", status: "Arriving", color: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" },
          ].map((b) => (
            <div
              key={b.name}
              className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2"
            >
              <p className="text-[10px] font-medium text-slate-950 dark:text-slate-50">
                {b.name} · Room {b.room}
              </p>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${b.color}`}
              >
                {b.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export function LandingPage({
  onDemoLogin,
  onCreateHomestay,
}: {
  onDemoLogin: () => void;
  onCreateHomestay: () => void;
}) {
  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_50%,#f8fafc_100%)] dark:bg-[linear-gradient(180deg,#0f172a_0%,#1e1b4b_50%,#0f172a_100%)] text-slate-900 dark:text-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-950 dark:bg-slate-100 dark:text-slate-950">
              <Building2 className="h-4 w-4 text-white dark:text-slate-950" />
            </div>
            <span className="font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              Aangan ERP
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onDemoLogin} className="text-sm">
              Sign in
            </Button>
            <Button onClick={onCreateHomestay} className="text-sm">
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6">
        <motion.div
          className="text-center"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 shadow-sm">
              <Sparkles className="h-3 w-3 text-amber-500" />
              Homestay management, simplified
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-6xl"
          >
            Run your homestay like a{" "}
            <span className="bg-gradient-to-r from-slate-950 dark:from-slate-50 via-slate-700 dark:via-slate-300 to-emerald-600 dark:to-emerald-400 bg-clip-text text-transparent">
              modern hotel
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-500 dark:text-slate-400"
          >
            Bookings, billing, housekeeping, OTA sync, and analytics — one
            clean dashboard for small to mid-sized homestay owners.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button size="lg" onClick={onDemoLogin} className="gap-2 px-6">
              <Zap className="h-4 w-4" />
              Try Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onCreateHomestay}
              className="gap-2 px-6"
            >
              Create your homestay
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="mx-auto mt-10 flex max-w-sm flex-wrap items-center justify-center gap-6"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-slate-950 dark:text-slate-50">{stat.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16"
        >
          <DashboardMockup />
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={fadeUp} className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
              Everything you need
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              Built for hospitality operators
            </h2>
            <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
              Every feature is designed around how a real homestay runs — not a
              generic SaaS template.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 shadow-md shadow-slate-950/20">
                  <feature.icon className="h-4.5 w-4.5 h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-950 dark:text-slate-50">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* OTA integrations */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center"
        >
          <motion.div variants={fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
              OTA integrations
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              All your booking channels, one place
            </h2>
            <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
              Connect Airbnb, Booking.com, Agoda, MakeMyTrip, and Goibibo.
              Manage availability and sync from a single channel manager.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            {otas.map((ota) => (
              <motion.div
                key={ota.name}
                whileHover={{ scale: 1.05 }}
                className={`flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-sm ${ota.color}`}
              >
                <ota.icon className="h-5 w-5" />
                <span className="font-semibold text-sm">{ota.name}</span>
                <CheckCircle2 className="h-4 w-4 opacity-60" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-slate-950 dark:bg-slate-800 px-8 py-16 text-center text-white shadow-2xl shadow-slate-950/30"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Ready to start?
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Your property dashboard is{" "}
            <span className="text-emerald-400">waiting</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-slate-400">
            Jump straight into the live demo, or set up your own homestay in
            under two minutes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-white text-slate-950 hover:bg-slate-100"
              onClick={onDemoLogin}
            >
              <Zap className="h-4 w-4" />
              Open Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 text-white hover:bg-slate-800"
              onClick={onCreateHomestay}
            >
              Create Homestay
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-lg bg-slate-950 dark:bg-slate-100">
              <Building2 className="h-3 w-3 text-white dark:text-slate-950" />
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-300">Aangan ERP</span>
          </div>
          <p>Frontend demo · No backend · All data is mocked locally.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
