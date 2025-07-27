import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, Beaker, MapPin, Sprout, BarChart3, Award, Calendar, User, Package, Calculator } from 'lucide-react';
import Button from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';



export interface LabAnalysisFormData {
  referenceNumber: string;
  receptionDate: string;
  sampleWeight: string;
  batchWeight: string;

  // Nouveaux champs pour l'emballage
  packagingType: 'box' | 'bag' | '';
  packagingWeight: string;
  packagingUnit: string;

  cropType: string;
  species: string;
  variety: string;
  scientificName: string;
  sampler: string;
  samplingDate: string;
  analysisStartDate: string;
  analysisEndDate: string;
  productionYear: string;
  productionSeason: string;
  structure: string;
  province: string;
  territory: string;
  site: string;
  teContent: string;
  pureSeed: string;
  inertMatter: string;
  otherSeeds: string;
  thousandGrainWeight: string;
  normalSeedlings: string;
  abnormalSeedlings: string;
  hardSeeds: string;
  freshSeeds: string;
  deadSeeds: string;
  classification: string;
  status: 'pending' | 'completed' | 'failed';

  // Champs calculés (non modifiables par l'utilisateur)
  calculatedPackaging?: string;
  packagingCalculation?: string; // Ajouté pour correspondre à l'utilisation dans handleFormSubmit
}

interface AddLabAnalysisFormProps {
  onSubmit: (data: LabAnalysisFormData) => void;
  isLoading: boolean;
  onClose: () => void;
  initialData?: Partial<LabAnalysisFormData>;
  isEditing?: boolean;
  allAnalyses: any[]; // Add this prop to pass all existing analyses
}

// Définition du tableau des provinces (était manquant et a été ajouté)
const provinces = [
  "Kinshasa", "Kongo-Central", "Kwango", "Kwilu", "Mai-Ndombe", "Kasaï",
  "Kasaï Central", "Kasaï Oriental", "Lomami", "Sankuru", "Maniema",
  "Nord-Kivu", "Sud-Kivu", "Ituri", "Haut-Uele", "Tshopo", "Bas-Uele",
  "Nord-Ubangi", "Mongala", "Sud-Ubangi", "Équateur", "Tshuapa",
  "Haut-Lomami", "Lualaba", "Haut-Katanga", "Tanganyika"
];


const AddLabAnalysisForm: React.FC<AddLabAnalysisFormProps> = ({
  onSubmit,
  isLoading,
  onClose,
  initialData,
  isEditing,
  allAnalyses // Destructure the new prop
}) => {
  const { user } = useAuthStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<LabAnalysisFormData>({
    defaultValues: initialData
  });

  const slides = [
    {
      title: "Informations de référence",
      subtitle: "Numéros de référence et poids des échantillons",
      icon: FileText,
      color: "from-blue-500 to-indigo-600",
      fields: [
        { name: "referenceNumber", label: "N° de Référence", type: "text", required: false, disabled: true },
        { name: "receptionDate", label: "Date de Réception", type: "date", required: false },
        { name: "sampleWeight", label: "Poids de l'Échantillon (g)", type: "text", required: false },
        { name: "batchWeight", label: "Poids du Lot (kg)", type: "text", required: false }
      ]
    },
    {
      title: "Calcul d'emballage",
      subtitle: "Configuration automatique des unités d'emballage",
      icon: Package,
      color: "from-purple-500 to-pink-600",
      fields: [
        { name: "packagingType", label: "Type d'emballage", type: "select", options: [
          { value: "", label: "Sélectionner..." },
          { value: "box", label: "Boîtes" },
          { value: "bag", label: "Sacs" }
        ], required: false },
        { name: "packagingWeight", label: "Poids unitaire", type: "text", required: false },
        { name: "packagingUnit", label: "Unité", type: "select", options: [
          { value: "", label: "Sélectionner..." },
          { value: "g", label: "grammes (g)" },
          { value: "kg", label: "kilogrammes (kg)" }
        ], required: false }
      ]
    },
    {
      title: "Informations sur la culture",
      subtitle: "Détails botaniques et variétaux",
      icon: Sprout,
      color: "from-green-500 to-emerald-600",
      fields: [
        { name: "cropType", label: "Type de Culture", type: "text", required: false },
        { name: "species", label: "Espèce", type: "text", required: false },
        { name: "variety", label: "Variété", type: "text", required: false },
        { name: "scientificName", label: "Nom Scientifique", type: "text", required: false }
      ]
    },
    {
      title: "Échantillonnage",
      subtitle: "Informations sur la collecte et les dates",
      icon: User,
      color: "from-purple-500 to-pink-600",
      fields: [
        { name: "sampler", label: "Échantillonneur", type: "text", required: false },
        { name: "samplingDate", label: "Date d'Échantillonnage", type: "date", required: false },
        { name: "analysisStartDate", label: "Début d'Analyse", type: "date", required: false },
        { name: "analysisEndDate", label: "Fin d'Analyse", type: "date" }
      ]
    },
    {
      title: "Production",
      subtitle: "Année, saison et structure de production",
      icon: Calendar,
      color: "from-orange-500 to-red-600",
      fields: [
        { name: "productionYear", label: "Année de Production", type: "text", required: false },
        { name: "productionSeason", label: "Saison de Production", type: "select", options: ["A", "B", "C"], required: false },
        { name: "structure", label: "Structure", type: "text", required: false }
      ]
    },
    {
      title: "Localisation",
      subtitle: "Informations géographiques",
      icon: MapPin,
      color: "from-teal-500 to-cyan-600",
      fields: [
        { name: "province", label: "Province", type: "select", required: false, options: provinces.map(p => ({ value: p, label: p })), disabled: user?.role === 'provincial_admin' },
        { name: "territory", label: "Territoire", type: "text", required: false },
        { name: "site", label: "Site", type: "text", required: false }
      ]
    },
    {
      title: "Analyse de pureté",
      subtitle: "Résultats de pureté des semences",
      icon: Beaker,
      color: "from-indigo-500 to-purple-600",
      fields: [
        { name: "teContent", label: "Teneur en (TE) %", type: "text", required: false },
        { name: "pureSeed", label: "Semence Pure %", type: "text", required: false },
        { name: "inertMatter", label: "Matières Inertes %", type: "text", required: false },
        { name: "otherSeeds", label: "Autres Semences %", type: "text", required: false }
      ]
    },
    {
      title: "Caractéristiques",
      subtitle: "Poids et résultats de germination",
      icon: BarChart3,
      color: "from-pink-500 to-rose-600",
      fields: [
        { name: "thousandGrainWeight", label: "Poids de 1000 graines (g)", type: "text", required: false },
        { name: "normalSeedlings", label: "Plantules Normales %", type: "text", required: false },
        { name: "abnormalSeedlings", label: "Plantules Anormales %", type: "text", required: false },
        { name: "hardSeeds", label: "Graines Dures %", type: "text", required: false },
        { name: "freshSeeds", label: "Graines Fraîches %", type: "text", required: false },
        { name: "deadSeeds", label: "Semences Mortes %", type: "text", required: false, highlight: true }
      ]
    },
    {
      title: "Classification",
      subtitle: "Classification finale de l'analyse",
      icon: Award,
      color: "from-yellow-500 to-orange-600",
      fields: [
        { name: "classification", label: "Classification", type: "text", required: false }
      ]
    }
  ];

  // Watch reception date and generate reference number when it changes
  const receptionDate = watch('receptionDate');

  useEffect(() => {
    if (receptionDate && !isEditing) { // Only generate for new analyses
      const date = new Date(receptionDate);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString().slice(-2);
      const day = date.getDate().toString().padStart(2, '0');

      // Filter analyses for the current month and year
      const analysesForMonth = allAnalyses.filter(analysis => {
        const analysisDate = new Date(analysis.receptionDate);
        return analysisDate.getMonth() + 1 === date.getMonth() + 1 &&
               analysisDate.getFullYear() === date.getFullYear();
      });

      // Determine the next sequential number for the month
      const nextNumber = analysesForMonth.length > 0
        ? Math.max(...analysesForMonth.map(a => parseInt(a.referenceNumber.slice(6, 9)))) + 1
        : 1;

      const newReferenceNumber = `SNS${month}${year}${String(nextNumber).padStart(3, '0')}`;
      setValue('referenceNumber', newReferenceNumber);
    }
  }, [receptionDate, isEditing, setValue, allAnalyses]);

  useEffect(() => {
    if (user?.role === 'provincial_admin' && user.province) {
      setValue('province', user.province);
    }
  }, [user, setValue]);

  // Watch des champs nécessaires pour le calcul automatique
  const batchWeight = watch('batchWeight');
  const packagingType = watch('packagingType');
  const packagingWeight = watch('packagingWeight');
  const packagingUnit = watch('packagingUnit');

  // État pour stocker le résultat du calcul
  const [calculatedPackaging, setCalculatedPackaging] = useState<string>('');

  // Fonction de calcul automatique des emballages
  const calculatePackaging = () => {
    if (!batchWeight || !packagingType || !packagingWeight || !packagingUnit) {
      setCalculatedPackaging('');
      return;
    }

    const lotWeightKg = parseFloat(batchWeight);
    const unitWeight = parseFloat(packagingWeight);

    if (isNaN(lotWeightKg) || isNaN(unitWeight) || unitWeight <= 0) {
      setCalculatedPackaging('');
      return;
    }

    let numberOfUnits = 0;
    let unitTypeLabel = '';
    let weightLabel = '';

    if (packagingType === 'box') {
      // Pour les boîtes: (Poids lot en kg × 1000) ÷ poids boîte en grammes
      if (packagingUnit === 'g') {
        numberOfUnits = Math.floor((lotWeightKg * 1000) / unitWeight);
        weightLabel = `${unitWeight} g`;
      } else if (packagingUnit === 'kg') {
        numberOfUnits = Math.floor(lotWeightKg / unitWeight);
        weightLabel = `${unitWeight} kg`;
      }
      unitTypeLabel = numberOfUnits > 1 ? 'boîtes' : 'boîte';
    } else if (packagingType === 'bag') {
      // Pour les sacs: Poids lot en kg ÷ poids sac
      if (packagingUnit === 'kg') {
        numberOfUnits = Math.floor(lotWeightKg / unitWeight);
        weightLabel = `${unitWeight} kg`;
      } else if (packagingUnit === 'g') {
        numberOfUnits = Math.floor((lotWeightKg * 1000) / unitWeight);
        weightLabel = `${unitWeight} g`;
      }
      unitTypeLabel = numberOfUnits > 1 ? 'sacs' : 'sac';
    }

    if (numberOfUnits > 0) {
      const result = `${numberOfUnits} ${unitTypeLabel} de ${weightLabel}`;
      setCalculatedPackaging(result);
    } else {
      setCalculatedPackaging('');
    }
  };

  // Effet pour recalculer automatiquement quand les valeurs changent
  useEffect(() => {
    calculatePackaging();
  }, [batchWeight, packagingType, packagingWeight, packagingUnit]);

  // Charger les données initiales
  React.useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as keyof LabAnalysisFormData, value);
      });
    }
  }, [initialData, setValue]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  const paginate = (newDirection: number) => {
    if (currentSlide + newDirection >= 0 && currentSlide + newDirection < slides.length) {
      setCurrentSlide(currentSlide + newDirection);
    }
  };

  const handleFormSubmit = (data: LabAnalysisFormData) => {
    console.log('Form data being submitted:', data);

    // Ajouter le calcul d'emballage aux données
    const formDataWithPackaging = {
      ...data,
      calculatedPackaging: calculatedPackaging,
      // Assurer que le calcul d'emballage est bien transmis pour le bulletin
      packagingCalculation: calculatedPackaging || 'Non calculé',
      // Déterminer le statut basé sur la présence de données
      status: Object.values(data).some(value =>
        value && value.toString().trim() !== ''
      ) ? 'completed' as const : 'pending' as const
    };

    console.log('Final form data with packaging calculation:', formDataWithPackaging);
    console.log('Packaging calculation result:', calculatedPackaging);
    onSubmit(formDataWithPackaging);
  };

  const renderField = (field: any) => {
    const fieldError = errors[field.name as keyof LabAnalysisFormData];

    return (
      <motion.div
        key={field.name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`space-y-2 ${field.highlight ? 'ring-2 ring-red-200 rounded-lg p-4 bg-red-50' : ''}`}
      >
        <label className={`block text-sm font-semibold ${field.highlight ? 'text-red-700' : 'text-gray-700'}`}>
          {field.label}
          {field.highlight && <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Important</span>}
        </label>

        {field.type === 'select' ? (
          <select
            {...register(field.name as keyof LabAnalysisFormData, { required: field.required })}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
              fieldError
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                : field.highlight
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
            } bg-white shadow-sm hover:shadow-md`}
          >
            {field.name === 'province' ? (
              <>
                <option value="">Sélectionner...</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </>
            ) : field.options ? (
              Array.isArray(field.options) ? (
                field.options.map((option: string | { value: string; label: string }) => (
                  typeof option === 'string' ? (
                    <option key={option} value={option}>{option}</option>
                  ) : (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  )
                ))
              ) : (
                field.options.map((option: { value: string; label: string }) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))
              )
            ) : null}
          </select>
        ) : (
          <input
            type={field.type}
            {...register(field.name as keyof LabAnalysisFormData, { required: field.required })}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
              fieldError
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                : field.highlight
                  ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
            } bg-white shadow-sm hover:shadow-md placeholder-gray-400`}
            placeholder={`Saisissez ${field.label.toLowerCase()}...`}
          />
        )}

        {/* Affichage automatique de "Kg" pour le poids du lot */}
        {field.name === 'batchWeight' && (
          <div className="text-sm text-gray-500 mt-1">
            Le poids sera automatiquement affiché avec "Kg" dans les rapports
          </div>
        )}

        {fieldError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm font-medium"
          >
            Ce champ est requis
          </motion.p>
        )}
      </motion.div>
    );
  };

  // Rendu spécial pour la slide de calcul d'emballage
  const renderPackagingSlide = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides[1].fields.map(renderField)}
      </div>

      {/* Zone de calcul automatique */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Calculator className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-800">Calcul Automatique</h3>
        </div>

        {calculatedPackaging ? (
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-2">Résultat du calcul d'emballage :</p>
            <p className="text-xl font-bold text-blue-800">{calculatedPackaging}</p>
            <p className="text-xs text-gray-500 mt-2">
              Ce résultat sera automatiquement inclus dans le bulletin d'analyse
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-center">
              Remplissez tous les champs ci-dessus pour voir le calcul automatique
            </p>
            <div className="mt-3 text-sm text-gray-500">
              <p><strong>Formules utilisées :</strong></p>
              <p>• Boîtes : (Poids lot × 1000) ÷ poids unitaire = nombre de boîtes</p>
              <p>• Sacs : Poids lot ÷ poids unitaire = nombre de sacs</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      {/* Header avec progression élégante */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-xl bg-gradient-to-r ${currentSlideData.color} text-white shadow-lg`}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{currentSlideData.title}</h2>
              <p className="text-gray-600 text-lg">{currentSlideData.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Barre de progression moderne */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
              Étape {currentSlide + 1} sur {slides.length}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              {Math.round(((currentSlide + 1) / slides.length) * 100)}% complété
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <motion.div
              className={`h-3 rounded-full bg-gradient-to-r ${currentSlideData.color} shadow-sm`}
              initial={{ width: 0 }}
              animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Indicateurs de slides */}
        <div className="flex justify-center space-x-3 mt-4">
          {slides.map((slide, index) => {
            const SlideIcon = slide.icon;
            return (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  currentSlide === index
                    ? `bg-gradient-to-r ${slide.color} text-white shadow-lg scale-110`
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                }`}
              >
                <SlideIcon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu du formulaire */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-hidden">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 h-full flex flex-col">
            <div className="p-6 flex-1 overflow-y-auto">
              {currentSlide === 1 ? (
                renderPackagingSlide()
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentSlideData.fields.map(renderField)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation élégante */}
        <div className="flex items-center justify-between mt-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100 flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => paginate(-1)}
            disabled={currentSlide === 0}
            leftIcon={<ChevronLeft className="w-5 h-5" />}
            className="px-4 py-2"
          >
            Précédent
          </Button>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2"
            >
              Annuler
            </Button>

            {currentSlide < slides.length - 1 ? (
              <Button
                type="button"
                variant="primary"
                onClick={() => paginate(1)}
                rightIcon={<ChevronRight className="w-5 h-5" />}
                className="px-4 py-2"
              >
                Suivant
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="px-6 py-2"
              >
                {isEditing ? 'Mettre à jour' : 'Enregistrer l\'analyse'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddLabAnalysisForm;