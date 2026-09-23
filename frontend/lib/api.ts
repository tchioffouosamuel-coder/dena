// Client API centralisé : toutes les routes du frontend passent par ces
// fonctions, ce qui évite de dupliquer l'URL de base et la gestion du
// token partout dans les composants.

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('dena_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, body.message || 'Une erreur est survenue');
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ---- Types ----
export type Dish = {
  id: string;
  day: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  position: number;
  active: boolean;
};

export type OrderItem = { name: string; price: number; quantity: number; dishId?: string };
export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: 'NOUVELLE' | 'EN_PREPARATION' | 'LIVREE' | 'ANNULEE';
  createdAt: string;
  items: OrderItem[];
};

export type StatsOverview = {
  orderCount: number;
  revenue: number;
  avgBasket: number;
  topDishes: { name: string; quantity: number }[];
};

export type StaffUser = { id: string; email: string; name: string | null; role: 'ADMIN' | 'STAFF'; createdAt: string };

// ---- Public ----
export const getDishes = () => request<Dish[]>('/dishes');
export const createOrder = (data: { customerName: string; customerPhone: string; items: { dishId: string; quantity: number }[] }) =>
  request<Order>('/orders', { method: 'POST', body: JSON.stringify(data) });

// ---- Auth ----
export const login = (email: string, password: string) =>
  request<{ accessToken: string; user: { id: string; email: string; role: string } }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

// ---- Admin: dishes ----
export const getAllDishes = () => request<Dish[]>('/dishes/all');
export const createDish = (data: Partial<Dish>) => request<Dish>('/dishes', { method: 'POST', body: JSON.stringify(data) });
export const updateDish = (id: string, data: Partial<Dish>) =>
  request<Dish>(`/dishes/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteDish = (id: string) => request<Dish>(`/dishes/${id}`, { method: 'DELETE' });

// ---- Admin: orders ----
export const getOrders = () => request<Order[]>('/orders');
export const updateOrderStatus = (id: string, status: Order['status']) =>
  request<Order>(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

// ---- Admin: stats ----
export const getStats = () => request<StatsOverview>('/stats/overview');

// ---- Admin: users ----
export const getUsers = () => request<StaffUser[]>('/users');
export const createUser = (data: { email: string; password: string; name?: string; role: 'ADMIN' | 'STAFF' }) =>
  request<StaffUser>('/users', { method: 'POST', body: JSON.stringify(data) });
export const deleteUser = (id: string) => request<void>(`/users/${id}`, { method: 'DELETE' });

// ---- Media ----
export const uploadImage = (file: File) => {
  const form = new FormData();
  form.append('file', file);
  return request<{ url: string }>('/media/upload', { method: 'POST', body: form });
};

export { getToken };
export const setToken = (token: string) => localStorage.setItem('dena_token', token);
export const clearToken = () => localStorage.removeItem('dena_token');
