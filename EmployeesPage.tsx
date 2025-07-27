import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, UserCog, RefreshCw, UserMinus, Building2, Users, UserCheck, Clock, UserX, GraduationCap, Scale as Male, Scale as Female, MapPin, ChevronDown, UserX2, Briefcase, Baby, Glasses, Crown, BarChart as ChartBar, AlertTriangle, History } from 'lucide-react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { useEmployeeStore, Employee, EmployeeStatus } from '../../stores/employeeStore';
import { useAuthStore } from '../../stores/authStore';
import { useViewPreference } from '../../layouts/MainLayout';
import StatsCard from '../../components/ui/StatsCard';
import { AddEmployeeForm } from '../../components/employees/AddEmployeeForm';
import EmployeeDetailsModal from '../../components/employees/EmployeeDetailsModal';
import TransferEmployeeModal from '../../components/employees/TransferEmployeeModal';
import ChangeStatusModal from '../../components/employees/ChangeStatusModal';
import EmployeeAnalytics from '../../components/employees/EmployeeAnalytics';

const provinces = [
  'Kinshasa',
  'Nord-Kivu',
  'Sud-Kivu',
  'Kongo-Central',
  'Kwilu',
  'Kasaï',
  'Kasaï-Central',
  'Kasaï-Oriental',
  'Lomami',
  'Sankuru',
  'Maniema',
  'Tshopo',
  'Bas-Uele',
  'Haut-Uele',
  'Ituri',
  'Nord-Ubangi',
  'Sud-Ubangi',
  'Mongala',
  'Équateur',
  'Tshuapa',
  'Mai-Ndombe',
  'Kwango',
  'Tanganyika',
  'Haut-Lomami',
  'Lualaba',
  'Haut-Katanga'
];

const EmployeesPage: React.FC = () => {
  const {
    employees,
    deserters,
    detachments,
    availabilities,
    suspensions,
    transfers,
    isLoading,
    getEmployees,
    addEmployee,
    transferEmployee,
    updateEmployee,
    addDocument,
    removeDocument,
    updateProfileImage
  } = useEmployeeStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [coordinationFilter, setCoordinationFilter] = useState<'all' | 'national' | 'provincial'>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDeserters, setShowDeserters] = useState(false);
  const [showLongServiceEmployees, setShowLongServiceEmployees] = useState(false);
  const [showDetachment, setShowDetachment] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);
  const [showSuspension, setShowSuspension] = useState(false);
  const [showTransfers, setShowTransfers] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  }>({ title: '', content: null });

  const tableRef = useRef<HTMLDivElement>(null);

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const { viewNational } = useViewPreference();

  useEffect(() => {
    if (user?.role === 'provincial_admin' && user.province && !viewNational) {
      getEmployees(user.province);
    } else {
      getEmployees();
    }
  }, [getEmployees, user, viewNational]);

  // Calculate statistics
  const stats = {
    totalEmployees: employees.length + deserters.length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    deserters: deserters.length,
    transfers: transfers.length,
    retirees: employees.filter(e => e.status === 'retired').length,
    nationalCoordination: employees.filter(e => e.coordination === 'national').length,
    provincialCoordination: employees.filter(e => e.coordination === 'provincial').length,
    detachments: detachments.length,
    availabilities: availabilities.length,
    suspensions: suspensions.length,
    males: employees.filter(e => e.gender === 'male').length,
    females: employees.filter(e => e.gender === 'female').length,
    officeChiefs: employees.filter(e => {
      const position = e.position || '';
      return position.toLowerCase().includes('chef') ||
             position.toLowerCase().includes('directeur') ||
             position.toLowerCase().includes('responsable');
    }).length,
    divisionChiefs: employees.filter(e => {
      const position = e.position || '';
      return position.toLowerCase().includes('chef de division') ||
             position.toLowerCase().includes('directeur de division');
    }).length,
    nearRetirement: employees.filter(e => {
      const yearsOfService = new Date().getFullYear() - new Date(e.hireDate).getFullYear();
      return yearsOfService >= 32 && yearsOfService < 35;
    }).length,
    youngest: employees.length > 0 ? employees.reduce((youngest, current) => {
      const currentAge = new Date().getFullYear() - new Date(current.birthDate).getFullYear();
      const youngestAge = new Date().getFullYear() - new Date(youngest.birthDate).getFullYear();
      return currentAge < youngestAge ? current : youngest;
    }, employees[0]) : null,
    oldest: employees.length > 0 ? employees.reduce((oldest, current) => {
      const currentAge = new Date().getFullYear() - new Date(current.birthDate).getFullYear();
      const oldestAge = new Date().getFullYear() - new Date(oldest.birthDate).getFullYear();
      return currentAge > oldestAge ? current : oldest;
    }, employees[0]) : null,
    longServiceEmployees: employees.filter(e => {
      const yearsOfService = new Date().getFullYear() - new Date(e.hireDate).getFullYear();
      return yearsOfService >= 35;
    }).length,
  };

  const calculateAge = (birthDate: string) => {
    return new Date().getFullYear() - new Date(birthDate).getFullYear();
  };

  const handleAddEmployee = async (data: Omit<Employee, 'id' | 'status'>) => {
    try {
      await addEmployee(data);
      setSuccessMessage('Agent ajouté avec succès!');
      setTimeout(() => {
        setAddEmployeeModalOpen(false);
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleTransfer = async (province: string, reason: string) => {
    if (!selectedEmployee) return;

    try {
      await transferEmployee(selectedEmployee.id, province, reason);
      setTransferModalOpen(false);
      getEmployees(); // Refresh the list
    } catch (error) {
      console.error('Error transferring employee:', error);
    }
  };

  const handleChangeStatus = async (status: EmployeeStatus, reason: string) => {
    if (!selectedEmployee) return;

    try {
      await updateEmployee(selectedEmployee.id, {
        status,
        statusDate: new Date().toISOString(),
        statusReason: reason
      });
      setChangeStatusModalOpen(false);
      getEmployees(); // Refresh the list
    } catch (error) {
      console.error('Error changing employee status:', error);
    }
  };

  const handleAddDocument = async (employeeId: string, document: Omit<EmployeeDocument, 'id' | 'uploadDate'>) => {
    try {
      await addDocument(employeeId, document);
      getEmployees();
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const handleRemoveDocument = async (employeeId: string, documentId: string) => {
    try {
      await removeDocument(employeeId, documentId);
      getEmployees();
    } catch (error) {
      console.error('Error removing document:', error);
    }
  };

  const handleUpdateProfileImage = async (employeeId: string, imageUrl: string) => {
    try {
      await updateProfileImage(employeeId, imageUrl);
      getEmployees();
    } catch (error) {
      console.error('Error updating profile image:', error);
    }
  };

  const handleViewDetails = (filterType: string, value: string) => {
    setModalContent({
      title: `Détails des agents - ${value}`,
      content: (
        <div>
          {employees
            .filter(e => e[filterType as keyof Employee] === value)
            .map(e => (
              <div key={e.id} className="p-4 border-b">
                   : showTransfers
                   ? 'Aucun agent transféré'
                <h3>{e.firstName} {e.lastName}</h3>
                <p>{e.department} - {e.position}</p>
              </div>
            ))
          }
        </div>
      )
    });
    setModalOpen(true);
  };

  let filteredEmployees = employees;

  if (showDeserters) {
    filteredEmployees = deserters;
  } else if (showDetachment) {
    filteredEmployees = detachments;
  } else if (showAvailability) {
    filteredEmployees = availabilities;
  } else if (showSuspension) {
    filteredEmployees = suspensions;
  } else if (showLongServiceEmployees) {
    filteredEmployees = employees.filter(emp => {
      const yearsOfService = new Date().getFullYear() - new Date(emp.hireDate).getFullYear();
      return yearsOfService >= 35;
    });
  } else {
    if (user?.role === 'provincial_admin' && user?.province) {
      filteredEmployees = filteredEmployees.filter(emp => emp.province === user.province);
    }

    if (coordinationFilter !== 'all') {
      filteredEmployees = filteredEmployees.filter(emp => emp.coordination === coordinationFilter);
    }

    if (provinceFilter !== 'all') {
      filteredEmployees = filteredEmployees.filter(emp => emp.province === provinceFilter);
    }
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredEmployees = filteredEmployees.filter(emp =>
      emp.firstName.toLowerCase().includes(searchLower) ||
      emp.lastName.toLowerCase().includes(searchLower) ||
      (emp.department?.toLowerCase() || '').includes(searchLower) ||
      (emp.position?.toLowerCase() || '').includes(searchLower)
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
      case 'transferred':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Transféré</span>;
      case 'retired':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Retraité</span>;
      case 'deserter':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Déserteur</span>;
      case 'detachment':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Détachement</span>;
      case 'availability':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Disponibilité</span>;
      case 'suspension':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">Suspension</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Agents</h1>
          <p className="text-gray-500 mt-1">Gérez les agents et leurs statuts</p>
        </div>

        <div className="mt-4 md:mt-0 flex gap-2">
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            size="md"
            onClick={() => setAddEmployeeModalOpen(true)}
          >
            Ajouter un Agent
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={scrollToTable}
            rightIcon={<ChevronDown className="w-4 h-4" />}
          >
            Voir la liste
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
          title="Total des Agents"
          value={
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{stats.totalEmployees}</span>
              <span className="text-sm text-gray-600">Actifs: {stats.activeEmployees}</span>
              <span className="text-sm text-gray-600">Déserteurs: {stats.deserters}</span>
              <span className="text-sm text-gray-600">Retraités: {stats.retirees}</span>
            </div>
          }
          icon={<Users className="w-6 h-6 text-primary-600" />}
        />
        <StatsCard
          title="Total des Coordinations"
          value={
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{stats.nationalCoordination + stats.provincialCoordination}</span>
              <span className="text-sm text-gray-600">Nationale: {stats.nationalCoordination}</span>
              <span className="text-sm text-gray-600">Provinciale: {stats.provincialCoordination}</span>
            </div>
          }
          icon={<Building2 className="w-6 h-6 text-blue-600" />}
        />
        <StatsCard
          title="Répartition par Genre"
          value={`${stats.males}H / ${stats.females}F`}
          icon={<Users className="w-6 h-6 text-indigo-600" />}
          trend="neutral"
          trendValue={`${Math.round((stats.females / stats.totalEmployees) * 100)}% de femmes`}
        />
        <StatsCard
          title="Total des Chefs"
          value={
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{stats.officeChiefs + stats.divisionChiefs}</span>
              <span className="text-sm text-gray-600">Chefs de Division: {stats.divisionChiefs}</span>
              <span className="text-sm text-gray-600">Chefs de Bureau: {stats.officeChiefs}</span>
            </div>
          }
          icon={<Crown className="w-6 h-6 text-yellow-600" />}
        />
        {stats.youngest && (
          <StatsCard
            title="Agent le Plus Jeune"
            value={`${calculateAge(stats.youngest.birthDate)} ans`}
            icon={<Baby className="w-6 h-6 text-green-600" />}
            trend="neutral"
            trendValue={`${stats.youngest.firstName} ${stats.youngest.lastName}`}
            onViewDetails={() => {
              setSelectedEmployee(stats.youngest);
              setDetailsModalOpen(true);
            }}
          />
        )}

        {stats.oldest && (
          <StatsCard
            title="Agent le Plus Âgé"
            value={`${calculateAge(stats.oldest.birthDate)} ans`}
            icon={<Glasses className="w-6 h-6 text-blue-600" />}
            trend="neutral"
            trendValue={`${stats.oldest.firstName} ${stats.oldest.lastName}`}
            onViewDetails={() => {
              setSelectedEmployee(stats.oldest);
              setDetailsModalOpen(true);
            }}
          />
        )}

      </motion.div>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          {showDeserters
            ? 'Liste des Déserteurs'
            : showDetachment
            ? 'Agents en Détachement'
            : showAvailability
            ? 'Agents en Disponibilité'
            : showSuspension
            ? 'Agents en Suspension'
            : showLongServiceEmployees
            ? 'Agents avec 35+ ans de service'
            : 'Liste des Agents'}
        </h2>
        <div className="flex gap-2">
          {!showDeserters && !showDetachment && !showAvailability && !showSuspension && !showLongServiceEmployees && (
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowAnalytics(!showAnalytics)}
              leftIcon={<ChartBar className="w-4 h-4" />}
            >
              {showAnalytics ? 'Masquer les analyses' : 'Voir les analyses'}
            </Button>
          )}
          <Button
            variant={showLongServiceEmployees ? 'primary' : 'outline'}
            size="md"
            onClick={() => {
              setShowLongServiceEmployees(!showLongServiceEmployees);
              setShowDeserters(false);
              setShowDetachment(false);
              setShowAvailability(false);
              setShowSuspension(false);
              setShowAnalytics(false);
            }}
            leftIcon={<History className="w-4 h-4" />}
          >
            {showLongServiceEmployees
              ? 'Retour aux agents'
              : `35+ ans de service (${stats.longServiceEmployees})`}
          </Button>
          <Button
            variant={showDeserters ? 'danger' : 'outline'}
            size="md"
            onClick={() => {
              setShowDeserters(!showDeserters);
              setShowLongServiceEmployees(false);
              setShowDetachment(false);
              setShowAvailability(false);
              setShowSuspension(false);
              setShowAnalytics(false);
            }}
            leftIcon={<AlertTriangle className="w-4 h-4" />}
          >
            {showDeserters ? 'Retour aux agents' : `Voir les déserteurs (${stats.deserters})`}
          </Button>
          <Button
            variant={showDetachment ? 'primary' : 'outline'}
            size="md"
            onClick={() => {
              setShowDetachment(!showDetachment);
              setShowDeserters(false);
              setShowLongServiceEmployees(false);
              setShowAvailability(false);
              setShowSuspension(false);
              setShowAnalytics(false);
            }}
            leftIcon={<UserCog className="w-4 h-4" />}
          >
            {showDetachment ? 'Retour aux agents' : `Voir les détachements (${stats.detachments})`}
          </Button>
          <Button
            variant={showAvailability ? 'primary' : 'outline'}
            size="md"
            onClick={() => {
              setShowAvailability(!showAvailability);
              setShowDeserters(false);
              setShowLongServiceEmployees(false);
              setShowDetachment(false);
              setShowSuspension(false);
              setShowAnalytics(false);
            }}
            leftIcon={<UserCog className="w-4 h-4" />}
          >
            {showAvailability ? 'Retour aux agents' : `Voir les disponibilités (${stats.availabilities})`}
          </Button>
          <Button
            variant={showSuspension ? 'primary' : 'outline'}
            size="md"
            onClick={() => {
              setShowSuspension(!showSuspension);
              setShowDeserters(false);
              setShowLongServiceEmployees(false);
              setShowDetachment(false);
              setShowAvailability(false);
              setShowAnalytics(false);
            }}
            leftIcon={<UserCog className="w-4 h-4" />}
          >
            {showSuspension ? 'Retour aux agents' : `Voir les suspensions (${stats.suspensions})`}
          </Button>
        </div>
      </div>

      {showAnalytics && !showDeserters && !showDetachment && !showAvailability && !showSuspension && !showLongServiceEmployees && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <EmployeeAnalytics employees={employees} />        {stats.oldest && (
          <StatsCard
            title="Agent le Plus Âgé"
            value={`${calculateAge(stats.oldest.birthDate)} ans`}
            icon={<Glasses className="w-6 h-6 text-blue-600" />}
            trend="neutral"
            trendValue={`${stats.oldest.firstName} ${stats.oldest.lastName}`}
            onViewDetails={() => {
              setSelectedEmployee(stats.oldest);
              setDetailsModalOpen(true);
            }}
          />
        )}
       </motion.div>
      )}

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Rechercher un agent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-gray-400" />
          <select
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={coordinationFilter}
            onChange={(e) => setCoordinationFilter(e.target.value as 'all' | 'national' | 'provincial')}
          >
            <option value="all">Toutes les coordinations</option>
            <option value="national">Coordination Nationale</option>
            <option value="provincial">Coordination Provinciale</option>
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

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <motion.div
          ref={tableRef}
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {showDeserters
                  ? 'Aucun déserteur trouvé'
                  : showDetachment
                  ? 'Aucun agent en détachement'
                  : showAvailability
                  ? 'Aucun agent en disponibilité'
                  : 'Aucun agent trouvé'}
              </p>
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
                      Coordination
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Division
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payé en prime
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Province
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    {(showDeserters || showDetachment || showAvailability || showSuspension) && (
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Motif
                      </th>
                    )}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <motion.tr key={employee.id} variants={item}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-700 font-semibold text-sm">
                              {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          employee.coordination === 'national'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {employee.coordination === 'national' ? 'Nationale' : 'Provinciale'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.division}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {employee.payment.bonus ? 'Oui' : 'Non'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.province}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(employee.status)}
                      </td>
                      {(showDeserters || showDetachment || showAvailability || showSuspension) && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {employee.statusReason || employee.transferReason || 'Non spécifié'}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<UserCog className="w-4 h-4" />}
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setDetailsModalOpen(true);
                          }}
                        >
                          Détails
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<RefreshCw className="w-4 h-4" />}
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setTransferModalOpen(true);
                          }}
                        >
                          Transférer
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<UserX className="w-4 h-4" />}
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setChangeStatusModalOpen(true);
                          }}
                        >
                          Statut
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
      >
        {modalContent.content}
      </Modal>

      <Modal
        isOpen={addEmployeeModalOpen}
        onClose={() => setAddEmployeeModalOpen(false)}
        title="Ajouter un nouvel agent"
      >
        <AddEmployeeForm
          onSubmit={handleAddEmployee}
          isLoading={isLoading}
          onClose={() => setAddEmployeeModalOpen(false)}
        />
      </Modal>

      {selectedEmployee && (
        <>
          <EmployeeDetailsModal
            isOpen={detailsModalOpen}
            onClose={() => {
              setDetailsModalOpen(false);
              setSelectedEmployee(null);
            }}
            employee={selectedEmployee}
            onAddDocument={(document) => handleAddDocument(selectedEmployee.id, document)}
            onRemoveDocument={(documentId) => handleRemoveDocument(selectedEmployee.id, documentId)}
            onUpdateProfileImage={(imageUrl) => handleUpdateProfileImage(selectedEmployee.id, imageUrl)}
          />

          <TransferEmployeeModal
            isOpen={transferModalOpen}
            onClose={() => {
              setTransferModalOpen(false);
              setSelectedEmployee(null);
            }}
            employee={selectedEmployee}
            onTransfer={handleTransfer}
            isLoading={isLoading}
          />

          <ChangeStatusModal
            isOpen={changeStatusModalOpen}
            onClose={() => {
              setChangeStatusModalOpen(false);
              setSelectedEmployee(null);
            }}
            employee={selectedEmployee}
            onChangeStatus={handleChangeStatus}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default EmployeesPage;