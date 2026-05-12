import { ArrowLeft, Building2, Sparkles } from "lucide-react";
import { useState } from "react";
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

type OnboardingFormState = {
  ownerName: string;
  homestayName: string;
  fullAddress: string;
  phoneNumber: string;
  totalRooms: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type OnboardingFormErrors = Partial<Record<keyof OnboardingFormState, string>>;

const initialFormState: OnboardingFormState = {
  ownerName: "",
  homestayName: "",
  fullAddress: "",
  phoneNumber: "",
  totalRooms: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function Onboarding({ onBackToLogin }: { onBackToLogin: () => void }) {
  const { registerNewProperty } = useAuth();
  const [formState, setFormState] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<OnboardingFormErrors>({});
  const [submitError, setSubmitError] = useState("");

  const updateField = <Key extends keyof OnboardingFormState>(
    key: Key,
    value: OnboardingFormState[Key],
  ) => {
    setFormState((current) => ({ ...current, [key]: value }));
    setFormErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitError("");
  };

  const validate = () => {
    const errors: OnboardingFormErrors = {};
    const ownerName = formState.ownerName.trim();
    const homestayName = formState.homestayName.trim();
    const fullAddress = formState.fullAddress.trim();
    const phoneNumber = formState.phoneNumber.trim();
    const totalRooms = Number(formState.totalRooms);
    const email = formState.email.trim();
    const password = formState.password;
    const confirmPassword = formState.confirmPassword;

    if (!ownerName) errors.ownerName = "Owner name is required.";
    if (!homestayName) errors.homestayName = "Homestay name is required.";
    if (!fullAddress) errors.fullAddress = "Full address is required.";
    if (!phoneNumber) errors.phoneNumber = "Phone number is required.";
    if (!email) {
      errors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!formState.totalRooms.trim()) {
      errors.totalRooms = "Total rooms is required.";
    } else if (!Number.isInteger(totalRooms) || totalRooms < 1) {
      errors.totalRooms = "Enter a valid room count.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const result = registerNewProperty({
      ownerName: formState.ownerName.trim(),
      homestayName: formState.homestayName.trim(),
      fullAddress: formState.fullAddress.trim(),
      phoneNumber: formState.phoneNumber.trim(),
      totalRooms: Number(formState.totalRooms),
      email: formState.email.trim(),
      password: formState.password,
    });

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.12),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.12),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl place-items-center">
        <Card className="w-full max-w-2xl overflow-hidden border-slate-200/80 bg-white/92 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <CardHeader className="space-y-4 border-b border-slate-100 bg-linear-to-b from-slate-50/95 to-white/95">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm">
              <Building2 className="h-3.5 w-3.5 text-slate-900" />
              New Homestay Setup
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl">Set up your Homestay</CardTitle>
              <CardDescription className="text-base leading-7">
                Enter the property details once and we&apos;ll create an
                authenticated owner session for the prototype.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  value={formState.ownerName}
                  onChange={(event) =>
                    updateField("ownerName", event.target.value)
                  }
                  placeholder="Aarav Mehta"
                />
                {formErrors.ownerName ? (
                  <p className="text-sm text-rose-600">
                    {formErrors.ownerName}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="homestayName">Homestay Name</Label>
                <Input
                  id="homestayName"
                  value={formState.homestayName}
                  onChange={(event) =>
                    updateField("homestayName", event.target.value)
                  }
                  placeholder="Aangan Homestay"
                />
                {formErrors.homestayName ? (
                  <p className="text-sm text-rose-600">
                    {formErrors.homestayName}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="fullAddress">Full Address</Label>
                <Input
                  id="fullAddress"
                  value={formState.fullAddress}
                  onChange={(event) =>
                    updateField("fullAddress", event.target.value)
                  }
                  placeholder="12 Lake View Road, Udaipur, Rajasthan"
                />
                {formErrors.fullAddress ? (
                  <p className="text-sm text-rose-600">
                    {formErrors.fullAddress}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formState.phoneNumber}
                  onChange={(event) =>
                    updateField("phoneNumber", event.target.value)
                  }
                  placeholder="+91 98765 43210"
                />
                {formErrors.phoneNumber ? (
                  <p className="text-sm text-rose-600">
                    {formErrors.phoneNumber}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formState.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="owner@yourhomestay.com"
                />
                {formErrors.email ? (
                  <p className="text-sm text-rose-600">{formErrors.email}</p>
                ) : null}
              </div>
              <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formState.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  placeholder="At least 6 characters"
                />
                {formErrors.password ? (
                  <p className="text-sm text-rose-600">{formErrors.password}</p>
                ) : null}
              </div>
              <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formState.confirmPassword}
                  onChange={(event) =>
                    updateField("confirmPassword", event.target.value)
                  }
                  placeholder="Re-enter password"
                />
                {formErrors.confirmPassword ? (
                  <p className="text-sm text-rose-600">
                    {formErrors.confirmPassword}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-2 md:col-span-1">
                <Label htmlFor="totalRooms">Total Number of Rooms</Label>
                <Input
                  id="totalRooms"
                  type="number"
                  min="1"
                  value={formState.totalRooms}
                  onChange={(event) =>
                    updateField("totalRooms", event.target.value)
                  }
                  placeholder="12"
                />
                {formErrors.totalRooms ? (
                  <p className="text-sm text-rose-600">
                    {formErrors.totalRooms}
                  </p>
                ) : null}
              </div>
              {submitError ? (
                <div className="md:col-span-2">
                  <p className="text-sm text-rose-600">{submitError}</p>
                </div>
              ) : null}
              <div className="flex flex-col gap-3 pt-2 md:col-span-2 md:flex-row md:justify-between">
                <Button type="button" variant="outline" onClick={onBackToLogin}>
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Button>
                <Button type="submit">
                  Create Owner Session
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
