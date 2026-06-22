import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-6 py-12">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-navy">Forgot Password</h2>
        <p className="mt-2 text-sm text-navy-secondary">
          Contact your administrator to reset your password.
        </p>
        <Link to="/login" className="btn-secondary mt-8 inline-flex">
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
