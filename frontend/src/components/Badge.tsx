interface BadgeProps {
  status: string;
  label?: string;
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-50 text-green-700 ring-green-600/20',
  inactive: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  in_stock: 'bg-green-50 text-green-700 ring-green-600/20',
  low_stock: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  out_of_stock: 'bg-red-50 text-red-700 ring-red-600/20',
  admin: 'bg-brand-50 text-brand-700 ring-brand-600/20',
  user: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  stock_in: 'bg-green-50 text-green-700 ring-green-600/20',
  stock_out: 'bg-red-50 text-red-700 ring-red-600/20',
};

const statusLabels: Record<string, string> = {
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
  stock_in: 'Stock In',
  stock_out: 'Stock Out',
  admin: 'Admin',
  user: 'User',
  active: 'Active',
  inactive: 'Inactive',
};

export default function Badge({ status, label }: BadgeProps) {
  const style = statusStyles[status] || 'bg-gray-50 text-gray-600 ring-gray-500/20';
  const displayLabel = label || statusLabels[status] || status;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}>
      {displayLabel}
    </span>
  );
}
