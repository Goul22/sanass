import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { ChevronLeft, ChevronRight, User, MapPin, Sprout, Building2, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

interface AgriMultiplierFormData {
  requestNumber: string;
  // Information sur le candidat
  entityType: 'individual' | 'cooperative' | 'company';
  entityName: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  locality: string;
  sector: string;
  territory: string;
  district: string;
  province: string;
  
  // Critères d'éligibilité
  siteInfo: {
    hasLocation: boolean;
    location: string;
    surfaceArea: number;
    isAccessible: boolean;
  };
  
  technicalAspects: {
    hasTechnicalStaff: boolean;
    respectsRegulations: boolean;
    hasNationalCatalog: boolean;
  };
  
  funding: {
    source: 'own' | 'credit' | 'other';
    details?: string;
  };
  
  // Critères additionnels
  technicalCriteria: {
    hasSeedTechnology: boolean;
    hasConditioningFacilities: boolean;
  };
  
  agriculturalExperience: {
    crops: {
      vegetable: boolean;
      perennial: boolean;
      vineyard: boolean;
    };
  };
  
  operationManagement: {
    hasOperationPlan: boolean;
    hasStorageFacilities: boolean;
  };
}

interface AddAgriMultiplierFormProps {
  onSubmit: (data: AgriMultiplierFormData) => void;
  isLoading: boolean;
  onClose: () => void;
}

const slides = [
  {
    title: "Informations du Candidat",
    subtitle: "Renseignements sur l'entité candidate",
    icon: User,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    title: "Localisation",
    subtitle: "Détails géographiques du site",
    icon: MapPin,
    color: 'from-green-500 to-emerald-600'
  },
  {
    title: "Critères d'Éligibilité",
    subtitle: "Vérification des conditions requises",
    icon: Building2,
    color: 'from-purple-500 to-pink-600'
  },
  {
    title: "Expérience Agricole",
    subtitle: "Historique et compétences techniques",
    icon: Sprout,
    color: 'from-orange-500 to-red-600'
  },
  {
    title: "Gestion & Financement",
    subtitle: "Modalités de financement et gestion",
    icon: CreditCard,
    color: 'from-teal-500 to-cyan-600'
  }
];

const AddAgriMultiplierForm: React.FC<AddAgriMultiplierFormProps> = ({
  onSubmit,
  isLoading,
  onClose
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AgriMultiplierFormData>();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'provincial_admin' && user?.province) {
      setValue('province', user.province);
    }
  }, [user, setValue]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    if (currentSlide + newDirection >= 0 && currentSlide + newDirection < slides.length) {
      setCurrentSlide(currentSlide + newDirection);
    }
  };

  const renderCandidateInfo = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <label className="block text-sm font-semibold text-blue-800 mb-3 flex items-center">
          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
          N° de Demande d'Agrément
        </label>
        <input
          type="text"
          {...register('requestNumber', { required: 'Ce champ est requis' })}
          className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm hover:shadow-md placeholder-gray-400"
          placeholder="SENASEM/AGRI/2024/..."
        />
        {errors.requestNumber && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600 flex items-center"
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.requestNumber.message}
          </motion.p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
          Type d'Entité
        </label>
        <select
          {...register('entityType', { required: 'Ce champ est requis' })}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
        >
          <option value="">Sélectionner...</option>
          <option value="individual">Individuel</option>
          <option value="cooperative">Coopérative</option>
          <option value="company">Entreprise</option>
        </select>
        {errors.entityType && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600 flex items-center"
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.entityType.message}
          </motion.p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
            Nom de l'Entité
          </label>
          <input
            type="text"
            {...register('entityName', { required: 'Ce champ est requis' })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm hover:shadow-md placeholder-gray-400"
            placeholder={
              watch('entityType') === 'individual' 
                ? "Nom complet" 
                : watch('entityType') === 'cooperative' 
                ? "Nom de la coopérative"
                : "Nom de l'entreprise"
            }
          />
          {errors.entityName && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.entityName.message}
            </motion.p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
            {watch('entityType') === 'individual' ? "Nom du responsable" : "Nom du représentant"}
          </label>
          <input
            type="text"
            {...register('name', { required: 'Ce champ est requis' })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm hover:shadow-md placeholder-gray-400"
            placeholder="Nom du responsable"
          />
          {errors.name && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.name.message}
            </motion.p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
          Adresse
        </label>
        <input
          type="text"
          {...register('address', { required: 'Ce champ est requis' })}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm hover:shadow-md placeholder-gray-400"
          placeholder="Adresse complète"
        />
        {errors.address && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600 flex items-center"
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.address.message}
          </motion.p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
            Téléphone
          </label>
          <input
            type="tel"
            {...register('phone', { required: 'Ce champ est requis' })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm hover:shadow-md placeholder-gray-400"
            placeholder="+243 XXX XXX XXX"
          />
          {errors.phone && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.phone.message}
            </motion.p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
            Email
          </label>
          <input
            type="email"
            {...register('email', { required: 'Ce champ est requis' })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm hover:shadow-md placeholder-gray-400"
            placeholder="exemple@email.com"
          />
          {errors.email && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.email.message}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Localisation Géographique</h3>
        <p className="text-gray-600">Précisez l'emplacement géographique de votre exploitation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
            Localité
          </label>
          <input
            type="text"
            {...register('locality', { required: 'Ce champ est requis' })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white shadow-sm hover:shadow-md placeholder-gray-400"
            placeholder="Nom de la localité"
          />
          {errors.locality && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.locality.message}
            </motion.p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
            Secteur
          </label>
          <input
            type="text"
            {...register('sector', { required: 'Ce champ est requis' })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white shadow-sm hover:shadow-md placeholder-gray-400"
            placeholder="Nom du secteur"
          />
          {errors.sector && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.sector.message}
            </motion.p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
            Territoire
          </label>
          <input
            type="text"
            {...register('territory', { required: 'Ce champ est requis' })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white shadow-sm hover:shadow-md placeholder-gray-400"
            placeholder="Nom du territoire"
          />
          {errors.territory && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.territory.message}
            </motion.p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
            District
          </label>
          <input
            type="text"
            {...register('district', { required: 'Ce champ est requis' })}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white shadow-sm hover:shadow-md placeholder-gray-400"
            placeholder="Nom du district"
          />
          {errors.district && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.district.message}
            </motion.p>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
        <label className="block text-sm font-semibold text-green-800 mb-3 flex items-center">
           <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
           Province
         </label>
         <select
            {...register('province', { required: 'Ce champ est requis' })}
            disabled={user?.role === 'provincial_admin'}
            className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
          >
            <option value="">Sélectionner...</option>
            <option value="Kinshasa">Kinshasa</option>
            <option value="Kongo-Central">Kongo Central</option>
            <option value="Kwango">Kwango</option>
            <option value="Kwilu">Kwilu</option>
            <option value="Nord-Kivu">Nord-Kivu</option>
            <option value="Sud-Kivu">Sud-Kivu</option>
        </select>
        {errors.province && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600 flex items-center"
          >
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.province.message}
          </motion.p>
        )}
      </div>
    </div>
  );

  const renderEligibilityCriteria = () => (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Site sur terrain</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Propriété
            </label>
            <div className="mt-2 space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('siteInfo.hasLocation')}
                  value="true"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Oui</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  {...register('siteInfo.hasLocation')}
                  value="false"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Non</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Superficie disponible (ha)
            </label>
            <input
              type="number"
              {...register('siteInfo.surfaceArea')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Accessibilité du site
            </label>
            <div className="mt-2 space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('siteInfo.isAccessible')}
                  value="true"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Oui</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  {...register('siteInfo.isAccessible')}
                  value="false"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Non</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Aspect technique</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Personnel technique disponible
            </label>
            <div className="mt-2 space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('technicalAspects.hasTechnicalStaff')}
                  value="true"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Oui</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  {...register('technicalAspects.hasTechnicalStaff')}
                  value="false"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Non</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Engagement au respect de la législation et de la réglementation
            </label>
            <div className="mt-2 space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('technicalAspects.respectsRegulations')}
                  value="true"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Oui</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  {...register('technicalAspects.respectsRegulations')}
                  value="false"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Non</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAgriculturalExperience = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Expérience agricole</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Types de cultures déjà réalisés
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('agriculturalExperience.crops.vegetable')}
                  className="form-checkbox text-primary-600 rounded"
                />
                <span className="ml-2">Maraîcher</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('agriculturalExperience.crops.perennial')}
                  className="form-checkbox text-primary-600 rounded"
                />
                <span className="ml-2">Pérenne</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('agriculturalExperience.crops.vineyard')}
                  className="form-checkbox text-primary-600 rounded"
                />
                <span className="ml-2">Vivier</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Installations techniques</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Formation en technologie semencière déjà reçue
            </label>
            <div className="mt-2 space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('technicalCriteria.hasSeedTechnology')}
                  value="true"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Oui</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  {...register('technicalCriteria.hasSeedTechnology')}
                  value="false"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Non</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Installations de conditionnement ou contrat de sous-traitance
            </label>
            <div className="mt-2 space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('technicalCriteria.hasConditioningFacilities')}
                  value="true"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Oui</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  {...register('technicalCriteria.hasConditioningFacilities')}
                  value="false"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Non</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderManagementAndFunding = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Gestion de l'exploitation</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Compte d'exploitation prévisionnel
            </label>
            <div className="mt-2 space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('operationManagement.hasOperationPlan')}
                  value="true"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Oui</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  {...register('operationManagement.hasOperationPlan')}
                  value="false"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Non</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tenue des fiches de stock
            </label>
            <div className="mt-2 space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('operationManagement.hasStorageFacilities')}
                  value="true"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Oui</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  {...register('operationManagement.hasStorageFacilities')}
                  value="false"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Non</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Source de financement</h3>
        <div className="space-y-4">
          <div>
            <div className="mt-2 space-y-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('funding.source')}
                  value="own"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Fonds propres</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  {...register('funding.source')}
                  value="credit"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Crédit</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  {...register('funding.source')}
                  value="other"
                  className="form-radio text-primary-600"
                />
                <span className="ml-2">Autre</span>
              </label>
            </div>
          </div>

          {watch('funding.source') === 'other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Préciser
              </label>
              <input
                type="text"
                {...register('funding.details')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Mise à jour du header avec progression moderne
  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header moderne avec progression */}
      <div className="mb-8">
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

        {/* Barre de progression élégante */}
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

        {/* Indicateurs de slides modernes */}
        <div className="flex justify-center space-x-3 mt-6">
          {slides.map((slide, index) => {
            const SlideIcon = slide.icon;
            return (
              <button
                key={index}
                type="button"
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="relative overflow-hidden min-h-[500px]">
              <AnimatePresence initial={false} custom={currentSlide}>
                <motion.div
                  key={currentSlide}
                  custom={currentSlide}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);

                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                  className="absolute w-full"
                >
                  {currentSlide === 0 && renderCandidateInfo()}
                  {currentSlide === 1 && renderLocation()}
                  {currentSlide === 2 && renderEligibilityCriteria()}
                  {currentSlide === 3 && renderAgriculturalExperience()}
                  {currentSlide === 4 && renderManagementAndFunding()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Navigation élégante */}
        <div className="flex items-center justify-between bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => paginate(-1)}
            disabled={currentSlide === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            className="px-6 py-3"
          >
            Précédent
          </Button>
          
          <div className="flex items-center space-x-4">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentSlide === index 
                    ? 'bg-blue-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-3"
            >
              Annuler
            </Button>

            {currentSlide < slides.length - 1 ? (
              <Button
                type="button"
                variant="primary"
                onClick={() => paginate(1)}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                className="px-6 py-3"
              >
                Suivant
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                leftIcon={<CheckCircle className="w-4 h-4" />}
                className="px-8 py-3"
              >
                Soumettre la demande
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAgriMultiplierForm;