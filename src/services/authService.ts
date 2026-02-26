import { getDb, saveDb, nextId } from "../db/mockDb";
import { User, UserRole, Location } from "../types";

export interface RegisterData {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
  city?: string;
  address?: string;
  businessName?: string;
}

export function login(email: string, password: string): User | null {
  const db = getDb();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  return user || null;
}

export async function register(data: RegisterData): Promise<User> {
  const db = getDb();
  const exists = db.users.find(
    (u) => u.email.toLowerCase() === data.email.toLowerCase()
  );
  if (exists) throw new Error("El correo ya está registrado");

  const user: User = {
    id: nextId("users"),
    role: data.role,
    name: data.name,
    phone: data.phone,
    email: data.email,
    password: data.password,
    createdAt: new Date().toISOString(),
    ratingAvg: 0,
    ratingCount: 0,
    department: data.department,
    city: data.city,
    address: data.address,
    businessName: data.businessName,
  };

  db.users.push(user);
  await saveDb();
  return user;
}

export async function requestPasswordReset(email: string): Promise<string> {
  const db = getDb();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (!user) throw new Error("No existe una cuenta con ese correo");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const reset = {
    id: nextId("passwordResets"),
    email: user.email,
    otpCode: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    used: false,
    createdAt: new Date().toISOString(),
  };

  db.passwordResets.push(reset);
  await saveDb();
  return otp;
}

export async function verifyOtp(email: string, code: string): Promise<boolean> {
  const db = getDb();
  const reset = db.passwordResets.find(
    (r) =>
      r.email.toLowerCase() === email.toLowerCase() &&
      r.otpCode === code &&
      !r.used &&
      new Date(r.expiresAt) > new Date()
  );
  return !!reset;
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<void> {
  const db = getDb();
  const reset = db.passwordResets.find(
    (r) =>
      r.email.toLowerCase() === email.toLowerCase() &&
      r.otpCode === code &&
      !r.used
  );
  if (!reset) throw new Error("Código inválido o expirado");

  reset.used = true;
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (user) user.password = newPassword;
  await saveDb();
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const db = getDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new Error("Usuario no encontrado");
  if (user.password !== currentPassword)
    throw new Error("Contraseña actual incorrecta");
  user.password = newPassword;
  await saveDb();
}

export function getUserById(id: string): User | undefined {
  return getDb().users.find((u) => u.id === id);
}

export async function saveFrequentAddress(userId: string, location: Location): Promise<void> {
  const db = getDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return;
  if (!user.frequentAddresses) user.frequentAddresses = [];
  const exists = user.frequentAddresses.some(
    (a) => Math.abs(a.lat - location.lat) < 0.0001 && Math.abs(a.lng - location.lng) < 0.0001
  );
  if (!exists) {
    user.frequentAddresses = [location, ...user.frequentAddresses].slice(0, 5);
    await saveDb();
  }
}
