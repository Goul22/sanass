import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, UserCog, CheckCircle, XCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useInternStore, Intern } from '../../stores/internStore';
import { useAuthStore } from '../../stores/authStore';

const InternsPage: React.FC = () => {
  const { interns, isLoading, getInterns } = useInternStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    getInterns();
  }, [getInterns]);

  // Filter interns
  let filteredInterns = interns;
  
  // Filter by province if provincial admin
  if (user?.role === 'provincial_admin' && user?.province) {
    filteredInterns = filteredInterns.filter(intern => intern.province === user.province);
  }
  
  // Filter by type
  if (typeFilter !== 'all') {
    filteredInterns = filteredInterns.filter(intern => intern.type === typeFilter);
  }
  
  // Filter by status
  if (statusFilter !== 'all') {
    filteredInterns = filteredInterns.filter(intern => intern.status === statusFilter);
  }
  
  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredInterns = filteredInterns.filter(
      intern => 
        intern.firstName.toLowerCase().includes(searchLower) ||
        intern.lastName.toLowerCase().includes(searchLower) ||
        intern.institution.toLowerCase().includes(searchLower) ||
        intern.department.toLowerCase().includes(searchLower)
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Actif</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Terminé</span>;
      case 'terminated':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Interrompu</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Stagiaires</h1>
          <p className="text-gray-500 mt-1">Gérez les stagiaires académiques et professionnels</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            size="md"
          >
            Ajouter un Stagiaire
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Rechercher un stagiaire..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select 
            className="block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Tous les types</option>
            <option value="academic">Académique</option>
            <option value="professional">Professionnel</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select 
            className="block py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="completed">Terminé</option>
            <option value="terminated">Interrompu</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {filteredInterns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun stagiaire trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Institution
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Département
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Période
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInterns.map((intern) => (
                    <motion.tr key={intern.id} variants={item}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-secondary-100 flex items-center justify-center">
                            <span className="text-secondary-700 font-semibold text-sm">
                              {intern.firstName.charAt(0)}{intern.lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {intern.firstName} {intern.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {intern.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {intern.type === 'academic' ? 'Académique' : 'Professionnel'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{intern.institution}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{intern.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{intern.startDate} à {intern.endDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(intern.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                        <Link to={`/interns/${intern.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<UserCog className="w-4 h-4" />}
                          >
                            Détails
                          </Button>
                        </Link>
                        {intern.status === 'active' && (
                          <>
                            <Button
                              size="sm"
                              variant="success"
                              leftIcon={<CheckCircle className="w-4 h-4" />}
                            >
                              Terminer
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              leftIcon={<XCircle className="w-4 h-4" />}
                            >
                              Interrompre
                            </Button>
                          </>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default InternsPage;