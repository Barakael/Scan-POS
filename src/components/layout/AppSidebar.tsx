import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, ShoppingCart, Package, BarChart3,
  Users, LogOut, Settings, ChevronLeft, ChevronRight, Store
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['super_admin', 'owner', 'cashier'] },
    { icon: ShoppingCart, label: 'Point of Sale', path: '/pos', roles: ['super_admin', 'owner', 'cashier'] },
    { icon: Package, label: 'Inventory', path: '/inventory', roles: ['super_admin', 'owner'] },
    { icon: BarChart3, label: 'Reports', path: '/reports', roles: ['super_admin', 'owner', 'cashier'] },
    { icon: Users, label: 'Users', path: '/users', roles: ['super_admin'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['super_admin', 'owner'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user.role));

  const roleLabel = {
    super_admin: 'Super Admin',
    owner: 'Owner',
    cashier: 'Cashier',
  };

  return (
    <aside className={cn(
      "sidebar-gradient h-screen flex flex-col border-r border-sidebar-border transition-all duration-300 fixed left-0 top-0 z-40",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg pos-gradient flex items-center justify-center flex-shrink-0">
          <Store className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-sm font-bold text-sidebar-accent-foreground">SwiftPOS</h1>
            <p className="text-[10px] text-sidebar-foreground">Inventory & Sales</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {filteredNav.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary/20 text-sidebar-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="animate-fade-in">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-xs font-semibold text-sidebar-accent-foreground">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-sidebar-foreground">{roleLabel[user.role]}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-destructive/20 hover:text-destructive transition-colors flex-1"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
