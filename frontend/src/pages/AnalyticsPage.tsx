import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import { dashboardApi } from '../services/api';
import type { Analytics } from '../types';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.analytics()
      .then(({ data }) => setAnalytics(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  const categoryChartData = analytics?.inventory_by_category.map((c) => ({
    name: c.category_name,
    products: c.product_count,
    quantity: c.total_quantity,
  })) || [];

  const monthlyChartData = analytics?.monthly_changes.map((m) => ({
    name: m.month,
    'Stock In': m.stock_in,
    'Stock Out': m.stock_out,
  })) || [];

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Inventory insights and activity overview"
      />

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">Inventory by Category</h3>
          {categoryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#6366f1" radius={[4, 4, 0, 0]} name="Total Quantity" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-sm text-gray-500">No category data available</p>
          )}
        </div>

        <div className="card">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">Monthly Inventory Changes</h3>
          {monthlyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Stock In" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Stock Out" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-sm text-gray-500">No transaction data available yet</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Low Stock Products</h3>
          {analytics?.low_stock_products && analytics.low_stock_products.length > 0 ? (
            <div className="space-y-3">
              {analytics.low_stock_products.map((product) => (
                <div key={product.product_id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.product_name}</p>
                    <p className="text-xs text-gray-500">{product.category_name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">{product.current_quantity} / {product.minimum_stock_level}</span>
                    <Badge status={product.status || 'low_stock'} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">All products are well stocked</p>
          )}
        </div>

        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
          {analytics?.recent_activity && analytics.recent_activity.length > 0 ? (
            <div className="space-y-3">
              {analytics.recent_activity.map((log) => (
                <div key={log.log_id} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{log.details}</p>
                    </div>
                    <span className="whitespace-nowrap text-xs text-gray-400">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">by {log.user_name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
