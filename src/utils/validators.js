export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  return { score, label: labels[score] };
};

export const isStrongEnough = (password) => getPasswordStrength(password).score >= 2 && password.length >= 8;

export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";
  return errors;
};

export const validateSignupForm = ({ fullName, email, password, confirmPassword, role }) => {
  const errors = {};
  if (!fullName.trim()) errors.fullName = "Full name is required";
  else if (fullName.trim().length < 2) errors.fullName = "Enter your full name";

  if (!email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address";

  if (!password) errors.password = "Password is required";
  else if (!isStrongEnough(password)) errors.password = "Use at least 8 characters with a mix of letters & numbers";

  if (!confirmPassword) errors.confirmPassword = "Confirm your password";
  else if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match";

  if (!role) errors.role = "Choose an account type";

  return errors;
};

export const validateForgotPasswordForm = ({ email }) => {
  const errors = {};
  if (!email.trim()) errors.email = "Email is required";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email address";
  return errors;
};

export const validateResetPasswordForm = ({ password, confirmPassword }) => {
  const errors = {};
  if (!password) errors.password = "Password is required";
  else if (!isStrongEnough(password)) errors.password = "Use at least 8 characters with a mix of letters & numbers";
  if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match";
  return errors;
};
