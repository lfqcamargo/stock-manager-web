import { api } from '@/lib/axios';

export interface DashboardKpis {
  totalMaterials: number;
  activeMaterials: number;
  totalLocations: number;
  totalAddressings: number;
  activeAddressings: number;
  totalMovementsThisMonth: number;
  inMovementsThisMonth: number;
  outMovementsThisMonth: number;
  totalUsers: number;
  activeUsers: number;
}

export interface MovementByDay {
  date: string;
  in: number;
  out: number;
}

export interface LowStockItem {
  materialId: string;
  materialName: string;
  materialCode: string;
  totalAmount: number;
  addressingCount: number;
}

export interface RecentMovement {
  id: string;
  quantity: number;
  date: string;
  direction: 'IN' | 'OUT';
  movementTypeName: string;
  materialName: string | null;
  addressingLocation: string;
}

export interface DashboardData {
  kpis: DashboardKpis;
  movementsByDay: MovementByDay[];
  lowStockItems: LowStockItem[];
  recentMovements: RecentMovement[];
}

export async function fetchDashboard(): Promise<DashboardData> {
  const response = await api.get<DashboardData>('/dashboard');
  return response.data;
}
