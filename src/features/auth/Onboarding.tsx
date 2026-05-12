import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Hotel,
  Home,
  Tent,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../context/AuthContext";

type PropertyType = "Homestay" | "Boutique Hotel" | "Hostel" | "Glamping";

type FormState = {
  ownerName: string;
  homestayName: string;
  fullAddress: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  propertyType: PropertyType | "";
  totalRooms: string;
  otas: string[];
  baseNightlyRate: string;
};

const propertyTypes: { type: PropertyType; icon: typeof Home; desc: string }[] = [
  { type: "Homestay", icon: Home, desc: "Family-run with personal touch" },
  { type: "Boutique Hotel", icon: Hotel, desc: "Small curated property" },
  { type: "Hostel", icon: Building2, desc: "Budget shared accommodation" },
  { type: "Glamping", icon: Tent, desc: "Outdoor luxury experience" },
];

const otaOptions = ["Airbnb", "Booking.com", "MakeMyTrip", "Agoda", "Goibibo"];

const STEPS = [
  "Property Details",
  "Property Type",
  "Room Count",
  "OTA Selection",
  "Pricing Setup",
  "All Done",
];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.2 },
  }),
};

export function Onboarding({ onBackToLogin }: { onBackToLogin: () => void }) {
  const { registerNewProperty } = useAuth();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState<FormState>({
    ownerName: "",
    homestayName: "",
    fullAddress: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    propertyType: "",
    totalRooms: "",
    otas: [],
    baseNightlyRate: "",
  });

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setSubmitError("");
  }

  function toggleOta(ota: string) {
    setForm((f) => ({
      ...f,
      otas: f.otas.includes(ota) ? f.otas.filter((o) => o !== ota) : [...f.otas, ota],
    }));
  }

  function validateStep(): boolean {
    const newErrors: typeof errors = {};
    if (step === 0) {
      if (!form.ownerName.trim()) newErrors.ownerName = "Required";
      if (!form.homestayName.trim()) newErrors.homestayName = "Required";
      if (!form.fullAddress.trim()) newErrors.fullAddress = "Required";
      if (!form.phoneNumber.trim()) newErrors.phoneNumber = "Required";
      if (!form.email.trim()) newErrors.email = "Required";
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email";
      if (!form.password) newErrors.password = "Required";
      else if (form.password.length < 6) newErrors.password = "Min 6 characters";
      if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Passwords don't match";
    }
    if (step === 1 && !form.propertyType) newErrors.propertyType = "Select a type";
    if (step === 2) {
      const n = Number(form.totalRooms);
      if (!form.totalRooms || !Number.isInteger(n) || n < 1) newErrors.totalRooms = "Enter a valid room count";
    }
    if (step === 4 && form.baseNightlyRate && Number(form.baseNightlyRate) < 1) {
      newErrors.baseNightlyRate = "Enter a valid rate";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function goNext() {
    if (!validateStep()) return;
    if (step === 4) {
      const result = registerNewProperty({
        ownerName: form.ownerName.trim(),
        homestayName: form.homestayName.trim(),
        fullAddress: form.fullAddress.trim(),
        phoneNumber: form.phoneNumber.trim(),
        totalRooms: Number(form.totalRooms),
        email: form.email.trim(),
        password: form.password,
      });
      if (!result.ok) {
        setSubmitError(result.error);
        return;
      }
    }
    setDir(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.10),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.5),transparent_28%),linear-gradient(180deg,#0f172a_0%,#1e1b4b_100%)] px-4 py-8 text-slate-900 dark:text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center">
        <Card className="w-full overflow-hidden border-slate-200/80 dark:border-slate-700 bg-white/92 dark:bg-slate-900 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.30)] backdrop-blur-xl">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-linear-to-b from-slate-50/95 dark:from-slate-800/50 to-white/95 dark:to-slate-900/95 pb-4">
            {/* Logo */}
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 shadow-sm">
              <Building2 className="h-3.5 w-3.5 text-slate-900 dark:text-slate-100" />
              New Homestay Setup
            </div>

            {/* Step progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Step {step + 1} of {STEPS.length}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">{STEPS[step]}</span>
              </div>
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      i <= step ? "bg-slate-950 dark:bg-slate-100" : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="overflow-hidden pt-6 pb-2">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Step 0 — Property Details */}
                {step === 0 && (
                  <div className="space-y-4">
                    <div>
                      <CardTitle className="text-2xl">Property Details</CardTitle>
                      <CardDescription className="mt-1">
                        Tell us about your property and create your account.
                      </CardDescription>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Owner Name" error={errors.ownerName}>
                        <Input value={form.ownerName} onChange={(e) => update("ownerName", e.target.value)} placeholder="Aarav Mehta" />
                      </Field>
                      <Field label="Homestay Name" error={errors.homestayName}>
                        <Input value={form.homestayName} onChange={(e) => update("homestayName", e.target.value)} placeholder="Aangan Homestay" />
                      </Field>
                      <Field label="Full Address" error={errors.fullAddress} className="md:col-span-2">
                        <Input value={form.fullAddress} onChange={(e) => update("fullAddress", e.target.value)} placeholder="12 Lake View Road, Udaipur" />
                      </Field>
                      <Field label="Phone Number" error={errors.phoneNumber}>
                        <Input value={form.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value)} placeholder="+91 98765 43210" />
                      </Field>
                      <Field label="Email" error={errors.email}>
                        <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="owner@yourhomestay.com" />
                      </Field>
                      <Field label="Password" error={errors.password}>
                        <Input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Min 6 characters" />
                      </Field>
                      <Field label="Confirm Password" error={errors.confirmPassword}>
                        <Input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} placeholder="Re-enter password" />
                      </Field>
                    </div>
                  </div>
                )}

                {/* Step 1 — Property Type */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <CardTitle className="text-2xl">Property Type</CardTitle>
                      <CardDescription className="mt-1">
                        What best describes your property?
                      </CardDescription>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {propertyTypes.map(({ type, icon: Icon, desc }) => (
                        <button
                          key={type}
                          onClick={() => update("propertyType", type)}
                          className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                            form.propertyType === type
                              ? "border-slate-950 dark:border-slate-100 bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 shadow-lg"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${form.propertyType === type ? "text-white dark:text-slate-950" : "text-slate-400 dark:text-slate-500"}`} />
                          <div>
                            <p className="font-semibold">{type}</p>
                            <p className={`text-sm ${form.propertyType === type ? "text-slate-300 dark:text-slate-600" : "text-slate-500 dark:text-slate-400"}`}>{desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.propertyType && <p className="text-sm text-rose-600 dark:text-rose-400">{errors.propertyType}</p>}
                  </div>
                )}

                {/* Step 2 — Room Count */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <CardTitle className="text-2xl">Room Count</CardTitle>
                      <CardDescription className="mt-1">
                        How many rooms does your property have?
                      </CardDescription>
                    </div>
                    <div className="flex items-center justify-center gap-6 py-4">
                      <button
                        className="grid h-12 w-12 place-items-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30"
                        onClick={() => update("totalRooms", String(Math.max(1, Number(form.totalRooms) - 1)))}
                        disabled={Number(form.totalRooms) <= 1}
                      >
                        −
                      </button>
                      <div className="text-center">
                        <p className="text-6xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                          {form.totalRooms || "0"}
                        </p>
                        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">rooms</p>
                      </div>
                      <button
                        className="grid h-12 w-12 place-items-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700"
                        onClick={() => update("totalRooms", String(Number(form.totalRooms || 0) + 1))}
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {[4, 6, 8, 10, 12, 15].map((n) => (
                        <button
                          key={n}
                          onClick={() => update("totalRooms", String(n))}
                          className={`rounded-full border px-4 py-1 text-sm font-medium transition ${
                            form.totalRooms === String(n)
                              ? "border-slate-950 dark:border-slate-100 bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    {errors.totalRooms && <p className="text-center text-sm text-rose-600 dark:text-rose-400">{errors.totalRooms}</p>}
                  </div>
                )}

                {/* Step 3 — OTA Selection */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <CardTitle className="text-2xl">OTA Channels</CardTitle>
                      <CardDescription className="mt-1">
                        Which booking platforms do you use? (Select all that apply)
                      </CardDescription>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {otaOptions.map((ota) => {
                        const selected = form.otas.includes(ota);
                        return (
                          <button
                            key={ota}
                            onClick={() => toggleOta(ota)}
                            className={`flex items-center justify-between rounded-2xl border p-3.5 text-left transition ${
                              selected
                                ? "border-emerald-500 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            <span className={`text-sm font-medium ${selected ? "text-emerald-900 dark:text-emerald-300" : "text-slate-700 dark:text-slate-300"}`}>
                              {ota}
                            </span>
                            {selected && <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center">You can change this later in Channel Manager.</p>
                  </div>
                )}

                {/* Step 4 — Pricing Setup */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div>
                      <CardTitle className="text-2xl">Pricing Setup</CardTitle>
                      <CardDescription className="mt-1">
                        Set a starting base rate for your rooms.
                      </CardDescription>
                    </div>
                    <Field label="Base Nightly Rate (₹)" error={errors.baseNightlyRate}>
                      <Input
                        type="number"
                        min="1"
                        value={form.baseNightlyRate}
                        onChange={(e) => update("baseNightlyRate", e.target.value)}
                        placeholder="3500"
                      />
                    </Field>
                    <div className="flex flex-wrap gap-2">
                      {[1500, 2500, 3500, 5000, 7500, 10000].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => update("baseNightlyRate", String(rate))}
                          className={`rounded-full border px-4 py-1 text-sm font-medium transition ${
                            form.baseNightlyRate === String(rate)
                              ? "border-slate-950 dark:border-slate-100 bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                          }`}
                        >
                          ₹{rate.toLocaleString("en-IN")}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">You can set per-room pricing in Settings after setup.</p>
                    {submitError && <p className="text-sm text-rose-600 dark:text-rose-400">{submitError}</p>}
                  </div>
                )}

                {/* Step 5 — Done */}
                {step === 5 && (
                  <div className="flex flex-col items-center py-6 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 14, stiffness: 200 }}
                      className="grid h-20 w-20 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300"
                    >
                      <CheckCircle2 className="h-10 w-10" />
                    </motion.div>
                    <h3 className="mt-6 text-2xl font-bold text-slate-950 dark:text-slate-50">
                      You're all set!
                    </h3>
                    <p className="mt-2 max-w-xs text-slate-500 dark:text-slate-400">
                      <strong>{form.homestayName || "Your property"}</strong> is ready. Opening your dashboard…
                    </p>
                    <div className="mt-6 space-y-2 text-left w-full max-w-xs">
                      {[
                        `${form.totalRooms} rooms configured`,
                        form.propertyType || "Property type set",
                        form.otas.length > 0 ? `${form.otas.length} OTAs selected` : "No OTAs selected (add later)",
                        form.baseNightlyRate ? `Base rate ₹${Number(form.baseNightlyRate).toLocaleString("en-IN")}` : "Pricing to be configured",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>

          {/* Footer nav */}
          <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={step === 0 ? onBackToLogin : goBack}
                className="gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                {step === 0 ? "Back to login" : "Back"}
              </Button>
              {step < STEPS.length - 1 && (
                <Button onClick={goNext} className="gap-1.5">
                  {step === 4 ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Create Property
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
