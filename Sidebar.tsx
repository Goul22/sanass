import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Users, RefreshCw, UserMinus, Briefcase, LineChart, 
  FileCheck, UserCog, Home, User as UserIcon, Beaker, ChevronDown,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sidebarOpen, 
  setSidebarOpen,
  isCollapsed,
  setIsCollapsed
}) => {
  const location = useLocation();
  const { user } = useAuthStore();
  const [personnelOpen, setPersonnelOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location, setSidebarOpen]);

  const isNationalAdmin = user?.role === 'national_admin' || user?.role === 'super_admin';

  const MenuItem = ({ to, icon: Icon, label }: { to: string, icon: React.ElementType, label: string }) => {
    const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
    
    return (
      <Link
        to={to}
        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${isActive ? 'bg-primary-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'}`}
        title={isCollapsed ? label : undefined}
      >
        <Icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-600'}`} />
        {!isCollapsed && <span className="ml-3">{label}</span>}
      </Link>
    );
  };

  const isPersonnelActive = location.pathname.startsWith('/employees') || 
                           location.pathname.startsWith('/transfers') || 
                           location.pathname.startsWith('/retirees') ||
                           location.pathname.startsWith('/interns');

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 transform lg:translate-x-0 lg:static lg:inset-0 transition-all duration-300 ease-in-out shadow-lg ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/senasem.jpg" 
                alt="SENASEM Logo" 
                className="w-10 h-10 object-contain rounded-full shadow-md"
              />
              {!isCollapsed && (
                <span className="text-xl font-bold text-primary-700">SENASEM</span>
              )}
            </Link>
            <div className="flex items-center">
              <button
                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden transition-colors duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
              <button
                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 hidden lg:block transition-colors duration-200"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-6 h-6" />
                ) : (
                  <ChevronLeft className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="px-3 py-4 space-y-1">
              <MenuItem to="/" icon={Home} label="Tableau de Bord" />
              <MenuItem to="/lab-analytics" icon={Beaker} label="Analyse au Labo" />
              <MenuItem to="/agri-multipliers" icon={FileCheck} label="Agri-Multiplicateurs" />
              <MenuItem to="/field-inspection" icon={FileCheck} label="Inspection aux Champs" />
              
              <div className="relative">
                <button
                  onClick={() => setPersonnelOpen(!personnelOpen)}
                  className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${isPersonnelActive ? 'bg-primary-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'}`}
                  title={isCollapsed ? "Personnel" : undefined}
                >
                  <Users className={`w-5 h-5 transition-colors duration-200 ${isPersonnelActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-600'}`} />
                  {!isCollapsed && (
                    <>
                      <span className="ml-3">Personnel</span>
                      <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${personnelOpen ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>
                
                <AnimatePresence>
                  {personnelOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`pl-4 mt-1 space-y-1 border-l border-gray-200 ${isCollapsed ? 'pl-0' : ''}`}
                    >
                      <MenuItem to="/employees" icon={Users} label="Liste du Personnel" />
                      <MenuItem to="/transfers" icon={RefreshCw} label="Transferts" />
                      <MenuItem to="/retirees" icon={UserMinus} label="Retraites" />
                      <MenuItem to="/interns" icon={Briefcase} label="Stagiaires" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {isNationalAdmin && (
                <MenuItem to="/admins" icon={UserCog} label="Administrateurs" />
              )}
            </nav>
          </div>

          <div className={`p-4 border-t border-gray-100 ${isCollapsed ? 'text-center' : ''}`}>
             <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shadow-inner">
                <UserIcon className="w-5 h-5 text-primary-600" />
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">
                    {user?.role === 'national_admin' 
                      ? 'Coordination Nationale' 
                      : user?.role === 'provincial_admin' 
                        ? 'Coordination Provinciale' 
                        : user?.role || 'Rôle non défini'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;