import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Beaker, Filter, Clock, Plus, Printer, FileText, Play, XCircle, Search, MapPin } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import StatsCard from '../../components/ui/StatsCard';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import BulletinAnalyseTable from '../../components/bulletinAnalyseTable/bulletinAnalyseTable';
import AddLabAnalysisForm, { LabAnalysisFormData } from '../../components/lab/AddLabAnalysisForm';
import { useAuthStore } from '../../stores/authStore';
import { useViewPreference } from '../../layouts/MainLayout';

const LabAnalyticsPage: React.FC = () => { // Unused variables and hooks (bulletinRef, detailsRef, useReactToPrint) were already removed in a previous step.
  const { user } = useAuthStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isBulletinModalOpen, setIsBulletinModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analyses, setAnalyses] = useState<any[]>([]); // Initialize as empty array
  const [isEditing, setIsEditing] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [showFormPreview, setShowFormPreview] = useState(true); // Pour montrer le formulaire

  const { viewNational } = useViewPreference();

  useEffect(() => {
    if (user?.role === 'provincial_admin' && user.province) {
      setAnalyses(recentAnalyses.filter(analysis => analysis.province === user.province));
    } else if (user?.role === 'national_admin' && !viewNational) {
      setAnalyses(recentAnalyses.filter(analysis => analysis.province === user.province));
    } else {
      setAnalyses(recentAnalyses);
    }
  }, [user, viewNational]);

  const labStats = {
    pendingAnalyses: analyses.filter(a => a.status === 'pending').length,
    completedAnalyses: analyses.filter(a => a.status === 'completed').length,
    failedSamples: analyses.filter(a => a.status === 'failed').length,
  };

  const handleAddAnalysis = async (data: LabAnalysisFormData) => {
    console.log('Received data in handleAddAnalysis:', data);
    console.log('Packaging calculation received:', data.calculatedPackaging);
    setIsLoading(true);
    try {
      if (isEditing && selectedAnalysis) {
        console.log('Updating existing analysis:', selectedAnalysis.id);
        const updatedAnalyses = analyses.map(analysis => 
          analysis.id === selectedAnalysis.id 
            ? { 
                ...analysis, 
                ...data,
                // S'assurer que le calcul d'emballage est bien sauvegardé
                calculatedPackaging: data.calculatedPackaging || data.packagingCalculation,
                referenceNumber: data.referenceNumber // Ensure referenceNumber is updated
              }
            : analysis
        );
        setAnalyses(updatedAnalyses);
        console.log('Analysis updated successfully');
      } else {
        console.log('Creating new analysis');
        const requiredFields = ['cropType', 'species', 'productionYear', 'productionSeason', 'province', 'site'];
        const isComplete = requiredFields.every(field => data[field]);
        
        const newAnalysis = {
          ...data,
          id: Date.now().toString(),
          calculatedPackaging: data.calculatedPackaging || data.packagingCalculation || 'Non spécifié',
          status: isComplete ? 'completed' : 'pending'
        };
        console.log('New analysis created:', newAnalysis);
        console.log('Packaging calculation in new analysis:', newAnalysis.calculatedPackaging);
        setAnalyses(prev => [newAnalysis, ...prev]);
        console.log('Analysis added to state');
      }
      
      setIsAddModalOpen(false);
      setShowFormPreview(false);
      setIsEditing(false);
      setSelectedAnalysis(null);
      console.log('Modal closed and state reset');
    } catch (error) {
      console.error('Error handling analysis:', error);
    } finally {
      setIsLoading(false);
      console.log('Loading state reset');
    }
  };

  const handleContinueAnalysis = (analysis: any) => {
    setSelectedAnalysis(analysis);
    setIsEditing(true);
    setIsAddModalOpen(true);
  };

  const handleRejectAnalysis = (analysis: any) => {
    setSelectedAnalysis(analysis);
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedAnalysis || !rejectReason) return;

    setIsLoading(true);
    try {
      const updatedAnalyses = analyses.map(analysis => 
        analysis.id === selectedAnalysis.id 
          ? { 
              ...analysis, 
              status: 'failed',
              rejectionReason: rejectReason,
              rejectionDate: new Date().toISOString()
            }
          : analysis
      );
      setAnalyses(updatedAnalyses);
      setIsRejectModalOpen(false);
      setSelectedAnalysis(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (analysis: any) => {
    setSelectedAnalysis(analysis);
    setIsDetailsModalOpen(true);
  };

  const handleViewBulletin = (analysis: any) => {
    setSelectedAnalysis(analysis);
    setIsBulletinModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter analyses based on search, status, and province
  let filteredAnalyses = analyses;

  if (statusFilter !== 'all') {
    filteredAnalyses = filteredAnalyses.filter(analysis => analysis.status === statusFilter);
  }

  if (provinceFilter !== 'all') {
    filteredAnalyses = filteredAnalyses.filter(analysis => analysis.province === provinceFilter);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredAnalyses = filteredAnalyses.filter(analysis => 
      analysis.referenceNumber.toLowerCase().includes(searchLower) ||
      analysis.cropType.toLowerCase().includes(searchLower) ||
      analysis.species.toLowerCase().includes(searchLower) ||
      analysis.province.toLowerCase().includes(searchLower) ||
      analysis.bulletinNumber?.toLowerCase().includes(searchLower)
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Conforme</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">En cours</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Non Conforme</span>;
      default:
        return null;
    }
  };

  // Get unique provinces for filter
  const provinces = [...new Set(analyses.map(a => a.province))].sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analyses de Laboratoire</h1>
          <p className="text-gray-500 mt-1">Suivez les analyses en cours et consultez les résultats</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setIsEditing(false);
              setSelectedAnalysis(null);
              setIsAddModalOpen(true);
            }}
          >
            Ajouter une analyse
          </Button>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatsCard 
          title="Échantillon effectué"
          value={labStats.pendingAnalyses}
          icon={<Clock className="h-6 w-6 text-yellow-500" />}
        />
        
        <StatsCard 
          title="Échantillon conforme aux normes"
          value={labStats.completedAnalyses}
          icon={<Beaker className="h-6 w-6 text-green-500" />}
          trend="up"
          trendValue="+12% depuis le mois dernier"
        />
        
        <StatsCard 
          title="Échantillon non conforme aux normes"
          value={labStats.failedSamples}
          icon={<Filter className="h-6 w-6 text-red-500" />}
          trend="down"
          trendValue="-3% depuis le mois dernier"
        />
      </motion.div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Rechercher par référence, culture, espèce, province..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select 
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En cours</option>
            <option value="completed">Complétées</option>
            <option value="failed">Rejetées</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-gray-400" />
          <select 
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
          >
            <option value="all">Toutes les provinces</option>
            {provinces.map(province => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Analyses récentes 
            {search || statusFilter !== 'all' || provinceFilter !== 'all' ? (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredAnalyses.length} résultat{filteredAnalyses.length > 1 ? 's' : ''})
              </span>
            ) : null}
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Référence
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de Culture
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Espèce
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Année de Production
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saison
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Province
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
              {filteredAnalyses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    {search || statusFilter !== 'all' || provinceFilter !== 'all'
                      ? 'Aucune analyse trouvée avec ces critères'
                      : 'Aucune analyse disponible'
                    }
                  </td>
                </tr>
              ) : (
                filteredAnalyses.map((analysis) => (
                  <motion.tr 
                    key={analysis.id}
                    whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                    transition={{ duration: 0.2 }}
                    className="group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{analysis.referenceNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{analysis.cropType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{analysis.species}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{analysis.productionYear}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{analysis.productionSeason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{analysis.province}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(analysis.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(analysis)}
                        >
                          Voir détails
                        </Button>
                        {analysis.status === 'completed' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsDetailsModalOpen(false);
                              handleViewBulletin(analysis);
                            }}
                            leftIcon={<FileText className="w-4 h-4" />}
                          >
                            Bulletin
                          </Button>
                        ) : analysis.status === 'pending' ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleContinueAnalysis(analysis)}
                              leftIcon={<Play className="w-4 h-4" />}
                            >
                              Continuer
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleRejectAnalysis(analysis)}
                              leftIcon={<XCircle className="w-4 h-4" />}
                            >
                              Rejeter
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedAnalysis(null);
        }}
        title="Détails de l'analyse"
        size="full"
      >
        {selectedAnalysis && (
          <div className="space-y-6">
            <div className="flex justify-end space-x-3">
              {selectedAnalysis.status === 'completed' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    handleViewBulletin(selectedAnalysis);
                  }}
                  leftIcon={<FileText className="w-4 h-4" />}
                >
                  Voir le bulletin
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handlePrint}
                leftIcon={<Printer className="w-4 h-4" />}
              >
                Imprimer
              </Button>
            </div>

            <div className="bg-white w-[210mm] mx-auto p-[20mm] shadow-lg print:shadow-none border border-blue-200 rounded-lg">
              <div className="text-center mb-8 border-b pb-4 border-blue-100">
                <h1 className="text-3xl font-extrabold text-blue-800">SENASEM</h1>
                <p className="text-xl text-blue-600 mt-2">Détails de l'analyse</p>
                <p className="text-sm text-gray-600 mt-2">
                  Service National de Semences - Laboratoire de <span className="font-semibold text-blue-700">{selectedAnalysis.province}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">N° Référence:</span>
                  <span className="font-bold text-blue-900">{selectedAnalysis.referenceNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">N° Bulletin:</span>
                  <span className="font-bold text-blue-900">{selectedAnalysis.bulletinNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Classification:</span>
                  <span className="font-bold text-blue-900">{selectedAnalysis.classification}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Emballage:</span>
                  <span className="font-bold text-blue-900 whitespace-nowrap">{selectedAnalysis.calculatedPackaging || 'Non calculé'}</span>
                </div>
              </div>

              <div className="border border-green-300 rounded-lg p-6 bg-green-50 shadow-md">
                <h2 className="text-lg font-bold mb-4 text-green-700">Statut de l'Analyse</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">État:</span>
                    {getStatusBadge(selectedAnalysis.status)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Date début:</span>
                    <span className="font-bold text-green-900">{selectedAnalysis.analysisStartDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Date fin:</span>
                    <span className="font-bold text-green-900">{selectedAnalysis.analysisEndDate}</span>
                  </div>
                  {selectedAnalysis.status === 'failed' && selectedAnalysis.rejectionReason && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Raison du rejet:</span>
                      <span className="font-bold text-red-700">{selectedAnalysis.rejectionReason}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-purple-300 rounded-lg p-6 bg-purple-50 shadow-md mb-8">
                <h2 className="text-lg font-bold mb-4 text-purple-700">Informations sur l'Échantillon</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Type de culture:</span>
                    <span className="font-bold text-purple-900">{selectedAnalysis.cropType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Espèce:</span>
                    <span className="font-bold text-purple-900">{selectedAnalysis.species}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Variété:</span>
                    <span className="font-bold text-purple-900">{selectedAnalysis.variety}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Nom scientifique:</span>
                    <span className="font-bold text-purple-900">{selectedAnalysis.scientificName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Année de production:</span>
                    <span className="font-bold text-purple-900">{selectedAnalysis.productionYear}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Saison de production:</span>
                    <span className="font-bold text-purple-900">{selectedAnalysis.productionSeason}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Province:</span>
                    <span className="font-bold text-purple-900">{selectedAnalysis.province}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Site:</span>
                    <span className="font-bold text-purple-900">{selectedAnalysis.site}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Territoire:</span>
                    <span className="font-bold text-purple-900">{selectedAnalysis.territory}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Poids de l'échantillon:</span>
                    <span className="font-bold text-purple-900">{selectedAnalysis.sampleWeight}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Poids du lot:</span>
                    <span className="font-bold text-purple-900">{selectedAnalysis.batchWeight}</span>
                  </div>
                </div>
              </div>

              <div className="border border-orange-300 rounded-lg p-6 bg-orange-50 shadow-md mb-8">
                <h2 className="text-lg font-bold mb-4 text-orange-700">Résultats des Analyses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Teneur en eau:</span>
                    <span className="font-bold text-orange-900">{selectedAnalysis.teContent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Semences pures:</span>
                    <span className="font-bold text-orange-900">{selectedAnalysis.pureSeed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Matières inertes:</span>
                    <span className="font-bold text-orange-900">{selectedAnalysis.inertMatter}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Autres semences:</span>
                    <span className="font-bold text-orange-900">{selectedAnalysis.otherSeeds}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Poids de mille grains:</span>
                    <span className="font-bold text-orange-900">{selectedAnalysis.thousandGrainWeight}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Germes normaux:</span>
                    <span className="font-bold text-orange-900">{selectedAnalysis.normalSeedlings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Germes anormaux:</span>
                    <span className="font-bold text-orange-900">{selectedAnalysis.abnormalSeedlings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Graines dures:</span>
                    <span className="font-bold text-orange-900">{selectedAnalysis.hardSeeds}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Graines fraîches:</span>
                    <span className="font-bold text-orange-900">{selectedAnalysis.freshSeeds}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Semences mortes:</span>
                    <span className="font-bold text-orange-900">{selectedAnalysis.deadSeeds}</span>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Préparé par: <span className="font-semibold text-gray-700">{selectedAnalysis.sampler}</span></p>
                <p className="text-sm text-gray-500">Date d'échantillonnage: <span className="font-semibold text-gray-700">{selectedAnalysis.samplingDate}</span></p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isBulletinModalOpen}
        onClose={() => {
          setIsBulletinModalOpen(false);
          setSelectedAnalysis(null);
        }}
        title="Bulletin d'Analyse"
        size="full"
      >
        {selectedAnalysis && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={handlePrint}
                leftIcon={<Printer className="w-4 h-4" />}
              >
                Imprimer
              </Button>
            </div>

            <BulletinAnalyseTable data={selectedAnalysis} />
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditing(false);
          setSelectedAnalysis(null);
        }}
        title={isEditing ? "Continuer l'analyse" : "Ajouter une nouvelle analyse"}
        size="full"
      >
        <AddLabAnalysisForm
          onSubmit={handleAddAnalysis}
          isLoading={isLoading}
          initialData={selectedAnalysis}
          isEditing={isEditing}
          allAnalyses={analyses} // Pass all analyses here
        />
      </Modal>

      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setSelectedAnalysis(null);
          setRejectReason('');
        }}
        title="Rejeter l'analyse"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Vous êtes sur le point de rejeter l'analyse {selectedAnalysis?.referenceNumber}.
              Cette action est irréversible.
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motif du rejet
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              rows={4}
              placeholder="Veuillez expliquer la raison du rejet..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectModalOpen(false);
                setSelectedAnalysis(null);
                setRejectReason('');
              }}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmReject}
              isLoading={isLoading}
              disabled={!rejectReason.trim()}
            >
              Confirmer le rejet
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const recentAnalyses = [
  { 
    id: '1', // Changed to string for consistency with Date.now().toString()
    referenceNumber: 'LAB-2023-001',
    cropType: 'Céréale',
    species: 'Maïs',
    variety: 'ZM523',
    scientificName: 'Zea mays',
    productionYear: '2023',
    productionSeason: 'A',
    province: 'Nord-Kivu',
    status: 'completed',
    teContent: '98%',
    pureSeed: '96%',
    inertMatter: '2%',
    otherSeeds: '2%',
    thousandGrainWeight: '380g',
    normalSeedlings: '92%',
    abnormalSeedlings: '5%',
    hardSeeds: '2%',
    freshSeeds: '0%',
    deadSeeds: '1%',
    samplingDate: '2023-03-15',
    analysisStartDate: '2023-03-16',
    analysisEndDate: '2023-03-20',
    sampler: 'Jean Dupont',
    structure: 'SENASEM Nord-Kivu',
    site: 'Laboratoire Central',
    territory: 'Goma',
    sampleWeight: '1000g',
    batchWeight: '2000kg',
    bulletinNumber: 'BUL-2023-001',
    calculatedPackaging: '10 sacs de 200kg' // Added calculatedPackaging for the sample data
  },
  { 
    id: '2', 
    referenceNumber: 'LAB-2023-002',
    cropType: 'Légumineuse',
    species: 'Haricot',
    variety: 'Mvuazi',
    scientificName: 'Phaseolus vulgaris',
    productionYear: '2024',
    productionSeason: 'B',
    province: 'Kinshasa',
    status: 'pending',
    teContent: '',
    pureSeed: '',
    inertMatter: '',
    otherSeeds: '',
    thousandGrainWeight: '',
    normalSeedlings: '',
    abnormalSeedlings: '',
    hardSeeds: '',
    freshSeeds: '',
    deadSeeds: '',
    samplingDate: '2024-01-10',
    analysisStartDate: '2024-01-11',
    analysisEndDate: '',
    sampler: 'Marie Ndunda',
    structure: 'SENASEM Kinshasa',
    site: 'Laboratoire Provincial',
    territory: 'Limete',
    sampleWeight: '500g',
    batchWeight: '500kg',
    calculatedPackaging: 'Non spécifié'
  },
  { 
    id: '3', 
    referenceNumber: 'LAB-2023-003',
    cropType: 'Tubercule',
    species: 'Pomme de terre',
    variety: 'Caravelle',
    scientificName: 'Solanum tuberosum',
    productionYear: '2023',
    productionSeason: 'A',
    province: 'Kasaï Central',
    status: 'failed',
    rejectionReason: 'Présence de maladies fongiques',
    rejectionDate: '2023-05-01',
    teContent: '70%', // Example for a failed analysis
    pureSeed: '50%',
    inertMatter: '20%',
    otherSeeds: '30%',
    thousandGrainWeight: '500g',
    normalSeedlings: '30%',
    abnormalSeedlings: '40%',
    hardSeeds: '10%',
    freshSeeds: '5%',
    deadSeeds: '15%',
    samplingDate: '2023-04-20',
    analysisStartDate: '2023-04-22',
    analysisEndDate: '2023-05-01',
    sampler: 'Pierre Kalala',
    structure: 'SENASEM Kasaï Central',
    site: 'Centre de Recherche',
    territory: 'Kananga',
    sampleWeight: '1500g',
    batchWeight: '1000kg',
    calculatedPackaging: 'Non calculé'
  },
  { 
    id: '4', 
    referenceNumber: 'LAB-2023-004',
    cropType: 'Céréale',
    species: 'Riz',
    variety: 'IR8',
    scientificName: 'Oryza sativa',
    productionYear: '2024',
    productionSeason: 'A',
    province: 'Ituri',
    status: 'completed',
    teContent: '97%',
    pureSeed: '95%',
    inertMatter: '3%',
    otherSeeds: '2%',
    thousandGrainWeight: '25g',
    normalSeedlings: '90%',
    abnormalSeedlings: '7%',
    hardSeeds: '1%',
    freshSeeds: '1%',
    deadSeeds: '1%',
    samplingDate: '2024-02-01',
    analysisStartDate: '2024-02-02',
    analysisEndDate: '2024-02-08',
    sampler: 'Fatima Baraka',
    structure: 'SENASEM Ituri',
    site: 'Laboratoire Local',
    territory: 'Bunia',
    sampleWeight: '800g',
    batchWeight: '1500kg',
    bulletinNumber: 'BUL-2023-002',
    calculatedPackaging: '30 sacs de 50kg'
  },
  { 
    id: '5', 
    referenceNumber: 'LAB-2023-005',
    cropType: 'Légume',
    species: 'Tomate',
    variety: 'Roma VF',
    scientificName: 'Solanum lycopersicum',
    productionYear: '2023',
    productionSeason: 'B',
    province: 'Sud-Kivu',
    status: 'pending',
    teContent: '',
    pureSeed: '',
    inertMatter: '',
    otherSeeds: '',
    thousandGrainWeight: '',
    normalSeedlings: '',
    abnormalSeedlings: '',
    hardSeeds: '',
    freshSeeds: '',
    deadSeeds: '',
    samplingDate: '2023-11-10',
    analysisStartDate: '2023-11-12',
    analysisEndDate: '',
    sampler: 'Sophie Mambo',
    structure: 'SENASEM Sud-Kivu',
    site: 'Antenne Uvira',
    territory: 'Uvira',
    sampleWeight: '200g',
    batchWeight: '300kg',
    calculatedPackaging: 'Non spécifié'
  },
];

export default LabAnalyticsPage;