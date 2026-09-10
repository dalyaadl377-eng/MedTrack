import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const session = authService.getStoredSession();
    if (session) setCurrentUser(session.user);
    setInitializing(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const { user } = await authService.login(credentials);
    setCurrentUser(user);
    return user;
  }, []);

  const signup = useCallback(async (payload) => {
    return authService.signup(payload);
  }, []);

  const verifyOtp = useCallback(async (payload) => {
    const result = await authService.verifyOtp(payload);
    if (result.user) setCurrentUser(result.user);
    return result;
  }, []);

  const resendOtp = useCallback(async (payload) => authService.resendOtp(payload), []);

  const forgotPassword = useCallback(async (payload) => authService.forgotPassword(payload), []);

  const resetPassword = useCallback(async (payload) => authService.resetPassword(payload), []);

  const logout = useCallback(async () => {
    await authService.logout();
    setCurrentUser(null);
  }, []);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    role: currentUser?.role || null,
    initializing,
    login,
    signup,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
