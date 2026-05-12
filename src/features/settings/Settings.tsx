import { useState } from "react";
import { Lock, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

const settingsSections = ["General", "Rooms & Pricing", "Taxes & Billing", "Policies"] as const;

const roomCategories = [
  {
    id: "room-standard",
    name: "Standard",
    baseNightlyRate: 3200,
    maxOccupancy: 2,
  },
  {
    id: "room-deluxe-mountain-view",
    name: "Deluxe Mountain View",
    baseNightlyRate: 5200,
    maxOccupancy: 3,
  },
  {
    id: "room-family-suite",
    name: "Family Suite",
    baseNightlyRate: 7400,
    maxOccupancy: 5,
  },
] as const;

export function Settings() {
  const { user, property } = useAuth();
  const [activeSection, setActiveSection] = useState<(typeof settingsSections)[number]>("General");
  const [generalSettings, setGeneralSettings] = useState({
    homestayName: property?.name ?? "",
    fullAddress: property?.address ?? "",
    publicContactNumber: property?.contactPhone ?? "",
    email: user?.email ?? "",
    acceptingNewBookings: true,
  });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [taxPolicySettings, setTaxPolicySettings] = useState({
    roomGst: 12,
    roomLocalTax: 5,
    serviceGst: 18,
    serviceLocalTax: 0,
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    requireGovernmentId: true,
    requirePoliceVerificationForForeignNationals: false,
  });
  const [policySaveStatus, setPolicySaveStatus] = useState<"idle" | "saved">("idle");

  if (user?.role === "Staff") {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Card className="w-full max-w-xl border-rose-200 bg-white shadow-sm">
          <CardHeader className="text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
              <Lock className="h-5 w-5" />
            </div>
            <CardTitle className="mt-4">Access Restricted: Owner Privileges Required</CardTitle>
            <CardDescription>
              Settings and configuration can only be managed by the property owner.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Settings & Configuration
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            {property?.name || "Homestay"} Controls
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Configure core property details, pricing rules, taxes, and policies from one place.
          </p>
        </div>

        <Badge variant="outline">Owner only</Badge>
      </div>

      <Tabs
        defaultValue="General"
        value={activeSection}
        onValueChange={(value) => setActiveSection(value as (typeof settingsSections)[number])}
      >
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <TabsList className="flex h-fit flex-col items-stretch gap-2 rounded-3xl bg-white dark:bg-slate-900 border dark:border-slate-800 p-3 shadow-sm">
            {settingsSections.map((section) => (
              <TabsTrigger
                key={section}
                value={section}
                className="justify-start rounded-2xl px-4 py-3 text-left"
              >
                {section}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="min-w-0">
            <TabsContent value="General" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Update the public-facing property details and booking availability.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {saveStatus === "saved" ? (
                    <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-300">
                      General settings saved for {generalSettings.homestayName || "this property"}.
                    </div>
                  ) : null}

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="homestayName">Homestay Name</Label>
                      <Input
                        id="homestayName"
                        value={generalSettings.homestayName}
                        onChange={(event) =>
                          setGeneralSettings((current) => ({
                            ...current,
                            homestayName: event.target.value,
                          }))
                        }
                        placeholder="Aangan Homestay"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="fullAddress">Full Address</Label>
                      <Input
                        id="fullAddress"
                        value={generalSettings.fullAddress}
                        onChange={(event) =>
                          setGeneralSettings((current) => ({
                            ...current,
                            fullAddress: event.target.value,
                          }))
                        }
                        placeholder="12 Lake View Road, Udaipur, Rajasthan"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="publicContactNumber">Public Contact Number</Label>
                      <Input
                        id="publicContactNumber"
                        value={generalSettings.publicContactNumber}
                        onChange={(event) =>
                          setGeneralSettings((current) => ({
                            ...current,
                            publicContactNumber: event.target.value,
                          }))
                        }
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={generalSettings.email}
                        onChange={(event) =>
                          setGeneralSettings((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        placeholder="hello@yourhomestay.com"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-4">
                    <div>
                      <h3 className="font-medium text-slate-950 dark:text-slate-50">Accepting New Bookings</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Toggle this off to temporarily pause new reservations.
                      </p>
                    </div>

                    <Switch
                      checked={generalSettings.acceptingNewBookings}
                      onClick={() =>
                        setGeneralSettings((current) => ({
                          ...current,
                          acceptingNewBookings: !current.acceptingNewBookings,
                        }))
                      }
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setSaveStatus("saved")}>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="Rooms & Pricing" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Rooms & Pricing</CardTitle>
                  <CardDescription>
                    Manage room categories, nightly rates, and occupancy rules.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    {roomCategories.map((room) => (
                      <div
                        key={room.id}
                        className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-slate-950 dark:text-slate-50">{room.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Configure pricing and occupancy for this room type.</p>
                          </div>

                          <Badge variant="outline">Room Category</Badge>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`${room.id}-rate`}>Base Nightly Rate</Label>
                            <Input
                              id={`${room.id}-rate`}
                              type="number"
                              defaultValue={room.baseNightlyRate}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${room.id}-occupancy`}>Max Occupancy</Label>
                            <Input
                              id={`${room.id}-occupancy`}
                              type="number"
                              defaultValue={room.maxOccupancy}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setRoomDialogOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Create New Room Category
                    </Button>
                  </div>

                  <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <div>
                          <DialogTitle>Create New Room Category</DialogTitle>
                          <DialogDescription>
                            Add a new room type before saving pricing details.
                          </DialogDescription>
                        </div>
                        <DialogClose />
                      </DialogHeader>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="newRoomCategoryName">Room Category Name</Label>
                          <Input id="newRoomCategoryName" placeholder="Premium Forest Suite" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newRoomCategoryRate">Base Nightly Rate</Label>
                          <Input id="newRoomCategoryRate" type="number" placeholder="5800" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newRoomCategoryOccupancy">Max Occupancy</Label>
                          <Input id="newRoomCategoryOccupancy" type="number" placeholder="4" />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setRoomDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setRoomDialogOpen(false)}>Create Category</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="Taxes & Billing" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Taxes & Billing</CardTitle>
                  <CardDescription>
                    Define the tax rules that apply to rooms, food, and services.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {policySaveStatus === "saved" ? (
                    <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-300">
                      Policies and tax settings saved successfully.
                    </div>
                  ) : null}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        Taxes
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Configure the percentage charges that apply to room bookings and kitchen services.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="roomGst">GST on Room Rates (%)</Label>
                        <Input
                          id="roomGst"
                          type="number"
                          value={taxPolicySettings.roomGst}
                          onChange={(event) =>
                            setTaxPolicySettings((current) => ({
                              ...current,
                              roomGst: Number(event.target.value),
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="roomLocalTax">Local Tax on Room Rates (%)</Label>
                        <Input
                          id="roomLocalTax"
                          type="number"
                          value={taxPolicySettings.roomLocalTax}
                          onChange={(event) =>
                            setTaxPolicySettings((current) => ({
                              ...current,
                              roomLocalTax: Number(event.target.value),
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="serviceGst">GST on Food / Kitchen Services (%)</Label>
                        <Input
                          id="serviceGst"
                          type="number"
                          value={taxPolicySettings.serviceGst}
                          onChange={(event) =>
                            setTaxPolicySettings((current) => ({
                              ...current,
                              serviceGst: Number(event.target.value),
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="serviceLocalTax">Local Tax on Food / Kitchen Services (%)</Label>
                        <Input
                          id="serviceLocalTax"
                          type="number"
                          value={taxPolicySettings.serviceLocalTax}
                          onChange={(event) =>
                            setTaxPolicySettings((current) => ({
                              ...current,
                              serviceLocalTax: Number(event.target.value),
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        Policies
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Set standard operating times and guest verification requirements.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="checkInTime">Standard Check-in Time</Label>
                        <Input
                          id="checkInTime"
                          value={taxPolicySettings.checkInTime}
                          onChange={(event) =>
                            setTaxPolicySettings((current) => ({
                              ...current,
                              checkInTime: event.target.value,
                            }))
                          }
                          placeholder="12:00 PM"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="checkOutTime">Standard Check-out Time</Label>
                        <Input
                          id="checkOutTime"
                          value={taxPolicySettings.checkOutTime}
                          onChange={(event) =>
                            setTaxPolicySettings((current) => ({
                              ...current,
                              checkOutTime: event.target.value,
                            }))
                          }
                          placeholder="11:00 AM"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h4 className="font-medium text-slate-950 dark:text-slate-50">Require Government ID (Aadhaar/Passport) for Check-in</h4>
                          <p className="text-sm text-slate-500">
                            Enforce ID collection during the check-in process.
                          </p>
                        </div>

                        <Switch
                          checked={taxPolicySettings.requireGovernmentId}
                          onClick={() =>
                            setTaxPolicySettings((current) => ({
                              ...current,
                              requireGovernmentId: !current.requireGovernmentId,
                            }))
                          }
                        />
                      </div>

                      <Separator />

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <h4 className="font-medium text-slate-950 dark:text-slate-50">Require Local Police Verification Form for Foreign Nationals</h4>
                          <p className="text-sm text-slate-500">
                            Add an extra compliance step for international guests.
                          </p>
                        </div>

                        <Switch
                          checked={taxPolicySettings.requirePoliceVerificationForForeignNationals}
                          onClick={() =>
                            setTaxPolicySettings((current) => ({
                              ...current,
                              requirePoliceVerificationForForeignNationals: !current.requirePoliceVerificationForForeignNationals,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setPolicySaveStatus("saved")}>Save Policies</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="Policies" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Policies</CardTitle>
                  <CardDescription>
                    Control check-in, check-out, and compliance requirements.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-6 text-sm text-slate-500 dark:text-slate-400">
                    Step 4 will combine check-in/out timings, ID checks, and foreign national verification rules.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default Settings;