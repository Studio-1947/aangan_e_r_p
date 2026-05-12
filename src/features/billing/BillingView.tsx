import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  PlusCircle,
  ReceiptText,
  Sparkles,
  User2,
} from "lucide-react";
import { format, differenceInCalendarDays, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { demoBookings, demoRooms } from "../../data/mockData";

type FolioCharge = {
  id: string;
  label: string;
  category: "Room charge" | "Local add-on" | "Tax" | "Service";
  amount: number;
  quantity?: number;
  billable?: boolean;
};

type AddChargeForm = {
  label: string;
  amount: string;
};

const activeBooking = demoBookings[0];
const activeRoom =
  demoRooms.find((room) => room.id === activeBooking.roomId) ?? demoRooms[0];

const nightCount = Math.max(
  1,
  differenceInCalendarDays(
    parseISO(activeBooking.checkOut),
    parseISO(activeBooking.checkIn),
  ),
);

const baseCharge: FolioCharge = {
  id: "room-base-charge",
  label: `${activeRoom.type} × ${nightCount} nights`,
  category: "Room charge",
  amount: activeRoom.nightlyRate * nightCount,
  quantity: nightCount,
  billable: true,
};

const seedCharges: FolioCharge[] = [
  baseCharge,
  {
    id: "addon-guided-trek",
    label: "Guided Trek",
    category: "Local add-on",
    amount: 1800,
    quantity: 1,
    billable: true,
  },
  {
    id: "addon-campfire",
    label: "Campfire Setup",
    category: "Local add-on",
    amount: 1200,
    quantity: 1,
    billable: true,
  },
  {
    id: "addon-extra-meals",
    label: "Extra Meals / Kitchen Tab",
    category: "Local add-on",
    amount: 950,
    quantity: 1,
    billable: true,
  },
  {
    id: "service-charge",
    label: "Service Charge",
    category: "Service",
    amount: 250,
    billable: true,
  },
  {
    id: "tax-gst",
    label: "GST (5%)",
    category: "Tax",
    amount: Math.round((baseCharge.amount + 1800 + 1200 + 950 + 250) * 0.05),
    billable: true,
  },
];

function currency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function SectionLabel({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof User2;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-950 dark:text-slate-50">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}

export function BillingView() {
  const [charges, setCharges] = useState<FolioCharge[]>(seedCharges);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<AddChargeForm>({ label: "", amount: "" });

  const roomCharges = useMemo(
    () => charges.filter((charge) => charge.category === "Room charge"),
    [charges],
  );
  const addOns = useMemo(
    () => charges.filter((charge) => charge.category === "Local add-on"),
    [charges],
  );
  const extras = useMemo(
    () =>
      charges.filter(
        (charge) => charge.category === "Service" || charge.category === "Tax",
      ),
    [charges],
  );

  const subtotal = charges.reduce((total, charge) => total + charge.amount, 0);
  const roomChargeTotal = roomCharges.reduce(
    (total, charge) => total + charge.amount,
    0,
  );

  function openAddCharge() {
    setForm({ label: "", amount: "" });
    setDialogOpen(true);
  }

  function handleAddCharge() {
    const label = form.label.trim();
    const amount = Number(form.amount);

    if (!label || !Number.isFinite(amount) || amount <= 0) {
      return;
    }

    setCharges((current) => [
      ...current,
      {
        id: `charge-${Date.now()}`,
        label,
        category: "Local add-on",
        amount,
        quantity: 1,
        billable: true,
      },
    ]);
    setDialogOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Billing & Folio
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Active guest invoice
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Review room charges, add-ons, and checkout totals for the current
            stay.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={openAddCharge}>
            <PlusCircle className="h-4 w-4" />
            Add Charge
          </Button>
          <Button>
            <ReceiptText className="h-4 w-4" />
            Generate Final Invoice / Checkout
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden border-slate-200/80 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Folio for {activeBooking.guestName}
                </CardTitle>
                <CardDescription>
                  Room {activeRoom.number} · Check-in{" "}
                  {format(parseISO(activeBooking.checkIn), "dd MMM yyyy")} ·
                  Check-out{" "}
                  {format(parseISO(activeBooking.checkOut), "dd MMM yyyy")}
                </CardDescription>
              </div>
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Active Stay
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  Guest
                </p>
                <p className="mt-2 font-semibold text-slate-950 dark:text-slate-50">
                  {activeBooking.guestName}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {activeBooking.contact}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  Room
                </p>
                <p className="mt-2 font-semibold text-slate-950 dark:text-slate-50">
                  Room {activeRoom.number}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{activeRoom.type}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  Nights
                </p>
                <p className="mt-2 font-semibold text-slate-950 dark:text-slate-50">
                  {nightCount} nights
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Base rate {currency(activeRoom.nightlyRate)} / night
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <SectionLabel
                icon={Sparkles}
                title="Room charges"
                description="Base room rate multiplied by the number of nights in the stay."
              />
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roomCharges.map((charge) => (
                      <TableRow key={charge.id}>
                        <TableCell className="font-medium text-slate-950 dark:text-slate-50">
                          {charge.label}
                        </TableCell>
                        <TableCell className="text-slate-500 dark:text-slate-400">{charge.quantity ?? 1}</TableCell>
                        <TableCell className="text-slate-500 dark:text-slate-400">{currency(activeRoom.nightlyRate)}</TableCell>
                        <TableCell className="text-right font-semibold text-slate-950 dark:text-slate-50">
                          {currency(charge.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="space-y-3">
              <SectionLabel
                icon={User2}
                title="Local add-ons"
                description="Track guest-facing extras like treks, campfire setup, and kitchen tab items."
              />
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Charge</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {addOns.map((charge) => (
                      <TableRow key={charge.id}>
                        <TableCell className="font-medium text-slate-950 dark:text-slate-50">
                          {charge.label}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{charge.category}</Badge>
                        </TableCell>
                        <TableCell className="text-slate-500 dark:text-slate-400">{charge.quantity ?? 1}</TableCell>
                        <TableCell className="text-right font-semibold text-slate-950 dark:text-slate-50">
                          {currency(charge.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-200/80 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800">
              <CardTitle>Invoice summary</CardTitle>
              <CardDescription>
                Totals update as you add or remove folio charges.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-lg shadow-slate-950/20">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                  Current balance
                </p>
                <div className="mt-2 text-4xl font-semibold tracking-tight">
                  {currency(subtotal)}
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  Includes room charges, add-ons, service, and tax.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Room charges</span>
                  <span className="font-semibold text-slate-950 dark:text-slate-50">
                    {currency(roomChargeTotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Local add-ons</span>
                  <span className="font-semibold text-slate-950 dark:text-slate-50">
                    {currency(
                      addOns.reduce(
                        (total, charge) => total + charge.amount,
                        0,
                      ),
                    )}
                  </span>
                </div>
                {extras.map((charge) => (
                  <div
                    key={charge.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3"
                  >
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {charge.label}
                    </span>
                    <span className="font-semibold text-slate-950 dark:text-slate-50">
                      {currency(charge.amount)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-4 text-sm text-emerald-900 dark:text-emerald-300">
                Final invoice action will lock the folio, create a checkout
                receipt, and mark the booking as closed.
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white dark:bg-slate-900 shadow-sm">
            <CardHeader>
              <CardTitle>Recent folio activity</CardTitle>
              <CardDescription>
                Mock actions for the billing flow in the demo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-6">
              {[
                "Tea service added at breakfast",
                "Campfire setup requested for evening",
                "Late checkout approved till 2 PM",
              ].map((entry) => (
                <div
                  key={entry}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm text-slate-600 dark:text-slate-400"
                >
                  {entry}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Charge</DialogTitle>
            <DialogDescription>
              Add a quick local folio item for this active stay.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                htmlFor="charge-label"
              >
                Charge label
              </label>
              <Input
                id="charge-label"
                value={form.label}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    label: event.target.value,
                  }))
                }
                placeholder="e.g. Bonfire Dessert Platter"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                htmlFor="charge-amount"
              >
                Amount
              </label>
              <Input
                id="charge-amount"
                type="number"
                min="1"
                value={form.amount}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    amount: event.target.value,
                  }))
                }
                placeholder="Enter amount"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCharge}>Add Charge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BillingView;
