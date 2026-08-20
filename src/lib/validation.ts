/**
 * AviLearn — Client-Side Validation Library
 * File: src/lib/validation.ts
 * Description: JavaScript validation functions for forms throughout AviLearn.
 *              Implements client-side checks for required fields, email format,
 *              password strength, and username uniqueness (mirroring server logic).
 */

/** Result shape returned by all validators */
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates an email address using RFC 5322-compliant regex.
 * Client-side equivalent of DataAnnotations [EmailAddress] in ASP.NET Core.
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

export interface PasswordStrength {
  valid: boolean;
  score: 0 | 1 | 2 | 3;       // 0=Weak, 1=Fair, 2=Good, 3=Strong
  label: 'Weak' | 'Fair' | 'Good' | 'Strong';
  message: string;
}

/**
 * Validates password strength:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one digit
 * - At least one special character
 */
export function validatePassword(password: string): PasswordStrength {
  if (!password || password.length < 8) {
    return { valid: false, score: 0, label: 'Weak', message: 'Password must be at least 8 characters.' };
  }

  let score = 0;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const labels: PasswordStrength['label'][] = ['Weak', 'Fair', 'Good', 'Strong'];
  const messages = [
    'Add uppercase letters, numbers, and symbols.',
    'Add numbers and special characters.',
    'Add a special character (e.g. ! @ # $).',
    'Strong password!',
  ];

  return {
    valid: score >= 2,
    score: score as 0 | 1 | 2 | 3,
    label: labels[score],
    message: messages[score],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// REQUIRED FIELDS VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates that all specified fields in an object are non-empty.
 * Returns an errors object keyed by field name.
 */
export function validateRequired(
  data: Record<string, string>,
  fields: { key: string; label: string }[]
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const { key, label } of fields) {
    const val = (data[key] || '').trim();
    if (!val) {
      errors[key] = `${label} is required.`;
    }
  }
  return errors;
}

// ─────────────────────────────────────────────────────────────────────────────
// USERNAME / EMAIL UNIQUENESS CHECK (Simulates server-side validation)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Checks if an email is already registered.
 * In a real ASP.NET Core app this would be a server-side ModelState check.
 * Here we simulate it with LocalStorage persistence.
 */
export function isEmailTaken(email: string): boolean {
  const users = getStoredUsers();
  return users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRATION FORM VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function validateRegisterForm(data: RegisterFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Required fields
  const requiredErrors = validateRequired(
    { name: data.name, email: data.email, password: data.password, confirmPassword: data.confirmPassword },
    [
      { key: 'name',            label: 'Full name' },
      { key: 'email',           label: 'Email address' },
      { key: 'password',        label: 'Password' },
      { key: 'confirmPassword', label: 'Confirm password' },
    ]
  );
  Object.assign(errors, requiredErrors);

  // Email format
  if (data.email && !validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address (e.g. user@example.com).';
  }

  // Email uniqueness (server-side mirror)
  if (data.email && validateEmail(data.email) && isEmailTaken(data.email)) {
    errors.email = 'This email is already registered. Please log in instead.';
  }

  // Password strength
  if (data.password) {
    const strength = validatePassword(data.password);
    if (!strength.valid) {
      errors.password = strength.message;
    }
  }

  // Password match
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  // Name minimum length
  if (data.name && data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN FORM VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

export interface LoginFormData {
  email: string;
  password: string;
}

export function validateLoginForm(data: LoginFormData): ValidationResult {
  const errors: Record<string, string> = {};

  const requiredErrors = validateRequired(
    { email: data.email, password: data.password },
    [
      { key: 'email',    label: 'Email address' },
      { key: 'password', label: 'Password' },
    ]
  );
  Object.assign(errors, requiredErrors);

  if (data.email && !validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// BIRD SPECIES FORM VALIDATION (Admin)
// ─────────────────────────────────────────────────────────────────────────────

export interface BirdFormData {
  commonName: string;
  scientificName: string;
  order: string;
  family: string;
  description: string;
}

export function validateBirdForm(data: BirdFormData): ValidationResult {
  const errors: Record<string, string> = {};

  const requiredErrors = validateRequired(
    { commonName: data.commonName, scientificName: data.scientificName, order: data.order, family: data.family, description: data.description },
    [
      { key: 'commonName',     label: 'Common name' },
      { key: 'scientificName', label: 'Scientific name' },
      { key: 'order',          label: 'Taxonomic order' },
      { key: 'family',         label: 'Family' },
      { key: 'description',    label: 'Description' },
    ]
  );
  Object.assign(errors, requiredErrors);

  // Scientific name format check (Genus species)
  if (data.scientificName && !/^[A-Z][a-z]+ [a-z]+/.test(data.scientificName.trim())) {
    errors.scientificName = 'Use standard binomial nomenclature (e.g., "Cardinalis cardinalis").';
  }

  if (data.description && data.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — Internal LocalStorage access
// ─────────────────────────────────────────────────────────────────────────────

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'member' | 'admin';
  joinDate: string;
  xp: number;
  quizResults: QuizResultRecord[];
}

export interface QuizResultRecord {
  id: string;
  quizTitle: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
  difficulty: string;
}

export function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem('avilearn_users');
    if (!raw) return [];
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

export function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem('avilearn_users', JSON.stringify(users));
}
