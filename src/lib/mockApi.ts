/**
 * AviLearn — Mock API Layer
 * File: src/lib/mockApi.ts
 * Description: Simulates ASP.NET Core / C# backend API endpoints.
 *              All data is persisted in LocalStorage (simulating a MySQL database).
 *              Endpoint signatures mirror RESTful ASP.NET Core controller patterns.
 */

import {
  StoredUser,
  QuizResultRecord,
  getStoredUsers,
  saveStoredUsers,
} from './validation';
import { BirdSpecies } from '../types';
import { BIRDS_DATABASE } from '../data/birdsDatabase';
import { QUIZ_SETS } from '../data/quizzesDatabase';
import { QuizSet } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA — Pre-seeded admin account & sample users
// ─────────────────────────────────────────────────────────────────────────────

const ADMIN_SEED: StoredUser = {
  id: 'admin-001',
  name: 'Dr. Evelyn Vance',
  email: 'admin@avilearn.com',
  passwordHash: btoa('Admin123!'),   // base64 encode (simulates hashing)
  role: 'admin',
  joinDate: '2025-01-15',
  xp: 9999,
  quizResults: [],
};

const MEMBER_SEED: StoredUser = {
  id: 'member-001',
  name: 'Alex Birder',
  email: 'member@avilearn.com',
  passwordHash: btoa('Member123!'),
  role: 'member',
  joinDate: '2025-03-22',
  xp: 350,
  quizResults: [
    {
      id: 'qr-001',
      quizTitle: 'North American Raptors',
      score: 4,
      total: 5,
      percentage: 80,
      date: '2026-07-10',
      difficulty: 'Intermediate',
    },
    {
      id: 'qr-002',
      quizTitle: 'Field Mark Basics',
      score: 3,
      total: 5,
      percentage: 60,
      date: '2026-07-18',
      difficulty: 'Beginner',
    },
  ],
};

/** Initialize the LocalStorage database if empty (runs once on first load) */
export function seedDatabase(): void {
  const users = getStoredUsers();
  if (users.length === 0) {
    saveStoredUsers([ADMIN_SEED, MEMBER_SEED]);
  }
  // Seed birds DB
  const storedBirds = localStorage.getItem('avilearn_birds');
  if (!storedBirds) {
    localStorage.setItem('avilearn_birds', JSON.stringify(BIRDS_DATABASE));
  }
  // Seed quizzes DB
  const storedQuizzes = localStorage.getItem('avilearn_quizzes');
  if (!storedQuizzes) {
    localStorage.setItem('avilearn_quizzes', JSON.stringify(QUIZ_SETS));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// API RESPONSE WRAPPER
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data, statusCode: 200 };
}

function created<T>(data: T): ApiResponse<T> {
  return { success: true, data, statusCode: 201 };
}

function badRequest(error: string): ApiResponse<never> {
  return { success: false, error, statusCode: 400 };
}

function unauthorized(error = 'Unauthorized'): ApiResponse<never> {
  return { success: false, error, statusCode: 401 };
}

function notFound(error = 'Not found'): ApiResponse<never> {
  return { success: false, error, statusCode: 404 };
}

function conflict(error: string): ApiResponse<never> {
  return { success: false, error, statusCode: 409 };
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION / TOKEN HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'admin';
  joinDate: string;
  xp: number;
}

function generateToken(user: StoredUser): string {
  // Simulates a JWT — base64(payload) structure
  const payload = { id: user.id, email: user.email, role: user.role, iat: Date.now() };
  return btoa(JSON.stringify(payload));
}

export function decodeToken(token: string): SessionUser | null {
  try {
    const payload = JSON.parse(atob(token));
    const users = getStoredUsers();
    const user = users.find(u => u.id === payload.id);
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      joinDate: user.joinDate,
      xp: user.xp,
    };
  } catch {
    return null;
  }
}

export function getCurrentToken(): string | null {
  return localStorage.getItem('avilearn_token');
}

export function getCurrentUser(): SessionUser | null {
  const token = getCurrentToken();
  if (!token) return null;
  return decodeToken(token);
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH ENDPOINTS — POST /api/auth/register | POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: SessionUser;
}

/** POST /api/auth/register — Creates a new member account */
export async function apiRegister(payload: RegisterPayload): Promise<ApiResponse<AuthResult>> {
  await delay(400); // Simulate network latency

  const users = getStoredUsers();

  // Server-side unique email check (mirrors ASP.NET Core ModelState validation)
  if (users.some(u => u.email.toLowerCase() === payload.email.toLowerCase())) {
    return conflict('An account with this email already exists.');
  }

  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    passwordHash: btoa(payload.password),
    role: 'member',
    joinDate: new Date().toISOString().split('T')[0],
    xp: 0,
    quizResults: [],
  };

  saveStoredUsers([...users, newUser]);

  const token = generateToken(newUser);
  localStorage.setItem('avilearn_token', token);

  return created({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      joinDate: newUser.joinDate,
      xp: newUser.xp,
    },
  });
}

/** POST /api/auth/login — Authenticates a user and returns a session token */
export async function apiLogin(email: string, password: string): Promise<ApiResponse<AuthResult>> {
  await delay(400);

  const users = getStoredUsers();
  const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user || user.passwordHash !== btoa(password)) {
    return unauthorized('Invalid email or password.');
  }

  const token = generateToken(user);
  localStorage.setItem('avilearn_token', token);

  return ok({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      joinDate: user.joinDate,
      xp: user.xp,
    },
  });
}

/** POST /api/auth/logout */
export function apiLogout(): void {
  localStorage.removeItem('avilearn_token');
}

// ─────────────────────────────────────────────────────────────────────────────
// BIRDS ENDPOINTS — GET/POST/PUT/DELETE /api/birds
// ─────────────────────────────────────────────────────────────────────────────

function getStoredBirds(): BirdSpecies[] {
  try {
    const raw = localStorage.getItem('avilearn_birds');
    if (!raw) return BIRDS_DATABASE;
    return JSON.parse(raw) as BirdSpecies[];
  } catch {
    return BIRDS_DATABASE;
  }
}

function saveBirds(birds: BirdSpecies[]): void {
  localStorage.setItem('avilearn_birds', JSON.stringify(birds));
}

/** GET /api/birds — Returns paginated bird list (public) */
export async function apiGetBirds(page = 1, pageSize = 20): Promise<ApiResponse<{ birds: BirdSpecies[]; total: number }>> {
  await delay(200);
  const all = getStoredBirds();
  const start = (page - 1) * pageSize;
  const birds = all.slice(start, start + pageSize);
  return ok({ birds, total: all.length });
}

/** GET /api/birds/:id */
export async function apiGetBirdById(id: string): Promise<ApiResponse<BirdSpecies>> {
  await delay(150);
  const bird = getStoredBirds().find(b => b.id === id);
  if (!bird) return notFound(`Bird species '${id}' not found.`);
  return ok(bird);
}

/** POST /api/birds — Admin: Add new bird species */
export async function apiCreateBird(bird: Omit<BirdSpecies, 'id'>): Promise<ApiResponse<BirdSpecies>> {
  await delay(350);
  const current = getCurrentUser();
  if (!current || current.role !== 'admin') return unauthorized('Admin access required.');

  const newBird: BirdSpecies = {
    ...bird,
    id: `bird-${Date.now()}`,
  };

  const birds = getStoredBirds();
  saveBirds([...birds, newBird]);
  return created(newBird);
}

/** PUT /api/birds/:id — Admin: Update bird species */
export async function apiUpdateBird(id: string, updates: Partial<BirdSpecies>): Promise<ApiResponse<BirdSpecies>> {
  await delay(350);
  const current = getCurrentUser();
  if (!current || current.role !== 'admin') return unauthorized('Admin access required.');

  const birds = getStoredBirds();
  const idx = birds.findIndex(b => b.id === id);
  if (idx === -1) return notFound();

  const updated = { ...birds[idx], ...updates, id };
  birds[idx] = updated;
  saveBirds(birds);
  return ok(updated);
}

/** DELETE /api/birds/:id — Admin: Remove bird species */
export async function apiDeleteBird(id: string): Promise<ApiResponse<{ id: string }>> {
  await delay(300);
  const current = getCurrentUser();
  if (!current || current.role !== 'admin') return unauthorized('Admin access required.');

  const birds = getStoredBirds();
  const filtered = birds.filter(b => b.id !== id);
  if (filtered.length === birds.length) return notFound();

  saveBirds(filtered);
  return ok({ id });
}

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

function getStoredQuizzes(): QuizSet[] {
  try {
    const raw = localStorage.getItem('avilearn_quizzes');
    if (!raw) return QUIZ_SETS;
    return JSON.parse(raw) as QuizSet[];
  } catch {
    return QUIZ_SETS;
  }
}

function saveQuizzes(quizzes: QuizSet[]): void {
  localStorage.setItem('avilearn_quizzes', JSON.stringify(quizzes));
}

/** GET /api/quizzes */
export async function apiGetQuizzes(): Promise<ApiResponse<QuizSet[]>> {
  await delay(200);
  return ok(getStoredQuizzes());
}

/** POST /api/quiz-results — Member: Save quiz attempt result */
export async function apiSaveQuizResult(result: Omit<QuizResultRecord, 'id'>): Promise<ApiResponse<QuizResultRecord>> {
  await delay(250);
  const current = getCurrentUser();
  if (!current) return unauthorized('Please log in to save quiz results.');

  const newResult: QuizResultRecord = {
    ...result,
    id: `qr-${Date.now()}`,
  };

  const users = getStoredUsers();
  const idx = users.findIndex(u => u.id === current.id);
  if (idx === -1) return notFound();

  users[idx].quizResults = [newResult, ...users[idx].quizResults];
  users[idx].xp = (users[idx].xp || 0) + Math.round(result.percentage / 2);
  saveStoredUsers(users);

  // Also update token to reflect new XP
  const token = generateToken(users[idx]);
  localStorage.setItem('avilearn_token', token);

  return created(newResult);
}

/** GET /api/quiz-results — Member: Get own quiz history */
export async function apiGetMyQuizResults(): Promise<ApiResponse<QuizResultRecord[]>> {
  await delay(200);
  const current = getCurrentUser();
  if (!current) return unauthorized();

  const users = getStoredUsers();
  const user = users.find(u => u.id === current.id);
  if (!user) return notFound();

  return ok(user.quizResults);
}

// ─────────────────────────────────────────────────────────────────────────────
// USER ENDPOINTS — Admin
// ─────────────────────────────────────────────────────────────────────────────

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'admin';
  joinDate: string;
  xp: number;
  quizCount: number;
  avgScore: number;
}

/** GET /api/users — Admin: List all users */
export async function apiGetUsers(): Promise<ApiResponse<UserSummary[]>> {
  await delay(300);
  const current = getCurrentUser();
  if (!current || current.role !== 'admin') return unauthorized('Admin access required.');

  const users = getStoredUsers();
  const summaries: UserSummary[] = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    joinDate: u.joinDate,
    xp: u.xp,
    quizCount: u.quizResults.length,
    avgScore: u.quizResults.length > 0
      ? Math.round(u.quizResults.reduce((acc, r) => acc + r.percentage, 0) / u.quizResults.length)
      : 0,
  }));

  return ok(summaries);
}

/** DELETE /api/users/:id — Admin: Remove user account */
export async function apiDeleteUser(id: string): Promise<ApiResponse<{ id: string }>> {
  await delay(300);
  const current = getCurrentUser();
  if (!current || current.role !== 'admin') return unauthorized();
  if (id === current.id) return badRequest('Cannot delete your own admin account.');

  const users = getStoredUsers();
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) return notFound();

  saveStoredUsers(filtered);
  return ok({ id });
}

/** GET /api/users/:id/profile — Member: Get own profile */
export async function apiGetProfile(): Promise<ApiResponse<StoredUser>> {
  await delay(200);
  const current = getCurrentUser();
  if (!current) return unauthorized();

  const users = getStoredUsers();
  const user = users.find(u => u.id === current.id);
  if (!user) return notFound();

  return ok(user);
}

/** PUT /api/users/:id/profile — Member: Update profile */
export async function apiUpdateProfile(updates: { name?: string; email?: string }): Promise<ApiResponse<SessionUser>> {
  await delay(350);
  const current = getCurrentUser();
  if (!current) return unauthorized();

  const users = getStoredUsers();
  const idx = users.findIndex(u => u.id === current.id);
  if (idx === -1) return notFound();

  // Unique email check if changing email
  if (updates.email && updates.email !== users[idx].email) {
    const emailTaken = users.some(u => u.id !== current.id && u.email.toLowerCase() === updates.email!.toLowerCase());
    if (emailTaken) return conflict('Email is already in use by another account.');
  }

  if (updates.name) users[idx].name = updates.name.trim();
  if (updates.email) users[idx].email = updates.email.trim().toLowerCase();

  saveStoredUsers(users);

  const token = generateToken(users[idx]);
  localStorage.setItem('avilearn_token', token);

  return ok({
    id: users[idx].id,
    name: users[idx].name,
    email: users[idx].email,
    role: users[idx].role,
    joinDate: users[idx].joinDate,
    xp: users[idx].xp,
  });
}

/** GET /api/admin/activity — Admin: Overall quiz performance overview */
export async function apiGetActivityOverview(): Promise<ApiResponse<{
  totalUsers: number;
  totalQuizAttempts: number;
  averageScore: number;
  topPerformers: { name: string; avgScore: number; quizCount: number }[];
}>> {
  await delay(300);
  const current = getCurrentUser();
  if (!current || current.role !== 'admin') return unauthorized();

  const users = getStoredUsers();
  const allResults = users.flatMap(u => u.quizResults);

  const topPerformers = users
    .filter(u => u.quizResults.length > 0)
    .map(u => ({
      name: u.name,
      avgScore: Math.round(u.quizResults.reduce((a, r) => a + r.percentage, 0) / u.quizResults.length),
      quizCount: u.quizResults.length,
    }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 5);

  return ok({
    totalUsers: users.length,
    totalQuizAttempts: allResults.length,
    averageScore: allResults.length > 0
      ? Math.round(allResults.reduce((a, r) => a + r.percentage, 0) / allResults.length)
      : 0,
    topPerformers,
  });
}

/** Admin: Create/Update quiz set */
export async function apiSaveQuizSet(quiz: QuizSet): Promise<ApiResponse<QuizSet>> {
  await delay(300);
  const current = getCurrentUser();
  if (!current || current.role !== 'admin') return unauthorized();

  const quizzes = getStoredQuizzes();
  const idx = quizzes.findIndex(q => q.id === quiz.id);

  if (idx >= 0) {
    quizzes[idx] = quiz;
  } else {
    quizzes.push({ ...quiz, id: `quiz-${Date.now()}` });
  }
  saveQuizzes(quizzes);
  return ok(quiz);
}

/** Admin: Delete quiz set */
export async function apiDeleteQuiz(id: string): Promise<ApiResponse<{ id: string }>> {
  await delay(250);
  const current = getCurrentUser();
  if (!current || current.role !== 'admin') return unauthorized();

  const quizzes = getStoredQuizzes();
  const filtered = quizzes.filter(q => q.id !== id);
  saveQuizzes(filtered);
  return ok({ id });
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
