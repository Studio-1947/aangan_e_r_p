import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  IndianRupee,
  MessageSquare,
  Plus,
  Search,
  User2,
  UserCheck,
  UserX,
} from "lucide-react";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { demoBookings, demoRooms } from "../../data/mockData";

type GuestRecord = {
  id: string;
  name: string;
  contact: string;
  email?: string;
  totalStays: number;
  totalSpend: number;
  lastStay: string;
  paymentStatus: "Settled" | "Pending";
  preferences: string[];
  notes: string[];
  bookings: typeof demoBookings;
};

const guestData: GuestRecord[] = demoBookings.map((booking) => {
  const room = demoRooms.find((r) => r.id === booking.roomId);
  const nights = differenceInCalendarDays(
    parseISO(booking.checkOut),
    parseISO(booking.checkIn),
  );
  const spend = (room?.nightlyRate ?? 4000) * Math.max(1, nights);

  return {
    id: booking.id,
    name: booking.guestName,
    contact: booking.contact,
    email: `${booking.guestName.toLowerCase().replace(/\s+/, ".")}@demo.com`,
    totalStays: Math.ceil(Math.random() * 3) + 1,
    totalSpend: spend,
    lastStay: booking.checkIn,
    paymentStatus: spend < 6000 ? "Pending" : "Settled",
    preferences: booking.notes.split(",").map((s) => s.trim()).filter(Boolean),
    notes: [
      `Booked Room ${booking.roomLabel} from ${format(parseISO(booking.checkIn), "d MMM")} to ${format(parseISO(booking.checkOut), "d MMM")}`,
    ],
    bookings: [booking],
  };
});

type ActionType = "checkin" | "checkout" | "extend" | null;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05 },
  }),
};

function GuestDetailDialog({
  guest,
  onClose,
}: {
  guest: GuestRecord | null;
  onClose: () => void;
}) {
  const [action, setAction] = useState<ActionType>(null);

  if (!guest) return null;

  return (
    <Dialog open={!!guest} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 text-sm font-bold">
              {guest.name.charAt(0)}
            </div>
            {guest.name}
          </DialogTitle>
          <DialogDescription>{guest.contact} · {guest.email}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3 text-center">
              <p className="text-lg font-semibold text-slate-950 dark:text-slate-50">{guest.totalStays}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Total Stays</p>
            </div>
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3 text-center">
              <p className="text-lg font-semibold text-slate-950 dark:text-slate-50">
                ₹{(guest.totalSpend / 1000).toFixed(0)}k
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Spend</p>
            </div>
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3 text-center">
              <Badge variant={guest.paymentStatus === "Settled" ? "success" : "warning"} className="text-[10px]">
                {guest.paymentStatus}
              </Badge>
              <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">Payment</p>
            </div>
          </div>

          {/* Preferences */}
          {guest.preferences.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Preferences
              </p>
              <div className="flex flex-wrap gap-1.5">
                {guest.preferences.map((pref) => (
                  <span
                    key={pref}
                    className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-0.5 text-xs text-slate-600 dark:text-slate-400"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes timeline */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Notes Timeline
            </p>
            <div className="space-y-2">
              {guest.notes.map((note) => (
                <div
                  key={note}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3"
                >
                  <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                  <p className="text-xs text-slate-600 dark:text-slate-400">{note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          {action && (
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300">
              {action === "checkin" && `Check-in flow initiated for ${guest.name}.`}
              {action === "checkout" && `Checkout flow initiated — routing to Billing & Folio.`}
              {action === "extend" && `Stay extension requested for ${guest.name}.`}
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-wrap gap-2 sm:justify-start">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setAction("checkin")}>
            <UserCheck className="h-4 w-4" />
            Check-in
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setAction("checkout")}>
            <UserX className="h-4 w-4" />
            Check-out
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setAction("extend")}>
            <Clock className="h-4 w-4" />
            Extend Stay
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddGuestDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register New Guest</DialogTitle>
          <DialogDescription>
            Create a guest profile for your property database.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="guest-full-name">Full Name</Label>
            <Input id="guest-full-name" placeholder="e.g. Rahul Mehta" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guest-phone">Phone Number</Label>
              <Input id="guest-phone" placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guest-email-addr">Email Address</Label>
              <Input id="guest-email-addr" type="email" placeholder="rahul@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="guest-pref-notes">Preferences / Notes</Label>
            <Input id="guest-pref-notes" placeholder="e.g. Prefers upper floor, allergic to peanuts" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Create Profile</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function GuestManagement() {
  const [search, setSearch] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<GuestRecord | null>(null);
  const [addGuestOpen, setAddGuestOpen] = useState(false);

  const filtered = useMemo(
    () =>
      guestData.filter(
        (g) =>
          g.name.toLowerCase().includes(search.toLowerCase()) ||
          g.contact.includes(search),
      ),
    [search],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Guest management
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Guests
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {guestData.length} guests · profiles, stay history, and preferences
          </p>
        </div>
        <Button onClick={() => setAddGuestOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Guest
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Guest cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((guest, i) => (
            <motion.div
              key={guest.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.96 }}
              whileHover={{ y: -3 }}
            >
              <Card
                className="cursor-pointer border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-shadow hover:shadow-lg"
                onClick={() => setSelectedGuest(guest)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 text-sm font-bold shadow">
                      {guest.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="truncate text-base">{guest.name}</CardTitle>
                      <CardDescription className="truncate text-xs">
                        {guest.contact}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={guest.paymentStatus === "Settled" ? "success" : "warning"}
                      className="ml-auto shrink-0 text-[10px]"
                    >
                      {guest.paymentStatus}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                      {guest.totalStays} stay{guest.totalStays !== 1 ? "s" : ""}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <IndianRupee className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                      ₹{guest.totalSpend.toLocaleString("en-IN")}
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                      Last stay: {format(parseISO(guest.lastStay), "d MMM yyyy")}
                    </div>
                  </div>

                  {guest.preferences.length > 0 && (
                    <p className="truncate rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400">
                      {guest.preferences[0]}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center">
          <div>
            <User2 className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="mt-3 font-medium text-slate-600 dark:text-slate-400">No guests found</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              Try a different search term.
            </p>
          </div>
        </div>
      )}

      <GuestDetailDialog
        guest={selectedGuest}
        onClose={() => setSelectedGuest(null)}
      />
      <AddGuestDialog
        open={addGuestOpen}
        onClose={() => setAddGuestOpen(false)}
      />
    </div>
  );
}

export default GuestManagement;
