import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, FileCheck, ClipboardCheck, FileSpreadsheet, Eye, FileText, Play, Users, Sprout, Leaf, Scale, Map, ChevronDown, Tractor, Warehouse, Target, MapPin } from 'lucide-react';
import Button from '../../components/ui/Button';
import StatsCard from '../../components/ui/StatsCard'; // Assurez-vous que c'est bien le chemin correct
import Modal from '../../components/ui/Modal';
import AddAgriMultiplierForm from '../../components/agri/AddAgriMultiplierForm';
import AgriMultiplierDetailsModal from '../../components/agri/AgriMultiplierDetailsModal';
import { useAgriMultiplierStore } from '../../stores/agriMultiplierStore';
import { useFieldInspectionStore } from '../../stores/fieldInspectionStore';
import { useAuthStore } from '../../stores/authStore';
import { useViewPreference } from '../../layouts/MainLayout';

const AgriMultipliersPage: React.FC = () => {
  const { user } = useAuthStore();
  const { multipliers, isLoading, getMultipliers, addMultiplier } = useAgriMultiplierStore();
  const { inspections, getInspections } = useFieldInspectionStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMultiplier, setSelectedMultiplier] = useState<any>(null);

  const { viewNational } = useViewPreference();

  useEffect(() => {
    if (user?.role === 'provincial_admin' && user.province && !viewNational) {
      getMultipliers(user.province);
    } else {
      getMultipliers();
    }
    getInspections();
  }, [getMultipliers, getInspections, user, viewNational]);

  // Calculate statistics
  const stats = {
    totalMultipliers: multipliers.length,
    cooperatives: multipliers.filter(m => m.entityType === 'cooperative').length,
    companies: multipliers.filter(m => m.entityType === 'company').length,
    individuals: multipliers.filter(m => m.entityType === 'individual').length,
    provinces: [...new Set(multipliers.map(m => m.location.province))].length,
    territories: [...new Set(multipliers.map(m => m.location.territory))].length,
    sectors: [...new Set(multipliers.map(m => m.location.sector))].length,
    localities: [...new Set(multipliers.map(m => m.location.locality))].length,
    // Vous pourriez ajouter d'autres stats comme le taux de certification moyen, etc.
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleAddMultiplier = async (data: any) => {
    try {
      await addMultiplier(data);
      setIsAddModalOpen(false);
      getMultipliers(); // Refresh the list
    } catch (error) {
      console.error('Error adding multiplier:', error);
    }
  };

  const handleViewDetails = (multiplier: any) => {
    setSelectedMultiplier(multiplier);
    setIsDetailsModalOpen(true);
  };

  // Filter multipliers
  let filteredMultipliers = multipliers;
  
  if (typeFilter !== 'all') {
    filteredMultipliers = filteredMultipliers.filter(m => m.entityType === typeFilter);
  }
  
  if (provinceFilter !== 'all') {
    filteredMultipliers = filteredMultipliers.filter(m => m.location.province === provinceFilter);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredMultipliers = filteredMultipliers.filter(m => 
      m.entityName.toLowerCase().includes(searchLower) ||
      m.name.toLowerCase().includes(searchLower) ||
      m.location.province.toLowerCase().includes(searchLower) ||
      m.location.territory.toLowerCase().includes(searchLower)
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Agri-Multiplicateurs</h1>
          <p className="text-gray-500 mt-1">Gestion des multiplicateurs de semences agréés</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Ajouter un Multiplicateur
          </Button>
          <Button
            variant="outline"
            leftIcon={<FileSpreadsheet className="w-4 h-4" />}
          >
            Exporter
          </Button>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatsCard
          title="Total Multiplicateurs"
          value={stats.totalMultipliers}
          icon={<Users className="w-6 h-6 text-primary-600" />}
          trend="up"
          trendValue="+12% ce mois"
          compact={true} // Utilisation du mode compact pour cette carte
        />
        
        {/* CARTE : Répartition Géographique améliorée */}
        <StatsCard
          title="Répartition Géographique"
          value={`${stats.provinces} Provinces`} // Valeur principale : nombre de provinces
          icon={<MapPin className="w-6 h-6 text-blue-600" />}
          compact={true} // Garder le mode compact
          subValues={[ // Utilisation de subValues pour les détails
            { label: 'Territoires', value: stats.territories },
            { label: 'Secteurs', value: stats.sectors },
            { label: 'Localités', value: stats.localities }
          ]}
        />
        
        {/* CARTE : Types d'Entités améliorée */}
        <StatsCard
          title="Types d'Entités"
          value={`${stats.cooperatives + stats.companies + stats.individuals} Entités`} // Valeur principale : total des entités
          icon={<Warehouse className="w-6 h-6 text-orange-600" />}
          compact={true} // Garder le mode compact
          subValues={[ // Utilisation de subValues pour les détails
            { label: 'Coopératives', value: stats.cooperatives },
            { label: 'Entreprises', value: stats.companies },
            { label: 'Individuels', value: stats.individuals }
          ]}
        />

        {/* La carte Statut Global reste simple, mais on peut la rendre compacte aussi */}
        <StatsCard
          title="Statut Global"
          value="En croissance"
          icon={<Target className="w-6 h-6 text-green-600" />}
          trend="up"
          trendValue="+8% cette saison"
          compact={true}
        />
      </motion.div>

      {/* Reste du code inchangé (filtres, tableau, modals) */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Rechercher un multiplicateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select 
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Tous les types</option>
            <option value="cooperative">Coopératives</option>
            <option value="company">Entreprises</option>
            <option value="individual">Individuels</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select 
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
          >
            <option value="all">Toutes les provinces</option>
            <option value="kinshasa">Kinshasa</option>
            <option value="sud-kivu">Sud-Kivu</option>
            <option value="nord-kivu">Nord-Kivu</option>
            {/* Ajoutez ici toutes les provinces dynamiquement si possible */}
          </select>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Demande d'Agrément
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type d'Entité
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom de l'Entité
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localité
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Secteur
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Territoire
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  District
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Province
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMultipliers.map((multiplier) => (
                <tr key={multiplier.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{multiplier.requestNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      multiplier.entityType === 'cooperative' 
                        ? 'bg-purple-100 text-purple-800'
                        : multiplier.entityType === 'company'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {multiplier.entityType === 'cooperative' ? 'Coopérative' : multiplier.entityType === 'company' ? 'Entreprise' : 'Individuel'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{multiplier.entityName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{multiplier.location.locality}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{multiplier.location.sector}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{multiplier.location.territory}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{multiplier.location.district}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{multiplier.location.province}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(multiplier)}
                    >
                      Voir détails
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Ajouter un Agri-Multiplicateur"
        size="large"
      >
        <AddAgriMultiplierForm
          onSubmit={handleAddMultiplier}
          isLoading={isLoading}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {selectedMultiplier && (
        <AgriMultiplierDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedMultiplier(null);
          }}
          multiplier={selectedMultiplier}
        />
      )}
    </div>
  );
};

export default AgriMultipliersPage;