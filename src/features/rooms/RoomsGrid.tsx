import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BedDouble,
  PencilLine,
  CalendarOff,
  CalendarDays,
  Users,
  IndianRupee,
  Wifi,
  Wind,
  Coffee,
  Mountain,
  Plus,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { demoRooms } from "../../data/mockData";
import type { Room } from "../../types";

type RoomStatus = Room["status"];

const statusConfig: Record<
  RoomStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "outline" | "default" }
> = {
  Available: { label: "Available", variant: "success" },
  Occupied: { label: "Occupied", variant: "warning" },
  Maintenance: { label: "Maintenance", variant: "destructive" },
};

const amenityIcons = [Wifi, Wind, Coffee, Mountain];

const amenitiesByType: Record<string, string[]> = {
  "Garden View King": ["Wi-Fi", "AC", "Breakfast", "Garden View"],
  "Twin Comfort": ["Wi-Fi", "AC", "Breakfast", "City View"],
  "Deluxe Family": ["Wi-Fi", "AC", "Breakfast", "Extra Beds"],
  "Sea Breeze Suite": ["Wi-Fi", "AC", "Breakfast", "Sea View"],
  "Compact Studio": ["Wi-Fi", "Fan", "Kitchen"],
  "Courtyard Loft": ["Wi-Fi", "AC", "Work Desk", "Quiet Zone"],
};

const roomImages = [
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80",
  "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400&q=80",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80",
];

const statusFilters: Array<RoomStatus | "All"> = [
  "All",
  "Available",
  "Occupied",
  "Maintenance",
];

function EditPricingDialog({
  room,
  open,
  onClose,
}: {
  room: Room | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pricing — Room {room?.number}</DialogTitle>
          <DialogDescription>
            Update the nightly rate and occupancy for this room type.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nightly-rate">Nightly Rate (₹)</Label>
            <Input
              id="nightly-rate"
              type="number"
              defaultValue={room?.nightlyRate}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-occupancy">Max Occupancy</Label>
            <Input
              id="max-occupancy"
              type="number"
              defaultValue={room?.maxOccupancy}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddRoomDialog({
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
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription>
            Register a new room in your property inventory.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="room-number">Room Number</Label>
            <Input id="room-number" placeholder="e.g. 101" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="room-type">Room Type</Label>
            <Input id="room-type" placeholder="e.g. Deluxe Suite" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nightly-rate">Nightly Rate (₹)</Label>
            <Input id="nightly-rate" type="number" placeholder="4500" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-occupancy">Max Occupancy</Label>
            <Input id="max-occupancy" type="number" placeholder="2" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Add Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BlockDatesDialog({
  room,
  open,
  onClose,
}: {
  room: Room | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block Dates — Room {room?.number}</DialogTitle>
          <DialogDescription>
            Mark a date range as unavailable for new bookings.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="block-from">From</Label>
            <Input id="block-from" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="block-to">To</Label>
            <Input id="block-to" type="date" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Block Dates</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RoomsGrid() {
  const [rooms] = useState<Room[]>(demoRooms);
  const [filter, setFilter] = useState<RoomStatus | "All">("All");
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [blockRoom, setBlockRoom] = useState<Room | null>(null);
  const [addRoomOpen, setAddRoomOpen] = useState(false);

  const filtered = filter === "All" ? rooms : rooms.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Room management
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Rooms
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {rooms.length} rooms total · {rooms.filter((r) => r.status === "Available").length} available
          </p>
        </div>
        <Button onClick={() => setAddRoomOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Room
        </Button>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              filter === s
                ? "border-slate-950 bg-slate-950 dark:border-slate-100 dark:bg-slate-100 text-white dark:text-slate-950"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {s}
            {s !== "All" && (
              <span className={`ml-2 text-xs ${filter === s ? "text-slate-300" : "text-slate-400"}`}>
                {rooms.filter((r) => r.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Room cards grid */}
      <motion.div
        layout
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((room, i) => {
            const amenities = amenitiesByType[room.type] ?? ["Wi-Fi", "AC"];
            const imgSrc = roomImages[i % roomImages.length];
            const { variant } = statusConfig[room.status];

            return (
              <motion.div
                key={room.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                whileHover={{ y: -3 }}
              >
                <Card className="overflow-hidden border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-shadow hover:shadow-lg">
                  {/* Room image */}
                  <div className="relative h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={imgSrc}
                      alt={room.type}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <Badge variant={variant}>{room.status}</Badge>
                    </div>
                    <div className="absolute right-3 top-3 rounded-xl border border-white/20 bg-slate-950/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      Room {room.number}
                    </div>
                  </div>

                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-base">{room.type}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {room.notes}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 pb-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          Up to {room.maxOccupancy} guests
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2">
                        <IndianRupee className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          ₹{room.nightlyRate.toLocaleString("en-IN")}/night
                        </span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1.5">
                      {amenities.slice(0, 4).map((amenity, idx) => {
                        const Icon = amenityIcons[idx % amenityIcons.length];
                        return (
                          <span
                            key={amenity}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-0.5 text-[11px] text-slate-600 dark:text-slate-400"
                          >
                            <Icon className="h-3 w-3 text-slate-400" />
                            {amenity}
                          </span>
                        );
                      })}
                    </div>

                    {/* Quick actions */}
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5 text-xs"
                        onClick={() => setEditRoom(room)}
                      >
                        <PencilLine className="h-3.5 w-3.5" />
                        Edit Pricing
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5 text-xs"
                        onClick={() => setBlockRoom(room)}
                      >
                        <CalendarOff className="h-3.5 w-3.5" />
                        Block Dates
                      </Button>
                      <Button variant="ghost" size="sm" className="px-2">
                        <CalendarDays className="h-4 w-4 text-slate-400" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center">
          <div>
            <BedDouble className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="mt-3 font-medium text-slate-600 dark:text-slate-400">No rooms found</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              No rooms match the selected filter.
            </p>
          </div>
        </div>
      )}

      <AddRoomDialog
        open={addRoomOpen}
        onClose={() => setAddRoomOpen(false)}
      />
      <EditPricingDialog
        room={editRoom}
        open={!!editRoom}
        onClose={() => setEditRoom(null)}
      />
      <BlockDatesDialog
        room={blockRoom}
        open={!!blockRoom}
        onClose={() => setBlockRoom(null)}
      />
    </div>
  );
}

export default RoomsGrid;
