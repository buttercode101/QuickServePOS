
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface OrderItem extends MenuItem {
  qty: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tip: number;
  total: number;
  paymentType?: 'cash' | 'card';
  timestamp: number;
  splitCount: number;
}

export type ViewState = 'pos' | 'manager' | 'settings';
