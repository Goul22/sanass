import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  MapPin, 
  FileText, 
  Sprout, 
  Bug, 
  Save,
  CheckCircle,
  AlertCircle,
  Clock,
  Camera,
  Navigation
} from 'lucide-react';
import Button from '../ui/Button';
import AgriMultiplierSelector from './AgriMultiplierSelector';
import LocationPicker from './LocationPicker';
import PhotoCapture from './PhotoCapture';

interface WizardFormData {
  // Step 1: Farmer Selection
  farmerId: string;
  
  // Step 2: Location Details
  province: string;
  locality: string;
  sector: string;
  district: string;
  inspectionDate: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  
  // Step 3: Crop Declaration Form
  cropDeclaration: {
    referenceNumber: string;
    producerName: string;
    establishmentName: string;
    address: string;
    establishmentCode: string;
    professionalCategory: string;
    sector: string;
    fieldNumber: string; // Ce champ sera synchronisé
    species: string;
    variety: string;
    category: string;
    generation: string;
    origin: string;
    receptionDate: string;
    productionYear: string;
    productionSeason: string;
    lotIdentification: string;
    quantityUsed: string;
    waterContent: string;
    germinativePower: string;
    fieldLocation: string;
    previousCrop: string;
    declaredSurface: string;
    isolationDistance: string;
    spacing: string;
    density: string;
    sowingPeriod: string;
    harvestPeriod: string;
    expectedProduction: string;
    phytosanitaryTreatment: string;
    gpsData: string;
    soilAmendments: string;
  };
  
  // Step 4: Field Notation Sheet
  fieldNotation: {
    province: string;
    producerName: string;
    siteLocation: string;
    controlledParcelNumber: string; // Synchronisé avec fieldNumber
    cultureDeclarationNumber: string;
    declarationEstablishedBy: string;
    inspectionDate: string;
    species: string;
    variety: string;
    sowingPeriod: string;
    declaredSurface: string;
    plantDensity: string;
    vegetationState: string;
    motherSeedOrigin: string;
    motherSeedCategory: string;
    harvestPeriod: string;
    harvestDate: string;
    previousCrop: string;
    isolation: string;
    growthStage: string;
    generalCultureState: string;
    phytosanitaryAction: string;
    weeds: string;
    otherCrops: string;
    doseSemis: string;
    productionAttendue: string;
    adventitiousPlants: string;
    diseases: string;
    observations: string;
  };
  
  // Step 5: Crop Inspection Report
  inspectionReport: {
    referenceNumber: string;
    type: string;
    name: string;
    code: string;
    sector: string;
    address: string;
    location: string;
    reliefType: string;
    otherFieldsPresence: boolean;
    waterCoursePresence: boolean;
    fieldCount: number;
    vegetationType: string;
    speciesCount: number;
    climateType: string;
    visitedFields: number;
    visitType: string;
    approvedFields: number;
    refusedFields: number;
    inspectorName: string;
    observations: string;
    fieldNumber: string; // Synchronisé avec fieldNumber
    density: string;
    sowingPeriod: string;
    expectedProduction: string;
    previousCrop: string;
    soilAmendments: string;
  };
  
  // Photos
  photos: string[];
}

interface WizardInspectionFormProps {
  onSubmit: (data: WizardFormData) => void;
  isLoading: boolean;
  onClose: () => void;
  initialData?: Partial<WizardFormData>;
}

const steps = [
  {
    id: 'farmer-selection',
    title: "Sélection de l'Agriculteur",
    subtitle: "Choisissez l'Agri-Multiplicateur",
    icon: User,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'location-details',
    title: "Détails de Localisation",
    subtitle: "Informations géographiques",
    icon: MapPin,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'crop-declaration',
    title: "Formulaire de Déclaration de Culture",
    subtitle: "Déclaration détaillée de la culture",
    icon: FileText,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'field-notation',
    title: "Fiche de Notation au Champ",
    subtitle: "Observations sur le terrain",
    icon: Sprout,
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'inspection-report',
    title: "Rapport d'Inspection des Cultures",
    subtitle: "Rapport final d'inspection",
    icon: Bug,
    color: 'from-pink-500 to-rose-600'
  }
];

const WizardInspectionForm: React.FC<WizardInspectionFormProps> = ({
  onSubmit,
  isLoading,
  onClose,
  initialData
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const { register, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm<WizardFormData>({
    defaultValues: initialData
  });

  // Watch for field number changes to sync across forms
  const fieldNumber = watch('cropDeclaration.fieldNumber');

  // Sync field number across all forms when it changes
  useEffect(() => {
    if (fieldNumber) {
      setValue('fieldNotation.controlledParcelNumber', fieldNumber);
      setValue('inspectionReport.fieldNumber', fieldNumber);
    }
  }, [fieldNumber, setValue]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const interval = setInterval(async () => {
      if (isSaving) return;
      
      setIsSaving(true);
      try {
        // Simulate auto-save
        await new Promise(resolve => setTimeout(resolve, 500));
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [autoSaveEnabled, isSaving]);

  const handleLocationSelect = (latitude: number, longitude: number) => {
    setValue('location', { latitude, longitude });
  };

  const handlePhotoCapture = (photoUrl: string) => {
    const newPhotos = [...photos, photoUrl];
    setPhotos(newPhotos);
    setValue('photos', newPhotos);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderFarmerSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Sélection de l'Agri-Multiplicateur</h3>
        <p className="text-gray-600">Choisissez l'Agri-Multiplicateur pour cette inspection</p>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Agri-Multiplicateur <span className="text-red-500">*</span>
        </label>
        <AgriMultiplierSelector
          value={watch('farmerId') || ''}
          onChange={(value) => setValue('farmerId', value)}
          required
        />
        {errors.farmerId && (
          <p className="mt-1 text-sm text-red-600">{errors.farmerId.message}</p>
        )}
      </div>
    </div>
  );

  const renderLocationDetails = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Détails de Localisation</h3>
        <p className="text-gray-600">Informations géographiques de l'inspection</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Localisation Administrative</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Province <span className="text-red-500">*</span>
              </label>
              <select
                {...register('province', { required: 'Ce champ est requis' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une province...</option>
                <option value="Kinshasa">Kinshasa</option>
                <option value="Nord-Kivu">Nord-Kivu</option>
                <option value="Sud-Kivu">Sud-Kivu</option>
                <option value="Kongo-Central">Kongo-Central</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Localité <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('locality', { required: 'Ce champ est requis' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom de la localité"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secteur
              </label>
              <input
                type="text"
                {...register('sector')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom du secteur"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District
              </label>
              <input
                type="text"
                {...register('district')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom du district"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d'inspection <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('inspectionDate', { required: 'Ce champ est requis' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Géolocalisation</h4>
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            currentLocation={watch('location')}
          />
        </div>
      </div>
    </div>
  );

  const renderCropDeclaration = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Formulaire de Déclaration de Culture</h3>
        <p className="text-gray-600">N° {watch('cropDeclaration.referenceNumber') || '......../COORDPROV/...... /SENASEM/AGRI/20...'}</p>
      </div>

      {/* IDENTIFICATION DU PRODUCTEUR DE SEMENCES */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h4 className="font-medium text-gray-900">IDENTIFICATION DU PRODUCTEUR DE SEMENCES</h4>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom et Post-nom</label>
            <input
              type="text"
              {...register('cropDeclaration.producerName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'Établissement</label>
            <input
              type="text"
              {...register('cropDeclaration.establishmentName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              {...register('cropDeclaration.address')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code de l'Établissement</label>
            <input
              type="text"
              {...register('cropDeclaration.establishmentCode')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie professionnelle</label>
            <input
              type="text"
              {...register('cropDeclaration.professionalCategory')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secteur</label>
            <input
              type="text"
              {...register('cropDeclaration.sector')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* INFORMATION SUR LA SEMENCE-MÈRE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h4 className="font-medium text-gray-900">INFORMATION SUR LA SEMENCE-MÈRE</h4>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">1. Espèce</label>
            <input
              type="text"
              {...register('cropDeclaration.species')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">2. Variété</label>
            <input
              type="text"
              {...register('cropDeclaration.variety')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">3. Catégorie</label>
            <input
              type="text"
              {...register('cropDeclaration.category')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">4. Génération</label>
            <input
              type="text"
              {...register('cropDeclaration.generation')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">5. Origine</label>
            <input
              type="text"
              {...register('cropDeclaration.origin')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">6. Date de réception</label>
            <input
              type="date"
              {...register('cropDeclaration.receptionDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">7. Année de production</label>
            <input
              type="text"
              {...register('cropDeclaration.productionYear')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">8. Saison de production</label>
            <select
              {...register('cropDeclaration.productionSeason')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner...</option>
              <option value="A">Saison A</option>
              <option value="B">Saison B</option>
              <option value="C">Saison C</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">9. Identification du lot</label>
            <input
              type="text"
              {...register('cropDeclaration.lotIdentification')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">10. Quantité utilisée</label>
            <input
              type="text"
              {...register('cropDeclaration.quantityUsed')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">11. Teneur en eau</label>
            <input
              type="text"
              {...register('cropDeclaration.waterContent')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">12. Pouvoir Germinatif</label>
            <input
              type="text"
              {...register('cropDeclaration.germinativePower')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* INFORMATION SUR LA CULTURE DÉCLARÉE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h4 className="font-medium text-gray-900">INFORMATION SUR LA CULTURE DÉCLARÉE</h4>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">1. Localisation du champ</label>
            <input
              type="text"
              {...register('cropDeclaration.fieldLocation')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <label className="block text-sm font-medium text-blue-700 mb-1">
              2. N° du champ <span className="text-red-500">*</span>
              <span className="text-xs text-blue-600 block">Ce numéro sera synchronisé avec les autres formulaires</span>
            </label>
            <input
              type="text"
              {...register('cropDeclaration.fieldNumber', { required: 'Ce champ est requis' })}
              className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Ex: F001, CHAMP-A, etc."
            />
            {errors.cropDeclaration?.fieldNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.cropDeclaration.fieldNumber.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">3. Précédent cultural</label>
            <input
              type="text"
              {...register('cropDeclaration.previousCrop')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">4. Superficie déclarée</label>
            <input
              type="text"
              {...register('cropDeclaration.declaredSurface')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">5. Distance d'isolement</label>
            <input
              type="text"
              {...register('cropDeclaration.isolationDistance')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">6. Écartement</label>
            <input
              type="text"
              {...register('cropDeclaration.spacing')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">7. Densité</label>
            <input
              type="text"
              {...register('cropDeclaration.density')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">8. Période de semis</label>
            <input
              type="text"
              {...register('cropDeclaration.sowingPeriod')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">9. Période de récolte</label>
            <input
              type="text"
              {...register('cropDeclaration.harvestPeriod')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">10. Production attendue</label>
            <input
              type="text"
              {...register('cropDeclaration.expectedProduction')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">11. Traitement phytosanitaire</label>
            <input
              type="text"
              {...register('cropDeclaration.phytosanitaryTreatment')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">12. Données GPS</label>
            <input
              type="text"
              {...register('cropDeclaration.gpsData')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">13. Amendements du sol</label>
            <textarea
              {...register('cropDeclaration.soilAmendments')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderFieldNotation = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Fiche de Notation au Champ</h3>
        <p className="text-gray-600">N° ......../COORD......../SENASEM/AGRI/20...</p>
      </div>

      {/* IDENTIFICATION DU PRODUCTEUR */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h4 className="font-medium text-gray-900">IDENTIFICATION DU PRODUCTEUR</h4>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province de</label>
            <input
              type="text"
              {...register('fieldNotation.province')}
              value={watch('province')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom et adresse du producteur</label>
            <input
              type="text"
              {...register('fieldNotation.producerName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localisation du site d'exploitation</label>
            <input
              type="text"
              {...register('fieldNotation.siteLocation')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <label className="block text-sm font-medium text-green-700 mb-1">
              Numéro d'identification de la parcelle contrôlée
              <span className="text-xs text-green-600 block">Synchronisé automatiquement</span>
            </label>
            <input
              type="text"
              {...register('fieldNotation.controlledParcelNumber')}
              value={fieldNumber || ''}
              className="w-full px-3 py-2 border border-green-300 rounded-md bg-white"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de la déclaration de culture de la parcelle</label>
            <input
              type="text"
              {...register('fieldNotation.cultureDeclarationNumber')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">La déclaration des cultures établie par</label>
            <input
              type="text"
              {...register('fieldNotation.declarationEstablishedBy')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de l'inspection</label>
            <input
              type="date"
              {...register('fieldNotation.inspectionDate')}
              value={watch('inspectionDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* RENSEIGNEMENTS SUR LA PARCELLE CONTRÔLÉE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h4 className="font-medium text-gray-900">RENSEIGNEMENTS SUR LA PARCELLE CONTRÔLÉE</h4>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Espèce</label>
            <input
              type="text"
              {...register('fieldNotation.species')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Variété</label>
            <input
              type="text"
              {...register('fieldNotation.variety')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période de semis</label>
            <input
              type="text"
              {...register('fieldNotation.sowingPeriod')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Superficie déclarée (ha)</label>
            <input
              type="text"
              {...register('fieldNotation.declaredSurface')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Densité de plantes</label>
            <input
              type="text"
              {...register('fieldNotation.plantDensity')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">État de la végétation</label>
            <input
              type="text"
              {...register('fieldNotation.vegetationState')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origine de la semence-mère</label>
            <input
              type="text"
              {...register('fieldNotation.motherSeedOrigin')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dose de semis</label>
            <input
              type="text"
              {...register('fieldNotation.doseSemis')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Production attendue (Kg)</label>
            <input
              type="text"
              {...register('fieldNotation.productionAttendue')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origine de la semence-mère</label>
            <input
              type="text"
              {...register('fieldNotation.motherSeedOrigin')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie de la semence-mère</label>
            <input
              type="text"
              {...register('fieldNotation.motherSeedCategory')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période de récolte</label>
            <input
              type="text"
              {...register('fieldNotation.harvestPeriod')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de récolte</label>
            <input
              type="date"
              {...register('fieldNotation.harvestDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Précédent cultural</label>
            <input
              type="text"
              {...register('fieldNotation.previousCrop')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* VÉRIFICATION AU CHAMP */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h4 className="font-medium text-gray-900">VÉRIFICATION AU CHAMP</h4>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Isolement (m)</label>
              <input
                type="text"
                {...register('fieldNotation.isolation')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stade de croissance et état général de la culture</label>
              <input
                type="text"
                {...register('fieldNotation.growthStage')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">État général de la culture</label>
            <textarea
              {...register('fieldNotation.generalCultureState')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action phytosanitaire</label>
            <textarea
              {...register('fieldNotation.phytosanitaryAction')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mauvaises herbes (les nommer et %)</label>
            <textarea
              {...register('fieldNotation.weeds')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plantes cultivées d'autres espèces (les nommer et %)</label>
            <textarea
              {...register('fieldNotation.otherCrops')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plantes adventices (les nommer et %)</label>
            <textarea
              {...register('fieldNotation.adventitiousPlants')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maladie(s) identifiée(s) et/ou suspectée(s) (préciser les symptômes)</label>
            <textarea
              {...register('fieldNotation.diseases')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Autres observations et remarques</label>
            <textarea
              {...register('fieldNotation.observations')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderInspectionReport = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Rapport d'Inspection des Cultures</h3>
        <p className="text-gray-600">N° ......../COORDPROV/...... /SENASEM/AGRI/20...</p>
      </div>

      {/* IDENTIFICATION DE L'EXPLOITATION SEMENCIÈRE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h4 className="font-medium text-gray-900">IDENTIFICATION DE L'EXPLOITATION SEMENCIÈRE</h4>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <input
              type="text"
              {...register('inspectionReport.type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secteur</label>
            <input
              type="text"
              {...register('inspectionReport.sector')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              {...register('inspectionReport.name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              {...register('inspectionReport.address')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input
              type="text"
              {...register('inspectionReport.code')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'inspecteur</label>
            <input
              type="text"
              {...register('inspectionReport.inspectorName')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
            <textarea
              {...register('inspectionReport.observations')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* RENSEIGNEMENTS SUR LE SITE D'EXPLOITATION */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h4 className="font-medium text-gray-900">RENSEIGNEMENTS SUR LE SITE D'EXPLOITATION</h4>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
            <input
              type="text"
              {...register('inspectionReport.location')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de champs agréés</label>
            <input
              type="number"
              {...register('inspectionReport.approvedFields')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de champs refusés</label>
            <input
              type="number"
              {...register('inspectionReport.refusedFields')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de champs</label>
            <input
              type="number"
              {...register('inspectionReport.fieldCount')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de relief</label>
            <input
              type="text"
              {...register('inspectionReport.reliefType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de végétation</label>
            <input
              type="text"
              {...register('inspectionReport.vegetationType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Présence d'autres champs</label>
            <select
              {...register('inspectionReport.otherFieldsPresence')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner...</option>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'espèces</label>
            <input
              type="number"
              {...register('inspectionReport.speciesCount')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Présence de cours d'eau</label>
            <select
              {...register('inspectionReport.waterCoursePresence')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner...</option>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de climat</label>
            <input
              type="text"
              {...register('inspectionReport.climateType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* DONNÉES DE L'INSPECTION */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h4 className="font-medium text-gray-900">DONNÉES DE L'INSPECTION</h4>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de champs visités</label>
            <input
              type="number"
              {...register('inspectionReport.visitedFields')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de visite</label>
            <input
              type="text"
              {...register('inspectionReport.visitType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de champs agréés</label>
            <input
              type="number"
              {...register('inspectionReport.approvedFields')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de champs refusés</label>
            <input
              type="number"
              {...register('inspectionReport.refusedFields')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
            <label className="block text-sm font-medium text-purple-700 mb-1">
              N° du champ
              <span className="text-xs text-purple-600 block">Synchronisé automatiquement</span>
            </label>
            <input
              type="text"
              {...register('inspectionReport.fieldNumber')}
              value={fieldNumber || ''}
              className="w-full px-3 py-2 border border-purple-300 rounded-md bg-white"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Densité</label>
            <input
              type="text"
              {...register('inspectionReport.density')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période de semis</label>
            <input
              type="text"
              {...register('inspectionReport.sowingPeriod')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Production attendue (Kg)</label>
            <input
              type="text"
              {...register('inspectionReport.expectedProduction')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Précédent cultural</label>
            <input
              type="text"
              {...register('inspectionReport.previousCrop')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amendements du sol</label>
            <input
              type="text"
              {...register('inspectionReport.soilAmendments')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="bg-gray-100 px-4 py-3 border-b">
          <h4 className="font-medium text-gray-900">Photos de l'Inspection</h4>
        </div>
        <div className="p-6">
          <PhotoCapture
            onCapture={handlePhotoCapture}
            currentPhotos={photos}
            maxPhotos={5}
          />
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderFarmerSelection();
      case 1: return renderLocationDetails();
      case 2: return renderCropDeclaration();
      case 3: return renderFieldNotation();
      case 4: return renderInspectionReport();
      default: return null;
    }
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData?.icon || FileText;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header avec progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${currentStepData?.color || 'from-blue-500 to-purple-600'} text-white`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{currentStepData?.title}</h2>
              <p className="text-gray-600">{currentStepData?.subtitle}</p>
            </div>
          </div>
          
          {/* Auto-save indicator */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoSave"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="autoSave" className="text-sm text-gray-600">
                Sauvegarde automatique
              </label>
            </div>
            
            {lastSaved && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Save className="w-4 h-4" />
                <span>Sauvegardé à {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
            
            {isSaving && (
              <div className="flex items-center space-x-1 text-sm text-blue-600">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Sauvegarde...</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Étape {currentStep + 1} sur {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% complété
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full bg-gradient-to-r ${currentStepData?.color || 'from-blue-500 to-purple-600'}`}
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`flex flex-col items-center space-y-2 p-2 rounded-lg transition-all ${
                  currentStep === index
                    ? 'bg-blue-50 text-blue-700'
                    : currentStep > index
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  currentStep === index
                    ? 'bg-blue-100'
                    : currentStep > index
                    ? 'bg-green-100'
                    : 'bg-gray-100'
                }`}>
                  {currentStep > index ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs font-medium text-center max-w-20">
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu du step */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Précédent
          </Button>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSubmit((data) => {
                // Handle save draft logic here
                console.log('Draft saved:', data);
                setIsSaving(true);
                setTimeout(() => {
                  setLastSaved(new Date());
                  setIsSaving(false);
                }, 500);
              })}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Enregistrer le brouillon
            </Button>

            {currentStep < steps.length - 1 && (
              <Button
                type="button"
                variant="primary"
                onClick={nextStep}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Suivant
              </Button>
            )}

            {currentStep === steps.length - 1 && (
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                rightIcon={isLoading ? <Clock className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              >
                {isLoading ? 'Envoi...' : 'Terminer l\'inspection'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default WizardInspectionForm;