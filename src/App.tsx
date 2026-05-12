import { useEffect, useState } from "react";
import { Login } from "./features/auth/Login";
import { Onboarding } from "./features/auth/Onboarding";
import { useAuth } from "./context/AuthContext";
import DashboardShell from "./features/dashboard/DashboardShell";

function App() {
  const { user, property, isAuthenticated } = useAuth();
  const [view, setView] = useState<"login" | "onboarding">("login");

  useEffect(() => {
    if (!isAuthenticated) {
      setView("login");
    }
  }, [isAuthenticated]);

  if (isAuthenticated && user && property) {
    return <DashboardShell />;
  }

  if (view === "onboarding") {
    return <Onboarding onBackToLogin={() => setView("login")} />;
  }

  return <Login onSignup={() => setView("onboarding")} />;
}

export default App;
