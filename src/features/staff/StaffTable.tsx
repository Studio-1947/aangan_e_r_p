import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat,
  ClipboardList,
  Mail,
  Phone,
  Plus,
  ShieldAlert,
  UserCheck,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
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
import { useAuth } from "../../context/AuthContext";
import { demoStaff } from "../../data/mockData";

type ShiftStatus = "Active" | "Offline" | "On Leave";
type StaffRole = "Reception" | "Housekeeping" | "Manager" | "Kitchen";

type StaffCard = {
  id: string;
  name: string;
  contact: string;
  role: StaffRole;
  shift: ShiftStatus;
  permissions: string[];
};

const roleIcons: Record<StaffRole, typeof ChefHat> = {
  Reception: UserCheck,
  Housekeeping: ClipboardList,
  Manager: ShieldAlert,
  Kitchen: ChefHat,
};

const shiftConfig: Record<
  ShiftStatus,
  { variant: "success" | "warning" | "outline"; dot: string }
> = {
  Active: { variant: "success", dot: "bg-emerald-500" },
  Offline: { variant: "outline", dot: "bg-slate-300" },
  "On Leave": { variant: "warning", dot: "bg-amber-400" },
};

const permissionsByRole: Record<StaffRole, string[]> = {
  Reception: ["Front Desk", "Bookings", "Guest Check-in", "Billing View"],
  Housekeeping: ["Housekeeping Board", "Inventory View"],
  Manager: ["Front Desk", "Bookings", "Billing", "Staff View", "Analytics View"],
  Kitchen: ["Kitchen POS", "Inventory View"],
};

const shiftCycle: ShiftStatus[] = ["Active", "Offline", "On Leave"];

const initialStaff: StaffCard[] = demoStaff.map((s, i) => ({
  id: s.id,
  name: s.name,
  contact: s.contact,
  role: s.role as StaffRole,
  shift: (["Active", "Offline", "Active"] as ShiftStatus[])[i],
  permissions: permissionsByRole[s.role as StaffRole] ?? [],
}));

type InviteForm = { name: string; role: StaffRole; contact: string };

export function StaffTable() {
  const { user } = useAuth();
  const [staff, setStaff] = useState<StaffCard[]>(initialStaff);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [form, setForm] = useState<InviteForm>({ name: "", role: "Reception", contact: "" });

  if (user?.role === "Staff") {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Card className="w-full max-w-xl border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <CardTitle className="mt-4">Owner Access Only</CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Staff management is restricted to the property owner.
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  function cycleShift(id: string) {
    setStaff((current) =>
      current.map((s) => {
        if (s.id !== id) return s;
        const idx = shiftCycle.indexOf(s.shift);
        return { ...s, shift: shiftCycle[(idx + 1) % shiftCycle.length] };
      }),
    );
  }

  function handleInvite() {
    if (!form.name.trim()) return;
    setStaff((current) => [
      ...current,
      {
        id: `staff-${Date.now()}`,
        name: form.name.trim(),
        contact: form.contact.trim(),
        role: form.role,
        shift: "Offline",
        permissions: permissionsByRole[form.role] ?? [],
      },
    ]);
    setInviteOpen(false);
    setForm({ name: "", role: "Reception", contact: "" });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Staff management
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            Your Team
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {staff.length} team members ·{" "}
            {staff.filter((s) => s.shift === "Active").length} on shift
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="h-4 w-4" />
          Invite Staff
        </Button>
      </div>

      {/* Staff cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {staff.map((member, i) => {
            const RoleIcon = roleIcons[member.role] ?? UserCheck;
            const shift = shiftConfig[member.shift];

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-shadow hover:shadow-lg">
                  <CardContent className="space-y-4 p-5">
                    {/* Avatar + name + shift */}
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 text-base font-bold shadow-md shadow-slate-950/20">
                          {member.name.charAt(0)}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 ${shift.dot}`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-950 dark:text-slate-50">
                          {member.name}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <RoleIcon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                          <span className="text-xs text-slate-500 dark:text-slate-400">{member.role}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => cycleShift(member.id)}
                        title="Click to cycle shift status"
                      >
                        <Badge variant={shift.variant} className="text-[10px] cursor-pointer">
                          {member.shift}
                        </Badge>
                      </button>
                    </div>

                    {/* Contact */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                        <Phone className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        {member.contact || "—"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                        <Mail className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        {member.name.toLowerCase().replace(/\s+/, ".")}@aangan.local
                      </div>
                    </div>

                    {/* Permissions */}
                    <div>
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Permissions
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {member.permissions.map((perm) => (
                          <span
                            key={perm}
                            className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-400"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {staff.length === 0 && (
        <div className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center">
          <div>
            <UserMinus className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
            <p className="mt-3 font-medium text-slate-600 dark:text-slate-400">No staff yet</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Invite your first team member.</p>
            <Button className="mt-4" onClick={() => setInviteOpen(true)}>
              <Plus className="h-4 w-4" />
              Invite Staff
            </Button>
          </div>
        </div>
      )}

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Staff Member</DialogTitle>
            <DialogDescription>
              Add a new team member and assign their role and access level.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="staff-name">Full Name</Label>
              <Input
                id="staff-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Priya Nair"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="staff-contact">Phone Number</Label>
              <Input
                id="staff-contact"
                value={form.contact}
                onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["Reception", "Housekeeping", "Manager", "Kitchen"] as StaffRole[]).map(
                  (role) => (
                    <button
                      key={role}
                      onClick={() => setForm((f) => ({ ...f, role }))}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        form.role === role
                          ? "border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {role}
                    </button>
                  ),
                )}
              </div>
            </div>
            {/* Permissions preview */}
            <div className="md:col-span-2">
              <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                Will be granted access to:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {permissionsByRole[form.role].map((perm) => (
                  <span
                    key={perm}
                    className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 text-[11px] text-slate-600 dark:text-slate-400"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={!form.name.trim()}>
              <UserPlus className="h-4 w-4" />
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StaffTable;
