import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useViewPreference } from '../../layouts/MainLayout';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { user, logout } = useAuthStore();
  const { viewNational, toggleView } = useViewPreference();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              className="p-2 rounded-md text-gray-500 lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setSidebarOpen(true)}
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:block lg:ml-2">
              <h2 className="text-xl font-semibold text-gray-800">Service National de Semences</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user?.role === 'national_admin' && (
              <motion.button
                className="px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                style={{
                  backgroundColor: viewNational ? '#4F46E5' : '#E0E7FF',
                  color: viewNational ? '#FFFFFF' : '#4F46E5',
                }}
                onClick={toggleView}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {viewNational ? 'Vue Nationale' : 'Vue Provinciale'}
              </motion.button>
            )}
            <motion.button
              className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.button>

            <motion.div 
              className="flex items-center gap-3 cursor-pointer p-2 rounded-full hover:bg-gray-100"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-primary-700" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'national_admin' 
                    ? 'Coordination Nationale' 
                    : user?.role === 'provincial_admin' 
                      ? 'Coordination Provinciale' 
                      : user?.role || 'Rôle non défini'}
                </p>
              </div>
            </motion.div>
            <motion.button
              className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={logout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Déconnexion
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;