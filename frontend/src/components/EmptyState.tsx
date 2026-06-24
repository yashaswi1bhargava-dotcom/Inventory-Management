import { type ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-secondary-light p-4 text-secondary">{icon}</div>
      <h3 className="text-lg font-semibold text-navy">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-navy-secondary">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
