import React, { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Header from '../components/navigation/Header';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';

export const ViewPreferenceContext = createContext<{
  viewNational: boolean;
  toggleView: () => void;
}>({ viewNational: false, toggleView: () => {} });

export const useViewPreference = () => useContext(ViewPreferenceContext);

const MainLayout: React.FC = () => {
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewNational, setViewNational] = useState(user?.role === 'national_admin');

  const toggleView = () => {
    if (user?.role === 'national_admin') {
      setViewNational(prev => !prev);
    }
  };

  return (
    <ViewPreferenceContext.Provider value={{ viewNational, toggleView }}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header setSidebarOpen={setSidebarOpen} />

          <motion.main
            className="flex-1 overflow-y-auto bg-gray-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Outlet />
            </div>
          </motion.main>
        </div>
      </div>
    </ViewPreferenceContext.Provider>
  );
};

export default MainLayout;
