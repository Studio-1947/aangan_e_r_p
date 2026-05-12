import { ArrowRight, Building2, KeyRound } from "lucide-react";
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

export function Login({ onSignup }: { onSignup: () => void }) {
  const { loginDemoSuperuser, loginWithCredentials } = useAuth();
  const [email, setEmail] = useState("owner@aangan.demo");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // Credential login checks hardcoded demo credentials in AuthContext.
  const handleCredentialLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = loginWithCredentials(email, password, rememberMe);
    if (!result.ok) {
      setError(result.error);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.12),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_26%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.5),transparent_28%),linear-gradient(180deg,#0f172a_0%,#1e1b4b_100%)] px-4 py-8 text-slate-900 dark:text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl place-items-center">
        <Card className="w-full max-w-md overflow-hidden border-slate-200/80 dark:border-slate-700 bg-white/92 dark:bg-slate-900 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <CardHeader className="space-y-4 border-b border-slate-100 dark:border-slate-800 bg-linear-to-b from-slate-50/95 dark:from-slate-800/50 to-white/95 dark:to-slate-900/95">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 shadow-sm">
              <Building2 className="h-3.5 w-3.5 text-slate-900 dark:text-slate-100" />
              Aangan ERP
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl">Welcome back</CardTitle>
              <CardDescription className="text-base leading-7">
                Sign in with demo credentials, quick demo access, or create a
                new account.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <form
              className="grid gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/50 p-4"
              onSubmit={handleCredentialLogin}
            >
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <KeyRound className="h-4 w-4" />
                Credential Login
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="owner@aangan.demo"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:ring-slate-400"
                />
                Remember me
              </label>
              {error ? <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p> : null}
              <Button type="submit" className="w-full">
                Login with Credentials
              </Button>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Demo credentials: owner@aangan.demo / owner123
              </p>
            </form>

            <Button
              className="w-full"
              onClick={() => loginDemoSuperuser(rememberMe)}
            >
              Login as Demo Superuser
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button className="w-full" variant="outline" onClick={onSignup}>
              Sign up
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
