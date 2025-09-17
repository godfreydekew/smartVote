import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  ShieldAlert,
  FileText,
  BellRing,
  BarChart3,
  Users,
  Calendar,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/auth/AuthProvider';
import { useToast } from '@/components/ui/use-toast';

export const DashboardSidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const isActive = (path: string) => location.pathname === path;

  const isAdmin = user?.user_role === 'admin';

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logout successful',
        description: 'You have successfully logged out.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: 'An error occurred while logging out.',
        variant: 'destructive',
      });
    }
  };

  return (
    <aside className="h-full w-full bg-white border-r border-gray-100 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vote-blue to-vote-teal">
          Şeffaf Katılım
        </h2>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link
          to="/dashboard"
          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
            isActive('/dashboard') 
              ? 'bg-gradient-to-r from-vote-blue to-vote-teal text-white shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          <span className="font-medium">Dashboard</span>
        </Link>

        <Link
          to="/profile"
          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
            isActive('/profile') 
              ? 'bg-gradient-to-r from-vote-blue to-vote-teal text-white shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <User className="w-5 h-5 mr-3" />
          <span className="font-medium">Profile</span>
        </Link>

        <Link
          to="/dashboard"
          className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
            isActive('/dashboard') 
              ? 'bg-gradient-to-r from-vote-blue to-vote-teal text-white shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ShieldAlert className="w-5 h-5 mr-3" />
          <span className="font-medium">Admin</span>
        </Link>

        {isAdmin && (
          <>
            <div className="pt-6 pb-2">
              <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Admin Tools
              </div>
            </div>

            <Link
              to="/admin/elections/create"
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive('/admin/elections/create') 
                  ? 'bg-gradient-to-r from-vote-blue to-vote-teal text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Plus className="w-5 h-5 mr-3" />
              <span className="font-medium">Create Election</span>
            </Link>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-50 w-full transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
