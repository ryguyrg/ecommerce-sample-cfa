// Type definitions for the analytics application

export interface User {
  user_id: number;
  email: string;
  name: string;
  google_id: string;
  created_at: Date;
}

export interface Store {
  store_id: number;
  store_name: string;
  store_url: string;
  access_level?: 'admin' | 'viewer';
  created_at: Date;
}

export interface UserStoreAccess {
  user_id: number;
  store_id: number;
  access_level: 'admin' | 'viewer';
}

export interface Order {
  order_id: number;
  store_id: number;
  order_date: Date;
  customer_name: string;
  customer_email: string;
  customer_city: string;
  customer_state: string;
  customer_country: string;
  customer_lat: number;
  customer_lng: number;
  order_total: number;
  order_status: 'completed' | 'pending' | 'cancelled';
}

export interface DailyRevenue {
  revenue_date: Date;
  store_id: number;
  total_revenue: number;
  order_count: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
}

export interface OrdersChartData {
  date: string;
  orders: number;
}

export interface CustomerLocation {
  lat: number;
  lng: number;
  city: string;
  state: string;
  orderCount: number;
  totalRevenue: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueGrowth: number; // percentage
}
