import { useMemo, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  parseISO,
  isWithinInterval,
} from "date-fns";
import { demoRooms, demoBookings } from "../../data/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export function OccupancyBoard() {
  const [cursorMonth, setCursorMonth] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<{
    roomId: string;
    roomNumber: string;
    date: string;
  } | null>(null);

  const monthStart = startOfMonth(cursorMonth);
  const monthEnd = endOfMonth(cursorMonth);
  const days = useMemo(
    () => eachDayOfInterval({ start: monthStart, end: monthEnd }),
    [monthStart, monthEnd],
  );

  const bookingsByRoom = useMemo(() => {
    const map: Record<string, typeof demoBookings> = {};
    demoRooms.forEach((r) => (map[r.id] = []));
    demoBookings.forEach((b) => {
      if (!map[b.roomId]) map[b.roomId] = [];
      map[b.roomId].push(b);
    });
    return map;
  }, []);

  function handleCellClick(roomId: string, dateISO: string) {
    const room = demoRooms.find((item) => item.id === roomId);
    setSelected({ roomId, roomNumber: room?.number ?? roomId, date: dateISO });
    setDialogOpen(true);
  }

  function renderCell(roomId: string, dayISO: string) {
    const bookings = bookingsByRoom[roomId] || [];
    const booking = bookings.find((b) =>
      isWithinInterval(parseISO(dayISO), {
        start: parseISO(b.checkIn),
        end: parseISO(b.checkOut),
      }),
    );
    return (
      <div
        key={dayISO}
        onClick={() => handleCellClick(roomId, dayISO)}
        className={`flex h-10 cursor-pointer items-center justify-center border-l border-slate-100 text-[11px] font-medium ${booking ? "bg-emerald-100 text-emerald-900" : "bg-white text-slate-300 hover:bg-slate-50"}`}
      >
        {booking ? booking.guestName.split(" ")[0] : ""}
      </div>
    );
  }

  const guestFor = (roomId: string, dateISO: string) => {
    const bookings = bookingsByRoom[roomId] || [];
    return bookings.find((b) =>
      isWithinInterval(parseISO(dateISO), {
        start: parseISO(b.checkIn),
        end: parseISO(b.checkOut),
      }),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button onClick={() => setCursorMonth((d) => subMonths(d, 1))}>
            Previous
          </Button>
          <h2 className="text-lg font-semibold">
            {format(cursorMonth, "MMMM yyyy")}
          </h2>
          <Button onClick={() => setCursorMonth((d) => addMonths(d, 1))}>
            Next
          </Button>
        </div>
      </div>

      <div className="overflow-auto border rounded-md bg-white p-2">
        <div
          className="grid"
          style={{ gridTemplateColumns: `160px repeat(${days.length}, 48px)` }}
        >
          <div className="px-2 py-2 font-semibold">Room</div>
          {days.map((d: Date) => (
            <div
              key={d.toISOString()}
              className="border-l py-2 text-center text-xs text-slate-500"
            >
              {format(d, "d")}
            </div>
          ))}

          {demoRooms.map((room) => (
            <div key={room.id} className="contents">
              <div className="border-t px-2 py-2 font-medium">{`Room ${room.number}`}</div>
              {days.map((d: Date) => {
                const iso = format(d, "yyyy-MM-dd");
                return (
                  <div key={iso + room.id} className="border-t">
                    {renderCell(room.id, iso)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selected
                ? `Quick Add — Room ${selected.roomNumber}`
                : "Quick Add Booking"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {selected ? (
              <div>
                <p className="text-sm text-slate-600">Date: {selected.date}</p>
                {guestFor(selected.roomId, selected.date) ? (
                  <div className="mt-3">
                    <Badge variant="success">Occupied</Badge>
                    <p className="mt-2 text-sm text-slate-700">
                      Guest details are available in the occupied cell and will
                      expand in the next pass.
                    </p>
                  </div>
                ) : (
                  <div className="mt-3">
                    <p className="text-sm text-slate-700">
                      No booking for this date. Use the button below to add a
                      demo booking.
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </DialogDescription>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
            {!selected ? null : guestFor(selected.roomId, selected.date) ? (
              <Button onClick={() => setDialogOpen(false)}>View Guest</Button>
            ) : (
              <Button
                onClick={() => {
                  setDialogOpen(false);
                }}
              >
                Quick Add Booking
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OccupancyBoard;
