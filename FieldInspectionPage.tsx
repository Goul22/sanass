import React, { useState, useEffect, useRef } from 'react'; // Importer useRef ici
import { motion } from 'framer-motion';
import { Search, Filter, FileSpreadsheet, FileText, CheckCircle, Clock, BarChart3, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import StatsCard from '../../components/ui/StatsCard';
import Modal from '../../components/ui/Modal';
import ComprehensiveInspectionForm from '../../components/inspection/ComprehensiveInspectionForm';
import WizardInspectionForm from '../../components/inspection/WizardInspectionForm';
import { useAgriMultiplierStore } from '../../stores/agriMultiplierStore';
import { useFieldInspectionStore } from '../../stores/fieldInspectionStore';
import { useAuthStore } from '../../stores/authStore';
import { useViewPreference } from '../../layouts/MainLayout';
import FormulaireDeclarationCuluture from '../../components/formulaireDeclarationCuluture/formulaireDeclarationCuluture';
import FicheNotationChamp from '../../components/ficheNotationChamp/ficheNotationChamp';
import RapportInspectionCulture from '../../components/rapportInspectionCulture/rapportInspectionCulture';
import { useReactToPrint } from 'react-to-print';

const FieldInspectionPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [isComprehensiveFormOpen, setIsComprehensiveFormOpen] = useState(false);
  const [isWizardFormOpen, setIsWizardFormOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<any>(null);
  const [editingMode, setEditingMode] = useState<'comprehensive' | 'wizard' | null>(null);
  const [showFicheModal, setShowFicheModal] = useState(false);
  const [selectedFicheInspection, setSelectedFicheInspection] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { multipliers, getMultipliers } = useAgriMultiplierStore();
  const { user } = useAuthStore();
  const {
    inspections,
    getInspections,
    addInspection,
    updateInspection
  } = useFieldInspectionStore();

  // --- DÉPLACÉ À L'INTÉRIEUR DU COMPOSANT ---
  const fichePrintRef = useRef(null);
  const handlePrintFiche = useReactToPrint({
    content: () => fichePrintRef.current,
  });
  // --- FIN DU DÉPLACEMENT ---

  const { viewNational } = useViewPreference();

  useEffect(() => {
    const fetchData = async () => {
      if (user?.role === 'provincial_admin' && user.province && !viewNational) {
        await Promise.all([getMultipliers(user.province), getInspections(user.province)]);
      } else {
        await Promise.all([getMultipliers(), getInspections()]);
      }
    };
    fetchData();
  }, [getMultipliers, getInspections, user, viewNational]);

  // Calculate statistics
  const stats = {
    totalInspections: inspections.length,
    completedInspections: inspections.filter(i => i.status === 'completed').length,
    pendingInspections: inspections.filter(i => i.status === 'pending').length,
    inProgressInspections: inspections.filter(i => i.status === 'in_progress').length,
    rejectedInspections: inspections.filter(i => i.status === 'rejected').length,
    provinces: [...new Set(inspections.map(i => i.localisation?.province).filter(Boolean))].length,
    entities: [...new Set(inspections.map(i => i.nomEntite).filter(Boolean))].length,
    averageCompletionRate: inspections.length > 0
      ? Math.round(inspections.reduce((acc, curr) => acc + curr.completionPercentage, 0) / inspections.length)
      : 0
  };

  const handleComprehensiveFormSubmit = async (formData: any) => {
    try {
      if (selectedInspection && editingMode === 'comprehensive') {
        // Update existing comprehensive inspection
        await updateInspection(selectedInspection.id, {
          requestNumberAgri: formData.requestNumberAgri,
          fieldNumbers: formData.fieldNumber ? [formData.fieldNumber] : selectedInspection.fieldNumbers,
          typeEntite: formData.entityType || selectedInspection.typeEntite,
          nomEntite: formData.entityName || selectedInspection.nomEntite,
          localisation: {
            localite: formData.localisation || selectedInspection.localisation?.localite || '',
            secteur: formData.secteur || selectedInspection.localisation?.secteur || '',
            territoire: formData.territoire || selectedInspection.localisation?.territoire || '',
            district: formData.district || selectedInspection.localisation?.district || '',
            province: formData.province || selectedInspection.localisation?.province || ''
          },
          annee: parseInt(formData.year) || selectedInspection.annee || new Date().getFullYear(),
          superficieExploite: 0,
          rendement: 0,
          rendementRealise: 0,
          status: 'completed',
          completionPercentage: 100,
          lastUpdated: new Date().toISOString(),
          forms: {
            ...selectedInspection.forms,
            comprehensive: formData
          }
        });
      } else {
        // Create new comprehensive inspection
        await addInspection({
          requestNumberAgri: formData.requestNumberAgri,
          fieldNumbers: formData.fieldNumber ? [formData.fieldNumber] : [],
          typeEntite: formData.entityType,
          nomEntite: formData.entityName,
          localisation: {
            localite: formData.localisation || '',
            secteur: formData.secteur || '',
            territoire: formData.territoire || '',
            district: formData.district || '',
            province: formData.province || ''
          },
          annee: parseInt(formData.year) || new Date().getFullYear(),
          superficieExploite: 0,
          rendement: 0,
          rendementRealise: 0,
          status: 'completed',
          completionPercentage: 100,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          forms: {
            comprehensive: formData
          },
          missingForms: []
        });
      }

      setIsComprehensiveFormOpen(false);
      setSelectedInspection(null);
      setEditingMode(null);
    } catch (error) {
      console.error('Error submitting comprehensive form:', error);
    }
  };

  const handleWizardFormSubmit = async (formData: any) => {
    try {
      if (selectedInspection && editingMode === 'wizard') {
        // Update existing wizard inspection
        await updateInspection(selectedInspection.id, {
          requestNumberAgri: formData.farmerId,
          fieldNumbers: formData.cropDeclaration?.fieldNumber ? [formData.cropDeclaration.fieldNumber] : [],
          typeEntite: formData.cropDeclaration?.establishmentName || '',
          nomEntite: formData.cropDeclaration?.producerName || '',
          localisation: {
            localite: formData.locality || '',
            secteur: formData.sector || '',
            territoire: '',
            district: formData.district || '',
            province: formData.province || ''
          },
          annee: new Date().getFullYear(),
          superficieExploite: 0,
          rendement: 0,
          rendementRealise: 0,
          status: 'completed',
          completionPercentage: 100,
          lastUpdated: new Date().toISOString(),
          forms: {
            ...selectedInspection.forms,
            wizard: formData
          }
        });
      } else {
        // Create new wizard inspection
        await addInspection({
          requestNumberAgri: formData.farmerId,
          fieldNumbers: formData.cropDeclaration?.fieldNumber ? [formData.cropDeclaration.fieldNumber] : [],
          typeEntite: formData.cropDeclaration?.establishmentName || '',
          nomEntite: formData.cropDeclaration?.producerName || '',
          localisation: {
            localite: formData.locality || '',
            secteur: formData.sector || '',
            territoire: '',
            district: formData.district || '',
            province: formData.province || ''
          },
          annee: new Date().getFullYear(),
          superficieExploite: 0,
          rendement: 0,
          rendementRealise: 0,
          status: 'completed',
          completionPercentage: 100,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          forms: {
            wizard: formData
          },
          missingForms: []
        });
      }

      setIsWizardFormOpen(false);
      setSelectedInspection(null);
      setEditingMode(null);
    } catch (error) {
      console.error('Error submitting wizard form:', error);
    }
  };

  const handleEditInspection = (inspection: any) => {
    setSelectedInspection(inspection);
    if (inspection.forms?.wizard) {
      setEditingMode('wizard');
      setIsWizardFormOpen(true);
    } else {
      setEditingMode('comprehensive');
      setIsComprehensiveFormOpen(true);
    }
  };

  const handleNewComprehensiveInspection = () => {
    setSelectedInspection(null);
    setEditingMode(null);
    setIsComprehensiveFormOpen(true);
  };

  const handleNewWizardInspection = () => {
    setSelectedInspection(null);
    setEditingMode(null);
    setIsWizardFormOpen(true);
  };

  const handleViewFiche = (inspection: any) => {
    console.log('Inspection object passed to handleViewFiche:', inspection);
    setSelectedFicheInspection(inspection);
    setCurrentSlide(0);
    setShowFicheModal(true);
  };

  // Filter inspections
  let filteredInspections = inspections;

  if (statusFilter !== 'all') {
    filteredInspections = filteredInspections.filter(i => i.status === statusFilter);
  }

  if (provinceFilter !== 'all') {
    filteredInspections = filteredInspections.filter(i => i.localisation?.province === provinceFilter);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredInspections = filteredInspections.filter(i =>
      (i.requestNumberAgri || '').toLowerCase().includes(searchLower) || // Changed to requestNumberAgri
      (i.nomEntite || '').toLowerCase().includes(searchLower) ||
      (i.localisation?.localite || '').toLowerCase().includes(searchLower)
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      case 'in_progress':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">En cours</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Complétée</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Rejetée</span>;
      default:
        return null;
    }
  };

  const generateFicheNumber = (inspection: any) => { // Added type for inspection
    // Example: N°0001/COORDPROV/SENASEM/AGRI/2024
    const year = inspection?.annee || new Date().getFullYear();
    const id = inspection?.id ? inspection.id.toString().padStart(4, '0') : '0000';
    return `N°${id}/COORDPROV/..../SENASEM/AGRI/${year}`;
  };

  const reportData = selectedFicheInspection ? {
    // Flatten data for easy access in report components
    ...selectedFicheInspection.localisation,
    annee: selectedFicheInspection.annee,
    ...(selectedFicheInspection.forms?.comprehensive || {}),
    ...(selectedFicheInspection.forms?.wizard || {}),
    ...(selectedFicheInspection.forms?.wizard?.cropDeclaration || {}),
    ...(selectedFicheInspection.forms?.wizard?.fieldNotation || {}),

    // Explicit mappings for clarity and to resolve conflicts/formatting

    nomEtPostnom: selectedFicheInspection.forms?.wizard?.cropDeclaration?.nomEtPostnom || selectedFicheInspection.nomEntite,
    nomEntite: selectedFicheInspection.forms?.wizard?.cropDeclaration?.establishmentName || selectedFicheInspection.typeEntite,
    // Explicit mappings for clarity and to resolve conflicts/formatting
    nomEtAdresseProducteur: `${selectedFicheInspection.forms?.wizard?.fieldNotation?.producerName || selectedFicheInspection.forms?.wizard?.cropDeclaration?.producerName || ''} ${selectedFicheInspection.forms?.wizard?.cropDeclaration?.establishmentName || ''}, ${selectedFicheInspection.forms?.wizard?.cropDeclaration?.address || ''}`.trim(),
    localisationSite: `${selectedFicheInspection.forms?.wizard?.fieldNotation?.siteLocation || selectedFicheInspection.forms?.wizard?.cropDeclaration?.address || ''}, ${selectedFicheInspection.forms?.wizard?.cropDeclaration?.district || ''}`.trim(),
    numeroIdentificationParcelle: selectedFicheInspection.forms?.wizard?.fieldNotation?.controlledParcelNumber,
    numeroDeclarationCulture: selectedFicheInspection.forms?.wizard?.fieldNotation?.cultureDeclarationNumber,
    dateInspection: selectedFicheInspection.forms?.wizard?.fieldNotation?.inspectionDate || selectedFicheInspection.inspectionDate,
    culture: selectedFicheInspection.forms?.wizard?.fieldNotation?.species || selectedFicheInspection.forms?.wizard?.cropDeclaration?.species,
    variete: selectedFicheInspection.forms?.wizard?.fieldNotation?.variety || selectedFicheInspection.forms?.wizard?.cropDeclaration?.variety,
    periodeSemis: selectedFicheInspection.forms?.wizard?.fieldNotation?.sowingPeriod || selectedFicheInspection.forms?.wizard?.cropDeclaration?.sowingPeriod,
    classeSemence: selectedFicheInspection.forms?.wizard?.fieldNotation?.motherSeedCategory || selectedFicheInspection.forms?.wizard?.cropDeclaration?.category,
    superficie: selectedFicheInspection.forms?.wizard?.fieldNotation?.declaredSurface || selectedFicheInspection.forms?.wizard?.cropDeclaration?.declaredSurface,
    periodeRecolte: selectedFicheInspection.forms?.wizard?.fieldNotation?.harvestPeriod || selectedFicheInspection.forms?.wizard?.cropDeclaration?.harvestPeriod,
    densitePlantes: selectedFicheInspection.forms?.wizard?.fieldNotation?.plantDensity || selectedFicheInspection.forms?.wizard?.cropDeclaration?.density,
    doseSemis: selectedFicheInspection.forms?.wizard?.fieldNotation?.doseSemis,
    stadeVegetation: selectedFicheInspection.forms?.wizard?.fieldNotation?.vegetationState || selectedFicheInspection.forms?.wizard?.cropDeclaration?.vegetationStage,
    productionAttendue: selectedFicheInspection.forms?.wizard?.fieldNotation?.productionAttendue,
    origineSemenceMere: selectedFicheInspection.forms?.wizard?.fieldNotation?.motherSeedOrigin || selectedFicheInspection.forms?.wizard?.cropDeclaration?.seedOrigin,
    categorieSemenceMere: selectedFicheInspection.forms?.wizard?.fieldNotation?.motherSeedCategory || selectedFicheInspection.forms?.wizard?.cropDeclaration?.seedCategory,
    precedentCultural: selectedFicheInspection.forms?.wizard?.fieldNotation?.previousCrop || selectedFicheInspection.forms?.wizard?.cropDeclaration?.previousCrop,
    isolement: selectedFicheInspection.forms?.wizard?.fieldNotation?.isolation || selectedFicheInspection.forms?.wizard?.cropDeclaration?.isolationDistance,
    stadeCroissance: selectedFicheInspection.forms?.wizard?.fieldNotation?.growthStage,
    etatGeneralCulture: selectedFicheInspection.forms?.wizard?.fieldNotation?.generalCultureState,
    actionPhytosanitaire: selectedFicheInspection.forms?.wizard?.fieldNotation?.phytosanitaryAction || selectedFicheInspection.forms?.wizard?.cropDeclaration?.phytosanitaryTreatment,
    mauvaisesHerbes: selectedFicheInspection.forms?.wizard?.fieldNotation?.weeds,
    plantesCultiveesAutresEspeces: selectedFicheInspection.forms?.wizard?.fieldNotation?.otherCrops,
    plantesAdventices: selectedFicheInspection.forms?.wizard?.fieldNotation?.adventitiousPlants,
    maladies: selectedFicheInspection.forms?.wizard?.fieldNotation?.diseases,
    autresObservations: selectedFicheInspection.forms?.wizard?.fieldNotation?.observations,
    codeEntite: selectedFicheInspection.forms?.wizard?.farmerId || selectedFicheInspection.requestNumberAgri,
    numeroChamp: selectedFicheInspection.forms?.wizard?.cropDeclaration?.fieldNumber,
    localisationChamp: selectedFicheInspection.localisation?.localite,
    // Formulaire de Déclaration de Culture specific data
    categorie: selectedFicheInspection.forms?.wizard?.cropDeclaration?.category,
    generation: selectedFicheInspection.forms?.wizard?.cropDeclaration?.generation,
    origine: selectedFicheInspection.forms?.wizard?.cropDeclaration?.origin,
    dateReception: selectedFicheInspection.forms?.wizard?.cropDeclaration?.receptionDate,
    anneeProduction: selectedFicheInspection.forms?.wizard?.cropDeclaration?.productionYear,
    saisonProduction: selectedFicheInspection.forms?.wizard?.cropDeclaration?.productionSeason,
    identificationLot: selectedFicheInspection.forms?.wizard?.cropDeclaration?.lotIdentification,
    quantiteUtilisee: selectedFicheInspection.forms?.wizard?.cropDeclaration?.quantityUsed,
    teneurEnEau: selectedFicheInspection.forms?.wizard?.cropDeclaration?.waterContent,
    pouvoirGerminatif: selectedFicheInspection.forms?.wizard?.cropDeclaration?.germinativePower,
    adresse: selectedFicheInspection.forms?.wizard?.cropDeclaration?.address,
    categorieProfessionnelle: selectedFicheInspection.forms?.wizard?.cropDeclaration?.professionalCategory,
    secteur: selectedFicheInspection.forms?.wizard?.cropDeclaration?.sector,
    distanceIsolement: selectedFicheInspection.forms?.wizard?.cropDeclaration?.isolationDistance,
    ecartement: selectedFicheInspection.forms?.wizard?.cropDeclaration?.spacing,
    densite: selectedFicheInspection.forms?.wizard?.cropDeclaration?.density,
    traitementsPhytosanitaires: selectedFicheInspection.forms?.wizard?.cropDeclaration?.phytosanitaryTreatment,
    donneesGPS: selectedFicheInspection.forms?.wizard?.cropDeclaration?.gpsData,
    amendementsSol: selectedFicheInspection.forms?.wizard?.cropDeclaration?.soilAmendments,

    // RapportInspectionCulture specific data
    type: selectedFicheInspection.forms?.wizard?.inspectionReport?.type || selectedFicheInspection.typeEntite,
    noms: selectedFicheInspection.forms?.wizard?.inspectionReport?.name || selectedFicheInspection.nomEntite,
    codeEntite: selectedFicheInspection.forms?.wizard?.inspectionReport?.code || selectedFicheInspection.requestNumberAgri,
    secteur: selectedFicheInspection.forms?.wizard?.inspectionReport?.sector,
    adresse: selectedFicheInspection.forms?.wizard?.inspectionReport?.address,
    location: selectedFicheInspection.forms?.wizard?.inspectionReport?.location,
    reliefType: selectedFicheInspection.forms?.wizard?.inspectionReport?.reliefType,
    otherFieldsPresence: selectedFicheInspection.forms?.wizard?.inspectionReport?.otherFieldsPresence,
    waterCoursePresence: selectedFicheInspection.forms?.wizard?.inspectionReport?.waterCoursePresence,
    fieldCount: selectedFicheInspection.forms?.wizard?.inspectionReport?.fieldCount,
    vegetationType: selectedFicheInspection.forms?.wizard?.inspectionReport?.vegetationType,
    speciesCount: selectedFicheInspection.forms?.wizard?.inspectionReport?.speciesCount,
    climateType: selectedFicheInspection.forms?.wizard?.inspectionReport?.climateType,
    visitedFields: selectedFicheInspection.forms?.wizard?.inspectionReport?.visitedFields,
    typeVisite: selectedFicheInspection.forms?.wizard?.inspectionReport?.visitType,
    approvedFields: selectedFicheInspection.forms?.wizard?.inspectionReport?.approvedFields,
        refusedFields: selectedFicheInspection.forms?.wizard?.inspectionReport?.refusedFields,
        inspectorName: selectedFicheInspection.forms?.wizard?.inspectionReport?.inspectorName,
        observations: selectedFicheInspection.forms?.wizard?.inspectionReport?.observations,
    numeroChamp: selectedFicheInspection.forms?.wizard?.inspectionReport?.fieldNumber,
    densite: selectedFicheInspection.forms?.wizard?.inspectionReport?.density,
    periodeSemis: selectedFicheInspection.forms?.wizard?.inspectionReport?.sowingPeriod,
    nomInspecteur: selectedFicheInspection.forms?.wizard?.inspectionReport?.inspectorName,
    dateInspection: selectedFicheInspection.forms?.wizard?.inspectionReport?.inspectionDate,
  } : {};

  const slides = [
    {
      title: 'Formulaire de Déclaration de Culture',
      content: <FormulaireDeclarationCuluture data={{...reportData, ficheNumber: generateFicheNumber(selectedFicheInspection)}} />
    },
    {
      title: 'Fiche de Notation au Champ',
      content: <FicheNotationChamp data={{...reportData, ficheNumber: generateFicheNumber(selectedFicheInspection)}} />
    },
    {
      title: "Rapport d'Inspection des Cultures",
      content: <RapportInspectionCulture data={{...reportData, ficheNumber: generateFicheNumber(selectedFicheInspection)}} />
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inspection aux Champs</h1>
          <p className="text-gray-500 mt-1">Gestion des inspections sur le terrain</p>
        </div>

        <div className="mt-4 md:mt-0 flex gap-2">
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleNewWizardInspection}
          >
            Inspection Wizard
          </Button>

          <Button
            variant="outline"
            leftIcon={<FileSpreadsheet className="w-4 h-4" />}
          >
            Exporter
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques principales */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatsCard
          title="Total Inspections"
          value={stats.totalInspections}
          icon={<BarChart3 className="w-6 h-6 text-primary-600" />}
          trend="up"
          trendValue="+15% ce mois"
        />

        <StatsCard
          title="Inspections Complétées"
          value={stats.completedInspections}
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          trend="up"
          trendValue={`${Math.round((stats.completedInspections / stats.totalInspections) * 100)}% du total`}
        />

        <StatsCard
          title="En Attente"
          value={stats.pendingInspections + stats.inProgressInspections}
          icon={<Clock className="w-6 h-6 text-yellow-600" />}
          trend={stats.pendingInspections > 0 ? 'up' : 'neutral'}
          trendValue={`${stats.pendingInspections} en attente, ${stats.inProgressInspections} en cours`}
        />
      </motion.div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Rechercher une inspection..."
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
            <option value="pending">En attente</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Complétées</option>
            <option value="rejected">Rejetées</option>
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
          </select>
        </div>
      </div>

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
        className="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° du Champ
                </th>
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
                  Année
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Superficie (ha)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rendement (t/ha)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dose Semis
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Production Attendue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classe Semence (Déclaration)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Densité 2
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Champs Agréés 2
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observations
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom Inspecteur
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Inspection
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de Formulaire
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
              {filteredInspections.map((inspection) => (
                <tr key={inspection.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {/* Affichage du N° du champ synchronisé */}
                      {inspection.forms?.wizard?.cropDeclaration?.fieldNumber ||
                        inspection.forms?.comprehensive?.fieldNumber ||
                        (inspection.fieldNumbers && inspection.fieldNumbers.length > 0 ? inspection.fieldNumbers.join(', ') : '-')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {inspection.forms?.comprehensive?.requestNumberAgri ||
                        inspection.forms?.wizard?.farmerId ||
                        inspection.requestNumberAgri || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.typeEntite || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.nomEntite || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.localisation?.localite || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.localisation?.secteur || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.localisation?.territoire || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.localisation?.district || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.localisation?.province || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.annee || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.superficieExploite ?? '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.rendement ?? '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.forms?.wizard?.fieldNotation?.doseSemis ?? '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.forms?.wizard?.fieldNotation?.productionAttendue ?? '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.forms?.wizard?.cropDeclaration?.classeSemence ?? '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.forms?.wizard?.inspectionReport?.densite2 ?? '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.forms?.wizard?.inspectionReport?.nombreChampsAgrees2 ?? '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.forms?.wizard?.inspectionReport?.observations ?? '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.forms?.wizard?.inspectionReport?.nomInspecteur ?? '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{inspection.forms?.wizard?.inspectionReport?.dateInspection ? new Date(inspection.forms.wizard.inspectionReport.dateInspection).toLocaleDateString() : '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      inspection.forms?.wizard
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {inspection.forms?.wizard ? 'Wizard' : 'Complet'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(inspection.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditInspection(inspection)}
                    >
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleViewFiche(inspection)}
                    >
                      Voir Fiche
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal pour formulaire complet */}
      <Modal
        isOpen={isComprehensiveFormOpen}
        onClose={() => {
          setIsComprehensiveFormOpen(false);
          setSelectedInspection(null);
          setEditingMode(null);
        }}
        title=""
        size="full"
      >
        <ComprehensiveInspectionForm
          onSubmit={handleComprehensiveFormSubmit}
          isLoading={false}
          onClose={() => {
            setIsComprehensiveFormOpen(false);
            setSelectedInspection(null);
            setEditingMode(null);
          }}
          initialData={selectedInspection?.forms?.comprehensive ? { ...selectedInspection.forms.comprehensive } : undefined}
        />
      </Modal>

      {/* Modal pour formulaire wizard */}
      <Modal
        isOpen={isWizardFormOpen}
        onClose={() => {
          setIsWizardFormOpen(false);
          setSelectedInspection(null);
          setEditingMode(null);
        }}
        title=""
        size="full"
      >
        <WizardInspectionForm
          onSubmit={handleWizardFormSubmit}
          isLoading={false}
          onClose={() => {
            setIsWizardFormOpen(false);
            setSelectedInspection(null);
            setEditingMode(null);
          }}
          initialData={selectedInspection?.forms?.wizard ? { ...selectedInspection.forms.wizard } : undefined}
        />
      </Modal>

      {showFicheModal && (
        <Modal
          isOpen={showFicheModal}
          onClose={() => setShowFicheModal(false)}
          title={slides[currentSlide].title}
          size="xl"
          className="bg-white rounded-xl shadow-2xl"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Button
                onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                disabled={currentSlide === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
              </Button>
              <div className="flex items-center space-x-2">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    className={`h-2 w-8 rounded-full ${currentSlide === index ? 'bg-primary-600' : 'bg-gray-300'}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
              <Button
                onClick={() => setCurrentSlide(prev => Math.min(2, prev + 1))}
                disabled={currentSlide === 2}
              >
                Suivant <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="flex justify-end mb-2">
              <Button variant="outline" onClick={handlePrintFiche}>Imprimer</Button>
            </div>
            <div className="mt-4 p-4 border rounded-lg bg-gray-50 min-h-[60vh] overflow-y-auto" ref={fichePrintRef}>
              {slides[currentSlide].content}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FieldInspectionPage;