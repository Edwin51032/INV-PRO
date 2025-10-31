import StatCards from '@/components/dashboard/stat-cards';
import SalesChart from '@/components/dashboard/sales-chart';
import RecentSales from '@/components/dashboard/recent-sales';
import QuickActions from '@/components/dashboard/quick-actions';
import LowStockAlerts from '@/components/dashboard/low-stock-alerts';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <QuickActions />
      <StatCards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div className="space-y-6">
           <RecentSales />
           <LowStockAlerts />
        </div>
      </div>
    </div>
  );
}
