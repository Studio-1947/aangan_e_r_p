import { useEffect, useState } from "react";
import { Login } from "./features/auth/Login";
import { Onboarding } from "./features/auth/Onboarding";
import { LandingPage } from "./features/landing/LandingPage";
import { useAuth } from "./context/AuthContext";
import DashboardShell from "./features/dashboard/DashboardShell";

type View = "landing" | "login" | "onboarding";

function App() {
  const { user, property, isAuthenticated } = useAuth();
  const [view, setView] = useState<View>("landing");

  useEffect(() => {
    if (!isAuthenticated) {
      setView("landing");
    }
  }, [isAuthenticated]);

  if (isAuthenticated && user && property) {
    return <DashboardShell />;
  }

  if (view === "onboarding") {
    return <Onboarding onBackToLogin={() => setView("login")} />;
  }

  if (view === "login") {
    return <Login onSignup={() => setView("onboarding")} />;
  }

  return (
    <LandingPage
      onDemoLogin={() => setView("login")}
      onCreateHomestay={() => setView("onboarding")}
    />
  );
}

export default App;
