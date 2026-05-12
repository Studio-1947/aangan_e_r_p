import {
  ArrowRight,
  CalendarDays,
  Package2,
  ShieldCheck,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import type { AuthMode } from "../../types";
import type { SignupDraft } from "../types";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function StatCard({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <Card className="border-slate-200/80 bg-white/90">
      <CardContent className="flex gap-4 pt-6">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/10">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-slate-950">{title}</p>
          <p className="text-sm leading-6 text-slate-500">{text}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function AuthShell({
  authMode,
  onAuthModeChange,
  onQuickLogin,
  signupDraft,
  onSignupDraftChange,
  onSignup,
}: {
  authMode: AuthMode;
  onAuthModeChange: (mode: AuthMode) => void;
  onQuickLogin: () => void;
  signupDraft: SignupDraft;
  onSignupDraftChange: (draft: SignupDraft) => void;
  onSignup: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.12),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.10),transparent_26%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
            <Star className="h-4 w-4 text-amber-500" />
            Aangan ERP
          </div>
          <div className="max-w-2xl space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              Run bookings, stock, and staff from one calm workspace.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              Manage the owner and staff experience with occupancy, inventory,
              and room pricing flows built entirely on local React state.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
              Fast owner login
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
              Bookings + inventory
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
              Staff and rooms
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={ShieldCheck}
              title="Access"
              text="Owner and staff sessions with a quick role switch."
            />
            <StatCard
              icon={CalendarDays}
              title="Bookings"
              text="Interactive room grid with add-booking dialogs."
            />
            <StatCard
              icon={Package2}
              title="Inventory"
              text="Table-driven supply control with threshold badges."
            />
          </div>
        </section>

        <section className="relative">
          <div className="absolute -inset-6 rounded-4xl bg-slate-900/5 blur-3xl" />
          <Card className="relative overflow-hidden border-slate-200/80 bg-white/92 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]">
            <CardHeader className="space-y-4 border-b border-slate-100 bg-linear-to-b from-slate-50/90 to-white/90">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <ShieldCheck className="h-4 w-4 text-slate-900" />
                Secure access
              </div>
              <CardTitle>
                {authMode === "login"
                  ? "Welcome back"
                  : "Register your homestay"}
              </CardTitle>
              <CardDescription>
                {authMode === "login"
                  ? "Use quick access to jump directly into the Owner dashboard."
                  : "Submit the form once to create an Owner session and land on the empty-state dashboard."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
                <Button
                  variant={authMode === "login" ? "default" : "ghost"}
                  onClick={() => onAuthModeChange("login")}
                >
                  Login
                </Button>
                <Button
                  variant={authMode === "signup" ? "default" : "ghost"}
                  onClick={() => onAuthModeChange("signup")}
                >
                  Sign up
                </Button>
              </div>

              {authMode === "login" ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    Quick access is enabled. Clicking the button below logs in
                    as the Owner role immediately.
                  </div>
                  <Button className="w-full" onClick={onQuickLogin}>
                    Login as Owner
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <p className="text-center text-sm text-slate-500">
                    Owner user: owner@aangan.example · role Owner
                  </p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={onSignup}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Homestay name">
                      <Input
                        value={signupDraft.homestayName}
                        onChange={(event) =>
                          onSignupDraftChange({
                            ...signupDraft,
                            homestayName: event.target.value,
                          })
                        }
                        placeholder="Seabreeze Homestay"
                      />
                    </Field>
                    <Field label="Owner name">
                      <Input
                        value={signupDraft.ownerName}
                        onChange={(event) =>
                          onSignupDraftChange({
                            ...signupDraft,
                            ownerName: event.target.value,
                          })
                        }
                        placeholder="Aarav Mehta"
                      />
                    </Field>
                  </div>
                  <Field label="Contact info">
                    <Input
                      value={signupDraft.contactInfo}
                      onChange={(event) =>
                        onSignupDraftChange({
                          ...signupDraft,
                          contactInfo: event.target.value,
                        })
                      }
                      placeholder="Email or phone"
                    />
                  </Field>
                  <Field label="Total rooms">
                    <Input
                      type="number"
                      min="1"
                      value={signupDraft.totalRooms}
                      onChange={(event) =>
                        onSignupDraftChange({
                          ...signupDraft,
                          totalRooms: event.target.value,
                        })
                      }
                      placeholder="12"
                    />
                  </Field>
                  <Button className="w-full" type="submit">
                    Create homestay session
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
