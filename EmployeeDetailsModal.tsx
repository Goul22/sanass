import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, Building2, MapPin, Calendar, Briefcase, UserCheck, FileText, Upload, Trash2, 
  ChevronLeft, ChevronRight, File, X, Camera, User, GraduationCap, CreditCard, Award, 
  Shield, Clock, Heart, Baby, Users, Home, Banknote, CheckCircle, XCircle, Eye, Download,
  Edit3, Star, Badge, Zap
} from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import ImagePreviewModal from './ImagePreviewModal';
import DocumentPreviewModal from './DocumentPreviewModal';
import { Employee, EmployeeDocument } from '../../stores/employeeStore';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onAddDocument?: (document: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => void;
  onRemoveDocument?: (documentId: string) => void;
  onUpdateProfileImage?: (imageUrl: string) => void;
}

const slides = [
  {
    title: "Profil Personnel",
    subtitle: "Informations personnelles et contact",
    icon: User,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Formation & Éducation",
    subtitle: "Parcours académique et qualifications",
    icon: GraduationCap,
    color: "from-purple-500 to-pink-600",
  },
  {
    title: "Carrière Professionnelle",
    subtitle: "Poste, département et responsabilités",
    icon: Briefcase,
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "Affectation & Arrêtés",
    subtitle: "Commissions d'affectation et arrêtés",
    icon: Shield,
    color: "from-orange-500 to-red-600",
  },
  {
    title: "Rémunération",
    subtitle: "Salaires, primes et carte biométrique",
    icon: CreditCard,
    color: "from-teal-500 to-cyan-600",
  },
  {
    title: "Transferts & Promotions",
    subtitle: "Historique des mutations et avancements",
    icon: Award,
    color: "from-pink-500 to-rose-600",
  },
  {
    title: "Documents",
    subtitle: "Diplômes, certificats et pièces justificatives",
    icon: FileText,
    color: "from-indigo-500 to-purple-600",
  }
];

const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({
  isOpen,
  onClose,
  employee,
  onAddDocument,
  onRemoveDocument,
  onUpdateProfileImage,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState<'diploma' | 'assignment' | 'decree'>('diploma');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<EmployeeDocument | null>(null);
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialiser les documents à partir des props
  useEffect(() => {
    if (employee && employee.documents) {
      setDocuments(employee.documents);
    }
  }, [employee]);

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (!isValid(birth)) return null;
    
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateYearsOfService = (hireDate: string) => {
    if (!hireDate) return null;
    const hire = new Date(hireDate);
    if (!isValid(hire)) return null;
    
    const today = new Date();
    let years = today.getFullYear() - hire.getFullYear();
    const monthDiff = today.getMonth() - hire.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < hire.getDate())) {
      years--;
    }
    return years;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'dd MMMM yyyy', { locale: fr }) : 'N/A';
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDocumentName(file.name.split('.')[0]);
    }
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUpdateProfileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        onUpdateProfileImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile || !documentName || !onAddDocument) return;

    setUploadingDocument(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        const newDocument = {
          type: documentType,
          name: documentName,
          url: url
        };
        
        // Ajouter le document à l'état local pour affichage immédiat
        const tempDoc: EmployeeDocument = {
          ...newDocument,
          id: `temp_${Date.now()}`,
          uploadDate: new Date().toISOString()
        };
        
        setDocuments(prev => [...prev, tempDoc]);
        
        // Envoyer au store pour persistance
        onAddDocument(newDocument);
        
        setSelectedFile(null);
        setDocumentName('');
        setDocumentType('diploma');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    if (onRemoveDocument) {
      onRemoveDocument(documentId);
      // Mettre à jour l'état local
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, label: 'Actif' },
      transferred: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: MapPin, label: 'Transféré' },
      retired: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock, label: 'Retraité' },
      deserter: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, label: 'Déserteur' },
      detachment: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Users, label: 'Détachement' },
      availability: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, label: 'Disponibilité' },
      suspension: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: XCircle, label: 'Suspension' },
    };

    const badge = badges[status as keyof typeof badges];
    if (!badge) return null;

    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${badge.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {badge.label}
      </span>
    );
  };

  const InfoCard = ({ icon: Icon, title, children, gradient }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className={`bg-gradient-to-r ${gradient} p-4`}>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );

  const DataRow = ({ label, value, icon: Icon }: any) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-3">
        {Icon && <Icon className="w-4 h-4 text-gray-400" />}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <span className="text-sm text-gray-900 font-medium">{value || 'N/A'}</span>
    </div>
  );

  const renderPersonalProfile = () => (
    <div className="space-y-6">
      {/* Header avec photo et infos principales */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div 
              className="w-24 h-24 rounded-full overflow-hidden bg-white/20 flex items-center justify-center cursor-pointer ring-4 ring-white/30"
              onClick={() => employee.profileImage && setIsImagePreviewOpen(true)}
            >
              {employee.profileImage ? (
                <img
                  src={employee.profileImage}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-3xl font-bold text-white">
                  {employee.firstName[0]}{employee.lastName[0]}
                </div>
              )}
            </div>
            {onUpdateProfileImage && (
              <label className="absolute -bottom-2 -right-2 p-2 bg-white text-blue-600 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
              </label>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{employee.firstName} {employee.lastName}</h2>
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                {employee.matricule}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                {employee.gradeCategory}
              </span>
            </div>
            <div className="mb-4">{getStatusBadge(employee.status)}</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{calculateAge(employee.birthDate)} ans</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>{calculateYearsOfService(employee.hireDate)} ans de service</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoCard icon={User} title="Informations Personnelles" gradient="from-blue-500 to-indigo-600">
          <div className="space-y-1">
            <DataRow label="Genre" value={employee.gender === 'male' ? 'Homme' : 'Femme'} icon={User} />
            <DataRow label="Date de naissance" value={formatDate(employee.birthDate)} icon={Calendar} />
            <DataRow label="Lieu de naissance" value={employee.birthPlace} icon={MapPin} />
            <DataRow label="État civil" value={
              employee.maritalStatus === 'single' ? 'Célibataire' :
              employee.maritalStatus === 'married' ? 'Marié(e)' :
              employee.maritalStatus === 'divorced' ? 'Divorcé(e)' : 'Veuf/Veuve'
            } icon={Heart} />
            <DataRow label="Nombre d'enfants" value={employee.numberOfChildren} icon={Baby} />
          </div>
        </InfoCard>

        <InfoCard icon={Phone} title="Contact" gradient="from-green-500 to-emerald-600">
          <div className="space-y-1">
            <DataRow label="Téléphone" value={employee.phone} icon={Phone} />
            <DataRow label="Email" value={employee.email} icon={Mail} />
          </div>
        </InfoCard>
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <InfoCard icon={GraduationCap} title="Formation Académique" gradient="from-purple-500 to-pink-600">
        <div className="space-y-1">
          <DataRow label="Niveau d'étude" value={employee.education?.level} icon={GraduationCap} />
          <DataRow label="Domaine" value={employee.education?.domain} icon={Star} />
          <DataRow label="Année d'obtention" value={employee.education?.graduationYear} icon={Calendar} />
          <DataRow label="Institution" value={employee.education?.institution} icon={Building2} />
          <DataRow label="Pays" value={employee.education?.country} icon={MapPin} />
          <DataRow label="Province" value={employee.education?.province} icon={MapPin} />
          <DataRow label="Ville" value={employee.education?.city} icon={Home} />
        </div>
      </InfoCard>

      <InfoCard icon={FileText} title="Document de Formation" gradient="from-indigo-500 to-purple-600">
        <div className="space-y-1">
          <DataRow label="Type de document" value={employee.education?.documentType} icon={FileText} />
          <DataRow label="Référence" value={employee.education?.documentReference} icon={Badge} />
          <DataRow label="Date du document" value={formatDate(employee.education?.documentDate || '')} icon={Calendar} />
        </div>
      </InfoCard>
    </div>
  );

  const renderProfessionalCareer = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoCard icon={Building2} title="Position Actuelle" gradient="from-green-500 to-emerald-600">
          <div className="space-y-1">
            <DataRow label="Coordination" value={employee.coordination === 'national' ? 'Nationale' : 'Provinciale'} icon={Building2} />
            <DataRow label="Province" value={employee.province} icon={MapPin} />
            <DataRow label="Division" value={employee.division} icon={Users} />
            <DataRow label="Bureau" value={employee.bureau} icon={Briefcase} />
            <DataRow label="Unité" value={employee.unit} icon={Zap} />
          </div>
        </InfoCard>

        <InfoCard icon={Clock} title="Carrière" gradient="from-orange-500 to-red-600">
          <div className="space-y-1">
            <DataRow label="Date d'embauche" value={formatDate(employee.hireDate)} icon={Calendar} />
            <DataRow label="Années de service" value={`${calculateYearsOfService(employee.hireDate)} ans`} icon={Clock} />
            <DataRow label="Grade actuel" value={employee.gradeCategory} icon={Award} />
            <DataRow label="Département précédent" value={employee.previousDepartment} icon={Building2} />
          </div>
        </InfoCard>
      </div>

      {employee.statusReason && (
        <InfoCard icon={FileText} title="Statut Actuel" gradient="from-yellow-500 to-orange-600">
          <DataRow label="Motif du statut" value={employee.statusReason} icon={FileText} />
          {employee.statusDate && (
            <DataRow label="Date du changement" value={formatDate(employee.statusDate)} icon={Calendar} />
          )}
        </InfoCard>
      )}
    </div>
  );

  const renderAssignmentDecree = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoCard icon={Shield} title="Commission d'Affectation" gradient="from-blue-500 to-indigo-600">
          <div className="space-y-1">
            <DataRow 
              label="Possession" 
              value={employee.assignment?.hasAssignment ? 'Oui' : 'Non'} 
              icon={employee.assignment?.hasAssignment ? CheckCircle : XCircle} 
            />
            {employee.assignment?.hasAssignment && (
              <>
                <DataRow label="Référence" value={employee.assignment?.reference} icon={Badge} />
                <DataRow label="Date" value={formatDate(employee.assignment?.date || '')} icon={Calendar} />
              </>
            )}
          </div>
        </InfoCard>

        <InfoCard icon={Award} title="Arrêté" gradient="from-purple-500 to-pink-600">
          <div className="space-y-1">
            <DataRow 
              label="Possession" 
              value={employee.decree?.hasDecree ? 'Oui' : 'Non'} 
              icon={employee.decree?.hasDecree ? CheckCircle : XCircle} 
            />
            {employee.decree?.hasDecree && (
              <>
                <DataRow label="Référence" value={employee.decree?.reference} icon={Badge} />
                <DataRow label="Date" value={formatDate(employee.decree?.date || '')} icon={Calendar} />
              </>
            )}
          </div>
        </InfoCard>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoCard icon={Banknote} title="Rémunération" gradient="from-teal-500 to-cyan-600">
          <div className="space-y-1">
            <DataRow 
              label="Salaire de base" 
              value={employee.payment?.baseSalary ? 'Oui' : 'Non'} 
              icon={employee.payment?.baseSalary ? CheckCircle : XCircle} 
            />
            <DataRow 
              label="Prime" 
              value={employee.payment?.bonus ? 'Oui' : 'Non'} 
              icon={employee.payment?.bonus ? CheckCircle : XCircle} 
            />
            <DataRow 
              label="Recensé" 
              value={employee.payment?.registered ? 'Oui' : 'Non'} 
              icon={employee.payment?.registered ? CheckCircle : XCircle} 
            />
          </div>
        </InfoCard>

        <InfoCard icon={CreditCard} title="Carte Biométrique" gradient="from-indigo-500 to-purple-600">
          <div className="space-y-1">
            <DataRow 
              label="Possession" 
              value={employee.payment?.biometricCard ? 'Oui' : 'Non'} 
              icon={employee.payment?.biometricCard ? CheckCircle : XCircle} 
            />
            {employee.payment?.biometricCard && employee.payment?.biometricCardNumber && (
              <DataRow label="Numéro" value={employee.payment.biometricCardNumber} icon={Badge} />
            )}
          </div>
        </InfoCard>
      </div>
    </div>
  );

  const renderTransferPromotion = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoCard icon={MapPin} title="Transfert" gradient="from-green-500 to-emerald-600">
          <div className="space-y-1">
            <DataRow label="Nature de l'acte" value={employee.transfer?.actType} icon={FileText} />
            <DataRow label="Administration de provenance" value={employee.transfer?.previousAdministration} icon={Building2} />
            {employee.transferDate && (
              <DataRow label="Date de transfert" value={formatDate(employee.transferDate)} icon={Calendar} />
            )}
            {employee.transferReason && (
              <DataRow label="Motif" value={employee.transferReason} icon={FileText} />
            )}
          </div>
        </InfoCard>

        <InfoCard icon={Award} title="Promotion" gradient="from-yellow-500 to-orange-600">
          <div className="space-y-1">
            <DataRow label="Grade actuel" value={employee.promotion?.currentGrade} icon={Award} />
            <DataRow label="Référence acte de promotion" value={employee.promotion?.promotionReference} icon={Badge} />
          </div>
        </InfoCard>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      {onAddDocument && (
        <InfoCard icon={Upload} title="Ajouter un Document" gradient="from-blue-500 to-indigo-600">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de document
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as 'diploma' | 'assignment' | 'decree')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="diploma">Diplôme</option>
                  <option value="assignment">Commission d'affectation</option>
                  <option value="decree">Arrêté</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du document
                </label>
                <input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Diplôme de licence"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fichier
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Télécharger un fichier</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </label>
                    <p className="pl-1">ou glisser-déposer</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, JPG, JPEG, PNG jusqu'à 10MB
                  </p>
                  {selectedFile && (
                    <p className="text-sm text-blue-600 font-medium">
                      Fichier sélectionné: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleUploadDocument}
                disabled={!selectedFile || !documentName || uploadingDocument}
                isLoading={uploadingDocument}
                leftIcon={<Upload className="w-4 h-4" />}
              >
                Télécharger
              </Button>
            </div>
          </div>
        </InfoCard>
      )}

      <InfoCard icon={FileText} title={`Documents (${employee.documents.length})`} gradient="from-purple-500 to-pink-600">
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Aucun document disponible</p>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <File className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      Ajouté le {format(new Date(doc.uploadDate), 'dd/MM/yyyy à HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDocument(doc);
                      setIsImagePreviewOpen(false);
                    }}
                    leftIcon={<Eye className="w-4 h-4" />}
                  >
                    Voir
                  </Button>
                  {onRemoveDocument && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveDocument(doc.id)}
                      leftIcon={<Trash2 className="w-4 h-4 text-red-500" />}
                    >
                      Supprimer
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </InfoCard>
    </div>
  );

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title=""
        size="full"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header moderne avec navigation */}
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
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation par onglets */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {slides.map((slide, index) => {
                const SlideIcon = slide.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap ${
                      currentSlide === index
                        ? `bg-gradient-to-r ${slide.color} text-white shadow-lg scale-105`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <SlideIcon className="w-5 h-5" />
                    <span className="font-medium">{slide.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contenu des slides */}
          <div className="min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentSlide === 0 && renderPersonalProfile()}
                {currentSlide === 1 && renderEducation()}
                {currentSlide === 2 && renderProfessionalCareer()}
                {currentSlide === 3 && renderAssignmentDecree()}
                {currentSlide === 4 && renderPayment()}
                {currentSlide === 5 && renderTransferPromotion()}
                {currentSlide === 6 && renderDocuments()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation en bas */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Précédent
            </Button>

            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Suivant
            </Button>
          </div>
        </div>
      </Modal>

      {employee.profileImage && (
        <ImagePreviewModal
          isOpen={isImagePreviewOpen}
          onClose={() => setIsImagePreviewOpen(false)}
          imageUrl={employee.profileImage}
          alt={`${employee.firstName} ${employee.lastName}`}
        />
      )}

      {selectedDocument && (
        <DocumentPreviewModal
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          documentUrl={selectedDocument.url}
          documentName={selectedDocument.name}
          documentType={selectedDocument.type}
        />
      )}
    </>
  );
};

export default EmployeeDetailsModal;