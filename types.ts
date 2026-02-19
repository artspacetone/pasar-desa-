export type UserRole = 'Admin' | 'UMKM' | 'Pembeli';
export type UserStatus = 'Terverifikasi' | 'Menunggu' | 'Diblokir';

export interface User {
  id: string;
  name: string;
  nik: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
  password?: string;
}

export interface Product {
  id: string;
  name: string;
  shopName: string;
  price: number;
  stock: number;
  status: 'Aktif' | 'Habis' | 'Disembunyikan';
  category: string;
}

export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: 'Diproses' | 'Dikirim' | 'Selesai' | 'Dibatalkan';
  date: string;
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
  description?: string;
}

export interface Log {
  id: number;
  time: string;
  user: string;
  action: string;
  details: string;
}

export type TabView = 'dashboard' | 'marketplace' | 'users' | 'products' | 'categories' | 'orders' | 'integration' | 'logs' | 'settings';