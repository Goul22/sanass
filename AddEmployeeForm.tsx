import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from "../../stores/authStore";
import {
  X, User, GraduationCap, Briefcase, Building, FileText, DollarSign,
  ArrowRight, ArrowLeft, Upload, Camera, ChevronLeft, ChevronRight,
  MapPin, Calendar, Phone, Mail, Home, Award, CreditCard, Shield, Users,
  CheckCircle, AlertCircle, Star, Badge
} from 'lucide-react';
import Button from '../ui/Button';

interface AddEmployeeFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  onClose: () => void;
}

const slides = [
  {
    id: 'personal',
    title: 'Informations Personnelles',
    subtitle: 'Données personnelles et contact',
    icon: User,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'education',
    title: 'Formation & Éducation',
    subtitle: 'Parcours académique et certifications',
    icon: GraduationCap,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'professional',
    title: 'Informations Professionnelles',
    subtitle: 'Poste et responsabilités',
    icon: Briefcase,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'assignment',
    title: 'Affectation & Arrêtés',
    subtitle: 'Commission et documents officiels',
    icon: Shield,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'payment',
    title: 'Rémunération',
    subtitle: 'Salaire et avantages',
    icon: DollarSign,
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 'transfer',
    title: 'Transferts & Promotions',
    subtitle: 'Historique des mouvements',
    icon: ArrowRight,
    color: 'from-indigo-500 to-indigo-600'
  }
];

export const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({
  onSubmit,
  isLoading,
  onClose,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Informations personnelles
    matricule: '',
    gradeCategory: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'male',
    birthDate: '',
    birthPlace: '',
    maritalStatus: 'single',
    numberOfChildren: 0,
    phone: '',
    email: '',
    address: '',
    profileImage: '',

    // Éducation
    education: {
      level: '',
      domain: '',
      graduationYear: '',
      institution: '',
      country: '',
      province: '',
      city: '',
      documentType: '',
      documentReference: '',
      documentDate: ''
    },

    // Professionnel
    department: '',
    position: '',
    hireDate: '',
    province: '',
    coordination: 'national',
    division: '',
    bureau: '',
    unit: '',

    // Affectation
    assignment: {
      hasAssignment: false,
      reference: '',
      date: ''
    },
    decree: {
      hasDecree: false,
      reference: '',
      date: ''
    },

    // Paiement
    payment: {
      baseSalary: false,
      bonus: false,
      registered: false,
      biometricCard: false,
      biometricCardNumber: ''
    },

    // Transfert
    transfer: {
      actType: '',
      previousAdministration: ''
    },
    promotion: {
      currentGrade: '',
      promotionReference: ''
    }
  });

  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'provincial_admin' && user?.province) {
      setFormData((prevData) => ({
        ...prevData,
        province: user.province,
      }));
    }
  }, [user]);

  // Corrected handleInputChange function
  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object), // Ensure it's an object before spreading
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const progress = ((currentSlide + 1) / slides.length) * 100;

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

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewImage(imageUrl);
        handleInputChange('profileImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Identité
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Matricule</label>
                <input
                  type="text"
                  value={formData.matricule}
                  onChange={(e) => handleInputChange('matricule', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie de Grade</label>
                <select
                  value={formData.gradeCategory}
                  onChange={(e) => handleInputChange('gradeCategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner...</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom de famille"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Prénom"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Post-nom</label>
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Post-nom"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            Photo de Profil
          </h3>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-dashed border-gray-300">
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <label
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-2" />
              Télécharger
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleProfileImageUpload}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Naissance
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lieu de naissance</label>
              <input
                type="text"
                value={formData.birthPlace}
                onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            État Civil
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="male">Masculin</option>
                <option value="female">Féminin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">État civil</label>
              <select
                value={formData.maritalStatus}
                onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="single">Célibataire</option>
                <option value="married">Marié(e)</option>
                <option value="divorced">Divorcé(e)</option>
                <option value="widowed">Veuf/Veuve</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'enfants</label>
              <input
                type="number"
                min="0"
                value={formData.numberOfChildren}
                onChange={(e) => handleInputChange('numberOfChildren', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-2xl border border-cyan-200">
          <h3 className="text-lg font-semibold text-cyan-800 mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            Contact
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Formation Académique
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Niveau d'études</label>
              <select
                value={formData.education.level}
                onChange={(e) => handleInputChange('education.level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Sélectionner...</option>
                <option value="Licence">Licence</option>
                <option value="Master">Master</option>
                <option value="Doctorat">Doctorat</option>
                <option value="Diplôme technique">Diplôme technique</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Domaine d'études</label>
              <input
                type="text"
                value={formData.education.domain}
                onChange={(e) => handleInputChange('education.domain', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Année d'obtention</label>
              <input
                type="text"
                value={formData.education.graduationYear}
                onChange={(e) => handleInputChange('education.graduationYear', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Institution
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'institution</label>
              <input
                type="text"
                value={formData.education.institution}
                onChange={(e) => handleInputChange('education.institution', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                <input
                  type="text"
                  value={formData.education.country}
                  onChange={(e) => handleInputChange('education.country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                <input
                  type="text"
                  value={formData.education.province}
                  onChange={(e) => handleInputChange('education.province', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                <input
                  type="text"
                  value={formData.education.city}
                  onChange={(e) => handleInputChange('education.city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Document de Formation
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de document</label>
            <select
              value={formData.education.documentType}
              onChange={(e) => handleInputChange('education.documentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Sélectionner...</option>
              <option value="Diplôme">Diplôme</option>
              <option value="Certificat">Certificat</option>
              <option value="Attestation">Attestation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Référence</label>
            <input
              type="text"
              value={formData.education.documentReference}
              onChange={(e) => handleInputChange('education.documentReference', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date d'obtention</label>
            <input
              type="date"
              value={formData.education.documentDate}
              onChange={(e) => handleInputChange('education.documentDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfessional = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Poste Actuel
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Département</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date d'embauche</label>
              <input
                type="date"
                value={formData.hireDate}
                onChange={(e) => handleInputChange('hireDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-2xl border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Localisation
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
              <select
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                disabled={user?.role === 'provincial_admin'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Sélectionner...</option>
                <option value="Kinshasa">Kinshasa</option>
                <option value="Kongo-Central">Kongo Central</option>
                <option value="Kwango">Kwango</option>
                <option value="Kwilu">Kwilu</option>
                <option value="Nord-Kivu">Nord-Kivu</option>
                <option value="Sud-Kivu">Sud-Kivu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Coordination</label>
              <select
                value={formData.coordination}
                onChange={(e) => handleInputChange('coordination', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="national">Nationale</option>
                <option value="provincial">Provinciale</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-2xl border border-orange-200">
        <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
          <Building className="w-5 h-5 mr-2" />
          Structure Organisationnelle
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Division</label>
            <select
              value={formData.division}
              onChange={(e) => handleInputChange('division', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Sélectionner...</option>
              <option value="Administrative">Administrative</option>
              <option value="Appui a la production">Appui a la production</option>
              <option value="Financiere">Financiere</option>
              <option value="Normalisation et certification">Normalisation et certification</option>
              <option value="Suivi-Evaluation">Suivi-Evaluation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bureau</label>
            <select
              value={formData.bureau}
              onChange={(e) => handleInputChange('bureau', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Sélectionner...</option>
              <option value="Contentieux">Contentieux</option>
              <option value="gestion de stock">Gestion de stock</option>
              <option value="budget">Budget</option>
              <option value="Analyse de données">Analyse de données</option>
              <option value="Evaluation">Evaluation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unité</label>
            <select
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Sélectionner...</option>
              <option value="Pureté specifique">Pureté specifique</option>
              <option value="Germination">Germination</option>
              <option value="Pathologie">Pathologie</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssignment = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Commission d'affectation
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hasAssignment"
                checked={formData.assignment.hasAssignment}
                onChange={(e) => handleInputChange('assignment.hasAssignment', e.target.checked)}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="hasAssignment" className="text-sm font-medium text-gray-700">
                Possède une commission d'affectation
              </label>
            </div>
            {formData.assignment.hasAssignment && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Référence</label>
                  <input
                    type="text"
                    value={formData.assignment.reference}
                    onChange={(e) => handleInputChange('assignment.reference', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.assignment.date}
                    onChange={(e) => handleInputChange('assignment.date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Arrêté
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hasDecree"
                checked={formData.decree.hasDecree}
                onChange={(e) => handleInputChange('decree.hasDecree', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="hasDecree" className="text-sm font-medium text-gray-700">
                Possède un arrêté
              </label>
            </div>
            {formData.decree.hasDecree && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Référence</label>
                  <input
                    type="text"
                    value={formData.decree.reference}
                    onChange={(e) => handleInputChange('decree.reference', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.decree.date}
                    onChange={(e) => handleInputChange('decree.date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200">
        <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Rémunération & Identification
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="baseSalary"
                checked={formData.payment.baseSalary}
                onChange={(e) => handleInputChange('payment.baseSalary', e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="baseSalary" className="text-sm font-medium text-gray-700">
                Reçoit un salaire de base
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="bonus"
                checked={formData.payment.bonus}
                onChange={(e) => handleInputChange('payment.bonus', e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="bonus" className="text-sm font-medium text-gray-700">
                Reçoit des primes
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="registered"
                checked={formData.payment.registered}
                onChange={(e) => handleInputChange('payment.registered', e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="registered" className="text-sm font-medium text-gray-700">
                Enregistré(e)
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="biometricCard"
                checked={formData.payment.biometricCard}
                onChange={(e) => handleInputChange('payment.biometricCard', e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <label htmlFor="biometricCard" className="text-sm font-medium text-gray-700">
                Possède une carte biométrique
              </label>
            </div>
            {formData.payment.biometricCard && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de carte biométrique</label>
                <input
                  type="text"
                  value={formData.payment.biometricCardNumber}
                  onChange={(e) => handleInputChange('payment.biometricCardNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransfer = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-200">
        <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
          <ArrowRight className="w-5 h-5 mr-2" />
          Transfert
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type d'acte</label>
            <select
              value={formData.transfer.actType}
              onChange={(e) => handleInputChange('transfer.actType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Sélectionner...</option>
              <option value="mutation">Mutation</option>
              <option value="affectation">Affectation</option>
              <option value="detachement">Détachement</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ancienne administration</label>
            <input
              type="text"
              value={formData.transfer.previousAdministration}
              onChange={(e) => handleInputChange('transfer.previousAdministration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Promotion
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grade actuel</label>
            <input
              type="text"
              value={formData.promotion.currentGrade}
              onChange={(e) => handleInputChange('promotion.currentGrade', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Référence de promotion</label>
            <input
              type="text"
              value={formData.promotion.promotionReference}
              onChange={(e) => handleInputChange('promotion.promotionReference', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const currentSlideContent = slides[currentSlide];

  const renderSlideContent = () => {
    switch (currentSlideContent.id) {
      case 'personal':
        return renderPersonalInfo();
      case 'education':
        return renderEducation();
      case 'professional':
        return renderProfessional();
      case 'assignment':
        return renderAssignment();
      case 'payment':
        return renderPayment();
      case 'transfer':
        return renderTransfer();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className={`p-8 rounded-t-3xl text-white ${currentSlideContent.color}`}>
          <h2 className="text-3xl font-bold mb-1 flex items-center">
            <currentSlideContent.icon className="w-8 h-8 mr-3" />
            {currentSlideContent.title}
          </h2>
          <p className="text-gray-200 text-opacity-80">{currentSlideContent.subtitle}</p>
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2.5 mt-4">
            <div
              className="bg-white h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span>Étape {currentSlide + 1} sur {slides.length}</span>
            <span>{Math.round(progress)}% complété</span>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center -mt-4 mb-4 z-10">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-blue-600 w-5' : 'bg-gray-300'
              }`}
              aria-label={`Aller à l'étape ${index + 1}`}
            />
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              {renderSlideContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center rounded-b-3xl">
          <Button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            variant="secondary"
            className="flex items-center"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Précédent
          </Button>
          {currentSlide < slides.length - 1 ? (
            <Button
              onClick={nextSlide}
              className="flex items-center"
            >
              Suivant
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
              className="flex items-center bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Soumettre
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};