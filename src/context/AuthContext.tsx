import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as dataStore from '../../dataStore';

type AuthUser = dataStore.UserRecord;

interface AuthContextValue {
  user: AuthUser | null;
  isAdminMaster: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = 'loreloom.auth.userId';
const DEFAULT_ADMIN_NAME = 'Admin Master';
const DEFAULT_ADMIN_EMAIL = 'admin@loreloom.app';
const DEFAULT_ADMIN_PASSWORD = 'admin_master';

function getCrypto() {
  if (typeof globalThis === 'undefined') {
    return undefined;
  }
  return globalThis.crypto ?? undefined;
}

async function hashPassword(password: string) {
  const cryptoInstance = getCrypto();
  if (!cryptoInstance?.subtle) {
    return password;
  }
  const data = new TextEncoder().encode(password);
  const digest = await cryptoInstance.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const ensureAdminMaster = useCallback(async () => {
    const users = await dataStore.getUsers();
    const hasAdmin = users.some((existingUser) => existingUser.role === 'admin_master');
    if (!hasAdmin) {
      const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
      const nextId = users.length > 0 ? Math.max(...users.map((existingUser) => existingUser.id)) + 1 : 1;
      await dataStore.saveUser({
        id: nextId,
        name: DEFAULT_ADMIN_NAME,
        email: DEFAULT_ADMIN_EMAIL,
        passwordHash,
        role: 'admin_master',
      });
    }
  }, []);

  const loadUserFromStorage = useCallback(async (): Promise<AuthUser | null> => {
    if (typeof window === 'undefined') {
      return null;
    }
    const storedId = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!storedId) {
      return null;
    }
    const parsedId = Number(storedId);
    if (Number.isNaN(parsedId)) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    const users = await dataStore.getUsers();
    const storedUser = users.find((existingUser) => existingUser.id === parsedId) ?? null;
    if (!storedUser) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    return storedUser;
  }, []);

  const refreshUser = useCallback(async () => {
    const storedUser = await loadUserFromStorage();
    setUser(storedUser);
  }, [loadUserFromStorage]);

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      await ensureAdminMaster();
      if (!active) {
        return;
      }
      const storedUser = await loadUserFromStorage();
      if (!active) {
        return;
      }
      setUser(storedUser);
      setLoading(false);
    };

    initialize();

    return () => {
      active = false;
    };
  }, [ensureAdminMaster, loadUserFromStorage]);

  const login = useCallback(async (email: string, password: string) => {
    const [users, hashedPassword] = await Promise.all([
      dataStore.getUsers(),
      hashPassword(password),
    ]);
    const foundUser = users.find(
      (existingUser) => existingUser.email === email && existingUser.passwordHash === hashedPassword,
    );
    if (!foundUser) {
      return false;
    }
    setUser(foundUser);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_STORAGE_KEY, String(foundUser.id));
    }
    return true;
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAdminMaster: user?.role === 'admin_master',
      login,
      logout,
      loading,
      refreshUser,
    }),
    [user, login, logout, loading, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
