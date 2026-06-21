import { useEffect, useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { transactionsApi } from '../services/api';
import type { Transaction } from '../types';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactionsApi.list()
      .then(({ data }) => setTransactions(data))
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

  return (
    <div>
      <PageHeader
        title="Transaction History"
        description="All inventory stock movements and updates"
      />

      <div className="card overflow-hidden !p-0">
        {transactions.length === 0 ? (
          <EmptyState
            icon={<ArrowLeftRight className="h-8 w-8" />}
            title="No transactions yet"
            description="Stock in/out operations will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Product Name</th>
                  <th className="px-6 py-3">Transaction Type</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Remarks</th>
                  <th className="px-6 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((txn) => (
                  <tr key={txn.transaction_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{txn.product_name}</td>
                    <td className="px-6 py-4"><Badge status={txn.transaction_type} /></td>
                    <td className="px-6 py-4 font-medium text-gray-900">{txn.quantity}</td>
                    <td className="px-6 py-4 text-gray-600">{txn.user_name}</td>
                    <td className="px-6 py-4 text-gray-500">{txn.remarks || '—'}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(txn.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
