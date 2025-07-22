export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'desserts' | 'drinks';
  description?: string;
  image?: string;
  available: boolean;
  isSpecial?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  roomNumber?: string;
  checkIn?: Date;
  checkOut?: Date;
  status: 'checked-in' | 'checked-out' | 'reserved';
}

export interface Order {
  id: string;
  guestId?: string;
  guestName: string;
  roomNumber?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'completed';
  timestamp: Date;
  notes?: string;
}

export interface Room {
  id: string;
  number: string;
  type: 'single' | 'double' | 'suite' | 'deluxe';
  price: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  guest?: Guest;
}

export type UserRole = 'admin' | 'receptionist' | 'kitchen' | 'waiter' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}