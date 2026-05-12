import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  isToday,
  isWithinInterval,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
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
import type { Booking } from "../../types";

type BookingStatus = "Confirmed" | "Pending" | "Checked In" | "Checked Out" | "Cancelled";

type ExtendedBooking = Booking & { status: BookingStatus; otaSource: string };

const statusColors: Record<BookingStatus, string> = {
  Confirmed: "bg-emerald-500",
  Pending: "bg-amber-400",
  "Checked In": "bg-blue-500",
  "Checked Out": "bg-slate-400",
  Cancelled: "bg-rose-400",
};

const statusBadgeVariant: Record<BookingStatus, string> = {
  Confirmed: "success",
  Pending: "warning",
  "Checked In": "outline",
  "Checked Out": "outline",
  Cancelled: "destructive",
};

const otaSources = ["Direct", "Airbnb", "Booking.com", "MakeMyTrip", "Agoda"];

const extendedBookings: ExtendedBooking[] = demoBookings.map((b, i) => ({
  ...b,
  status: (["Confirmed", "Checked In", "Confirmed", "Pending"] as BookingStatus[])[i % 4],
  otaSource: otaSources[i % otaSources.length],
}));

type NewBookingForm = {
  guestName: string;
  contact: string;
  checkIn: string;
  checkOut: string;
  notes: string;
};

export function OccupancyBoard() {
  const [cursorMonth, setCursorMonth] = useState(new Date());
  const [bookings, setBookings] = useState<ExtendedBooking[]>(extendedBookings);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ExtendedBooking | null>(null);
  const [addContext, setAddContext] = useState<{ roomId: string; date: string } | null>(null);
  const [newForm, setNewForm] = useState<NewBookingForm>({
    guestName: "",
    contact: "",
    checkIn: "",
    checkOut: "",
    notes: "",
  });

  const monthStart = startOfMonth(cursorMonth);
  const monthEnd = endOfMonth(cursorMonth);
  const days = useMemo(
    () => eachDayOfInterval({ start: monthStart, end: monthEnd }),
    [monthStart, monthEnd],
  );

  const bookingsByRoom = useMemo(() => {
    const map: Record<string, ExtendedBooking[]> = {};
    demoRooms.forEach((r) => (map[r.id] = []));
    bookings.forEach((b) => {
      if (!map[b.roomId]) map[b.roomId] = [];
      map[b.roomId].push(b);
    });
    return map;
  }, [bookings]);

  function getBookingForCell(roomId: string, dayISO: string): ExtendedBooking | null {
    return (
      (bookingsByRoom[roomId] ?? []).find((b) =>
        isWithinInterval(parseISO(dayISO), {
          start: parseISO(b.checkIn),
          end: parseISO(b.checkOut),
        }),
      ) ?? null
    );
  }

  function isSpanStart(booking: ExtendedBooking, dayISO: string): boolean {
    return booking.checkIn === dayISO;
  }

  function handleCellClick(roomId: string, dayISO: string) {
    const booking = getBookingForCell(roomId, dayISO);
    if (booking) {
      setSelectedBooking(booking);
      setDetailOpen(true);
    } else {
      setAddContext({ roomId, date: dayISO });
      setNewForm((f) => ({ ...f, checkIn: dayISO, checkOut: dayISO }));
      setAddOpen(true);
    }
  }

  function handleAddBooking() {
    if (!addContext || !newForm.guestName.trim()) return;
    const room = demoRooms.find((r) => r.id === addContext.roomId);
    const newBooking: ExtendedBooking = {
      id: `bk-${Date.now()}`,
      guestName: newForm.guestName.trim(),
      contact: newForm.contact.trim(),
      roomId: addContext.roomId,
      roomLabel: room?.number ?? "",
      checkIn: newForm.checkIn,
      checkOut: newForm.checkOut || newForm.checkIn,
      notes: newForm.notes,
      status: "Pending",
      otaSource: "Direct",
    };
    setBookings((b) => [...b, newBooking]);
    setAddOpen(false);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Booking calendar
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Occupancy Board
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCursorMonth((d) => subMonths(d, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-32 text-center text-sm font-semibold text-slate-950 dark:text-slate-50">
            {format(cursorMonth, "MMMM yyyy")}
          </span>
          <Button variant="outline" size="sm" onClick={() => setCursorMonth((d) => addMonths(d, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={() => { setAddContext(null); setAddOpen(true); }}>
            <Plus className="h-4 w-4" />
            Add Booking
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        {(Object.keys(statusColors) as BookingStatus[]).map((status) => (
          <span key={status} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${statusColors[status]}`} />
            {status}
          </span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="overflow-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <div
          className="grid"
          style={{ gridTemplateColumns: `140px repeat(${days.length}, minmax(36px, 44px))` }}
        >
          {/* Header row */}
          <div className="sticky left-0 z-10 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Room
          </div>
          {days.map((d) => (
            <div
              key={d.toISOString()}
              className={`border-b border-l border-slate-100 dark:border-slate-800 py-2 text-center text-[11px] font-medium ${
                isToday(d)
                  ? "bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              {format(d, "d")}
            </div>
          ))}

          {/* Room rows */}
          {demoRooms.map((room) => (
            <div key={room.id} className="contents">
              <div className="sticky left-0 z-10 flex items-center gap-2 border-b border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2">
                <div>
                  <p className="text-xs font-semibold text-slate-950 dark:text-slate-50">
                    Room {room.number}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-22.5">
                    {room.type}
                  </p>
                </div>
              </div>
              {days.map((d) => {
                const iso = format(d, "yyyy-MM-dd");
                const booking = getBookingForCell(room.id, iso);
                const isStart = booking ? isSpanStart(booking, iso) : false;
                const spanWidth = booking
                  ? Math.min(
                      differenceInCalendarDays(
                        parseISO(booking.checkOut),
                        parseISO(booking.checkIn),
                      ) + 1,
                      differenceInCalendarDays(monthEnd, parseISO(iso)) + 1,
                    )
                  : 0;

                return (
                  <div
                    key={iso + room.id}
                    className="relative border-b border-l border-slate-100 dark:border-slate-800"
                    style={{ minHeight: 40 }}
                  >
                    {/* Booking block — only render on span start */}
                    {booking && isStart && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0.8 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        className={`absolute inset-y-1 left-0.5 z-10 flex cursor-pointer items-center overflow-hidden rounded-md px-2 text-[10px] font-semibold text-white shadow-sm ${statusColors[booking.status]}`}
                        style={{
                          width: `calc(${spanWidth * 100}% + ${(spanWidth - 1) * 1}px)`,
                          minWidth: 32,
                        }}
                        onClick={() => {
                          setSelectedBooking(booking);
                          setDetailOpen(true);
                        }}
                        title={`${booking.guestName} · ${booking.checkIn} – ${booking.checkOut}`}
                      >
                        <span className="truncate">
                          {booking.guestName.split(" ")[0]}
                        </span>
                      </motion.div>
                    )}
                    {/* Empty cell click target */}
                    {!booking && (
                      <button
                        className="absolute inset-0 w-full hover:bg-slate-50 dark:hover:bg-slate-800"
                        onClick={() => handleCellClick(room.id, iso)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Booking detail dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              {selectedBooking?.guestName} · Room {selectedBooking?.roomLabel}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Guest</p>
                  <p className="mt-1 text-sm font-semibold">{selectedBooking.guestName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedBooking.contact}</p>
                </div>
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Status</p>
                  <div className="mt-1">
                    <Badge variant={statusBadgeVariant[selectedBooking.status] as any}>
                      {selectedBooking.status}
                    </Badge>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Check-in</p>
                  <p className="mt-1 text-sm font-semibold">
                    {format(parseISO(selectedBooking.checkIn), "d MMM yyyy")}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Check-out</p>
                  <p className="mt-1 text-sm font-semibold">
                    {format(parseISO(selectedBooking.checkOut), "d MMM yyyy")}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">OTA Source</p>
                  <p className="mt-1 text-sm font-semibold">{selectedBooking.otaSource}</p>
                </div>
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Room</p>
                  <p className="mt-1 text-sm font-semibold">Room {selectedBooking.roomLabel}</p>
                </div>
              </div>
              {selectedBooking.notes && (
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-3">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Notes</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add booking dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Booking</DialogTitle>
            <DialogDescription>
              {addContext
                ? `Room ${demoRooms.find((r) => r.id === addContext.roomId)?.number ?? ""} · ${addContext.date}`
                : "Create a new booking."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="new-guest">Guest Name</Label>
              <Input
                id="new-guest"
                value={newForm.guestName}
                onChange={(e) => setNewForm((f) => ({ ...f, guestName: e.target.value }))}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-contact">Contact</Label>
              <Input
                id="new-contact"
                value={newForm.contact}
                onChange={(e) => setNewForm((f) => ({ ...f, contact: e.target.value }))}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Room</Label>
              <Input
                disabled
                value={
                  addContext
                    ? `Room ${demoRooms.find((r) => r.id === addContext.roomId)?.number ?? ""}`
                    : "—"
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-checkin">Check-in</Label>
              <Input
                id="new-checkin"
                type="date"
                value={newForm.checkIn}
                onChange={(e) => setNewForm((f) => ({ ...f, checkIn: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-checkout">Check-out</Label>
              <Input
                id="new-checkout"
                type="date"
                value={newForm.checkOut}
                onChange={(e) => setNewForm((f) => ({ ...f, checkOut: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="new-notes">Notes</Label>
              <Input
                id="new-notes"
                value={newForm.notes}
                onChange={(e) => setNewForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Special requests, dietary notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBooking} disabled={!newForm.guestName.trim()}>
              Add Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OccupancyBoard;
