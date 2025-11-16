export interface IAdminDashboardService {
  getDashboard: (userId: string) => Promise<void>;
}
