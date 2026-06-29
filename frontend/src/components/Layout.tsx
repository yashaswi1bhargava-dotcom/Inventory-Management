import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Boxes,
  ArrowLeftRight,
  ScrollText,
  BarChart3,
  AlertTriangle,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/blucursor-logo.png';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/users', label: 'Users', icon: Users, adminOnly: true },
  { to: '/products', label: 'Products', icon: Package, adminOnly: true },
  { to: '/inventory', label: 'Inventory', userLabel: 'View Inventory', icon: Boxes },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight, adminOnly: true },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, adminOnly: true },
  { to: '/audit-logs', label: 'Audit Logs', icon: ScrollText, adminOnly: true },
  { to: '/low-stock', label: 'Low Stock Alerts', icon: AlertTriangle, adminOnly: true },
  { to: '/settings', label: 'Settings', icon: Settings, adminOnly: true },
];

export default function Layout() {
  const { name, role, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-surface-muted">
      {/* Sidebar Spacer to prevent layout shift of main content when sidebar expands */}
      <div className="w-20 shrink-0 transition-all duration-300 ease-in-out" />

      <aside className="fixed left-0 top-0 bottom-0 z-40 flex w-20 hover:w-64 flex-col bg-navy shadow-elevated transition-all duration-300 ease-in-out group overflow-x-hidden">
        <div className="flex h-16 items-center justify-center group-hover:justify-start gap-3 border-b border-white/10 px-4 group-hover:px-6 transition-all duration-300 overflow-hidden shrink-0">
          <img src={logo} alt="BluCursor logo" className="h-8 w-8 rounded-full object-cover shrink-0" />
          <span className="text-lg font-bold text-white tracking-[0.04em] opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
            BluCursor Inventory
          </span>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-2 py-4">
          {navItems.filter((item) => isAdmin || !item.adminOnly).map(({ to, label, userLabel, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center justify-center group-hover:justify-start gap-0 group-hover:gap-3 rounded-lg px-3.5 group-hover:px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
                {!isAdmin && userLabel ? userLabel : label}
              </span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center group-hover:justify-start gap-0 group-hover:gap-3 rounded-lg px-3.5 group-hover:px-3 py-2.5 text-sm font-medium text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
              Logout
            </span>
          </button>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center justify-center group-hover:justify-start gap-0 group-hover:gap-3 px-1 group-hover:px-2 transition-all duration-300 overflow-hidden">
            <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold shrink-0 border border-white/20">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden">
              <p className="text-sm font-medium text-white leading-tight">{name}</p>
              <p className="text-xs text-white/50">{role === 'admin' ? 'Administrator' : 'User'}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
