import { mockUsers } from "../data/mockUsers";

// -----------------------------------------------------------------------
// MOCK AUTH SERVICE
// Every exported function here mirrors a future real endpoint 1:1.
// When the backend is ready, swap the internals for axios calls and the
// rest of the app (AuthContext, pages) does not need to change, because
// they only ever depend on this module's function signatures.
// -----------------------------------------------------------------------

const LATENCY = 650;
const TOKEN_KEY = "medtrack_token";
const USER_KEY = "medtrack_user";
const OTP_KEY = "medtrack_pending_otp";
const RESET_KEY = "medtrack_reset_email";

// mutable in-memory copy so signups persist for the session
let usersDB = [...mockUsers];

const wait = (ms = LATENCY) => new Promise((res) => setTimeout(res, ms));
const genOTP = () => String(Math.floor(100000 + Math.random() * 900000));
const genToken = (userId) => `mock.${userId}.${Date.now()}`;

const publicUser = (user) => {
  const { password, ...safe } = user;
  return safe;
};

export const authService = {
  async login({ email, password }) {
    await wait();
    const user = usersDB.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error("No account found with this email");
    if (user.password !== password) throw new Error("Incorrect password. Please try again");
    if (!user.verified) throw new Error("Please verify your email before logging in");

    const token = genToken(user.id);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(publicUser(user)));
    return { user: publicUser(user), token };
  },

  async signup({ fullName, email, password, role }) {
    await wait();
    const exists = usersDB.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error("An account with this email already exists");

    const newUser = {
      id: `u_${Date.now()}`,
      fullName,
      email,
      password,
      role,
      verified: false,
      avatar: null,
    };
    usersDB.push(newUser);

    const otp = genOTP();
    sessionStorage.setItem(OTP_KEY, JSON.stringify({ email, otp, purpose: "signup" }));
    // eslint-disable-next-line no-console
    console.info(`[MedTrack mock] OTP for ${email}: ${otp}`);
    return { email, otpSentTo: email };
  },

  async verifyOtp({ email, otp }) {
    await wait(500);
    const pending = JSON.parse(sessionStorage.getItem(OTP_KEY) || "null");
    if (!pending || pending.email !== email) throw new Error("OTP session expired. Please request a new code");
    if (pending.otp !== otp) throw new Error("Invalid code. Please check and try again");

    if (pending.purpose === "signup") {
      const user = usersDB.find((u) => u.email === email);
      if (user) user.verified = true;
      sessionStorage.removeItem(OTP_KEY);
      const token = genToken(user.id);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(publicUser(user)));
      return { user: publicUser(user), token };
    }

    if (pending.purpose === "reset") {
      sessionStorage.removeItem(OTP_KEY);
      sessionStorage.setItem(RESET_KEY, email);
      return { verified: true };
    }

    throw new Error("Unknown verification flow");
  },

  async resendOtp({ email, purpose = "signup" }) {
    await wait(400);
    const otp = genOTP();
    sessionStorage.setItem(OTP_KEY, JSON.stringify({ email, otp, purpose }));
    // eslint-disable-next-line no-console
    console.info(`[MedTrack mock] Resent OTP for ${email}: ${otp}`);
    return { email };
  },

  async forgotPassword({ email }) {
    await wait();
    const user = usersDB.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error("No account found with this email");

    const otp = genOTP();
    sessionStorage.setItem(OTP_KEY, JSON.stringify({ email, otp, purpose: "reset" }));
    // eslint-disable-next-line no-console
    console.info(`[MedTrack mock] Password reset OTP for ${email}: ${otp}`);
    return { email };
  },

  async resetPassword({ password }) {
    await wait();
    const email = sessionStorage.getItem(RESET_KEY);
    if (!email) throw new Error("Reset session expired. Please start again");

    const user = usersDB.find((u) => u.email === email);
    if (!user) throw new Error("Account not found");
    user.password = password;
    sessionStorage.removeItem(RESET_KEY);
    return { success: true };
  },

  async logout() {
    await wait(200);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getStoredSession() {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    if (!token || !userRaw) return null;
    try {
      return { token, user: JSON.parse(userRaw) };
    } catch {
      return null;
    }
  },
};
