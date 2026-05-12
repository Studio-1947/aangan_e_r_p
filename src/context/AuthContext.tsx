import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface User {
  id: string;
  name: string;
  role: "Owner" | "Staff";
  email: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  contactPhone: string;
  totalRooms: number;
}

export interface RegisterNewPropertyData {
  ownerName: string;
  homestayName: string;
  fullAddress: string;
  phoneNumber: string;
  totalRooms: number;
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  property: Property | null;
  isAuthenticated: boolean;
  loginDemoSuperuser: (rememberSession?: boolean) => void;
  loginWithCredentials: (
    email: string,
    password: string,
    rememberSession?: boolean,
  ) => { ok: true } | { ok: false; error: string };
  registerNewProperty: (
    data: RegisterNewPropertyData,
  ) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  setUserRole: (role: User["role"]) => void;
}

type PersistedSession = {
  user: User;
  property: Property;
};

type StoredAccount = {
  user: User;
  property: Property;
  password: string;
};

const demoUser: User = {
  id: "user-demo-owner",
  name: "Demo Owner",
  role: "Owner",
  email: "owner@aangan.demo",
};

const demoProperty: Property = {
  id: "property-demo-001",
  name: "Aangan Homestay",
  address: "12 Lake View Road, Udaipur, Rajasthan",
  contactPhone: "+91 98765 43210",
  totalRooms: 12,
};

const LOCAL_SESSION_STORAGE_KEY = "aangan.erp.auth";
const TAB_SESSION_STORAGE_KEY = "aangan.erp.auth.session";
const ACCOUNTS_STORAGE_KEY = "aangan.erp.accounts";
const DEMO_CREDENTIALS = {
  email: "owner@aangan.demo",
  password: "owner123",
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function buildOwnerEmail(ownerName: string) {
  const slug = ownerName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");

  return `${slug || "owner"}@aangan.local`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rememberSession, setRememberSession] = useState(false);
  const [accounts, setAccounts] = useState<StoredAccount[]>([]);
  const [isSessionHydrated, setIsSessionHydrated] = useState(false);

  // Restore locally saved sign-up accounts.
  useEffect(() => {
    const rawAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!rawAccounts) return;

    try {
      const parsed = JSON.parse(rawAccounts) as StoredAccount[];
      if (Array.isArray(parsed)) {
        setAccounts(parsed);
      }
    } catch {
      localStorage.removeItem(ACCOUNTS_STORAGE_KEY);
    }
  }, []);

  // Restore a previously saved session on first load.
  useEffect(() => {
    const rawLocalSession = localStorage.getItem(LOCAL_SESSION_STORAGE_KEY);
    const rawTabSession = sessionStorage.getItem(TAB_SESSION_STORAGE_KEY);

    const restoreSession = (
      rawSession: string,
      shouldRememberSession: boolean,
    ) => {
      const parsed = JSON.parse(rawSession) as PersistedSession;
      if (parsed?.user && parsed?.property) {
        setUser(parsed.user);
        setProperty(parsed.property);
        setIsAuthenticated(true);
        setRememberSession(shouldRememberSession);
      }
    };

    try {
      if (rawLocalSession) {
        restoreSession(rawLocalSession, true);
      } else if (rawTabSession) {
        restoreSession(rawTabSession, false);
      }
    } catch {
      localStorage.removeItem(LOCAL_SESSION_STORAGE_KEY);
      sessionStorage.removeItem(TAB_SESSION_STORAGE_KEY);
    } finally {
      setIsSessionHydrated(true);
    }
  }, []);

  // Persist auth changes after hydration so refresh keeps state reliably.
  useEffect(() => {
    if (!isSessionHydrated) return;

    if (isAuthenticated && user && property) {
      const serializedSession = JSON.stringify({ user, property });

      if (rememberSession) {
        localStorage.setItem(LOCAL_SESSION_STORAGE_KEY, serializedSession);
        sessionStorage.removeItem(TAB_SESSION_STORAGE_KEY);
      } else {
        sessionStorage.setItem(TAB_SESSION_STORAGE_KEY, serializedSession);
        localStorage.removeItem(LOCAL_SESSION_STORAGE_KEY);
      }

      return;
    }

    localStorage.removeItem(LOCAL_SESSION_STORAGE_KEY);
    sessionStorage.removeItem(TAB_SESSION_STORAGE_KEY);
  }, [isAuthenticated, isSessionHydrated, property, rememberSession, user]);

  // Persist sign-up accounts for credential login in this frontend-only demo.
  useEffect(() => {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  }, [accounts]);

  const loginDemoSuperuser = (shouldRememberSession = false) => {
    setUser(demoUser);
    setProperty(demoProperty);
    setIsAuthenticated(true);
    setRememberSession(shouldRememberSession);
  };

  const loginWithCredentials = (
    email: string,
    password: string,
    shouldRememberSession = false,
  ) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (
      normalizedEmail === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      setUser(demoUser);
      setProperty(demoProperty);
      setIsAuthenticated(true);
      setRememberSession(shouldRememberSession);
      return { ok: true as const };
    }

    const matchedAccount = accounts.find(
      (account) =>
        account.user.email.toLowerCase() === normalizedEmail &&
        account.password === password,
    );

    if (!matchedAccount) {
      return { ok: false as const, error: "Invalid email or password." };
    }

    setUser(matchedAccount.user);
    setProperty(matchedAccount.property);
    setIsAuthenticated(true);
    setRememberSession(shouldRememberSession);
    return { ok: true as const };
  };

  const registerNewProperty = (data: RegisterNewPropertyData) => {
    const propertyName = data.homestayName.trim() || "New Homestay";
    const ownerName = data.ownerName.trim() || "Owner";
    const normalizedEmail = data.email.trim().toLowerCase();

    if (normalizedEmail === DEMO_CREDENTIALS.email) {
      return {
        ok: false as const,
        error: "This email is reserved for the demo account.",
      };
    }

    const emailTaken = accounts.some(
      (account) => account.user.email.toLowerCase() === normalizedEmail,
    );

    if (emailTaken) {
      return {
        ok: false as const,
        error: "An account with this email already exists.",
      };
    }

    const nextProperty: Property = {
      id: `property-${Date.now()}`,
      name: propertyName,
      address: data.fullAddress.trim(),
      contactPhone: data.phoneNumber.trim(),
      totalRooms: data.totalRooms,
    };

    const nextUser: User = {
      id: `user-${Date.now()}`,
      name: ownerName,
      role: "Owner",
      email: normalizedEmail || buildOwnerEmail(ownerName),
    };

    setAccounts((current) => [
      ...current,
      {
        user: nextUser,
        property: nextProperty,
        password: data.password,
      },
    ]);

    setProperty(nextProperty);
    setUser(nextUser);
    setIsAuthenticated(true);
    setRememberSession(true);
    return { ok: true as const };
  };

  const logout = () => {
    setUser(null);
    setProperty(null);
    setIsAuthenticated(false);
    setRememberSession(false);
    localStorage.removeItem(LOCAL_SESSION_STORAGE_KEY);
    sessionStorage.removeItem(TAB_SESSION_STORAGE_KEY);
  };

  const setUserRole = (role: User["role"]) => {
    setUser((current) => {
      if (!current) return current;
      return { ...current, role };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        property,
        isAuthenticated,
        loginDemoSuperuser,
        loginWithCredentials,
        registerNewProperty,
        logout,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
