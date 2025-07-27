import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, UserCheck, Calendar, MapPin, ArrowRight, FileText, Info } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useEmployeeStore } from '../../stores/employeeStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import EmployeeDetailsModal from '../../components/employees/EmployeeDetailsModal';
import Modal from '../../components/ui/Modal';
import StatsCard from '../../components/ui/StatsCard';

const TransfersPage: React.FC = () => {
  const { transfers, transferHistory, isLoading, getEmployees, recoverEmployee } = useEmployeeStore();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [showRecovered, setShowRecovered] = useState(false);
  const [transferDetailsOpen, setTransferDetailsOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  const handleRecover = async (employeeId: string) => {
    try {
      await recoverEmployee(employeeId);
      getEmployees(); // Refresh the list
    } catch (error) {
      console.error('Error recovering employee:', error);
    }
  };

  // Utiliser l'historique complet des transferts ou seulement les transferts actifs
  const filteredTransfers = showRecovered 
    ? transferHistory // Historique complet des transferts
    : transfers; // Seulement les transferts actifs

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

  // Fusionner les transferts avec les employés actifs qui ont été transférés
  const allTransfers = filteredTransfers;
  
  // Trier par date de transfert (du plus récent au plus ancien)
  allTransfers.sort((a, b) => {
    if (!a.transferDate || !b.transferDate) return 0;
    return new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Agents Transférés</h1>
        
        <div className="mt-4 md:mt-0">
          <Button
            variant={showRecovered ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowRecovered(!showRecovered)}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            {showRecovered ? "Afficher transferts actifs" : "Afficher historique complet"}
          </Button>
        </div>
      </div>
      
      <p className="text-gray-500">Historique complet des transferts d'agents</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total des transferts"
          value={transferHistory.length}
          icon={<RefreshCw className="w-6 h-6 text-primary-600" />}
        />
        
        <StatsCard
          title="Transferts actifs"
          value={transfers.length}
          icon={<MapPin className="w-6 h-6 text-blue-600" />}
        />
        
        <StatsCard
          title="Agents récupérés"
          value={transferHistory.length - transfers.length}
          icon={<UserCheck className="w-6 h-6 text-green-600" />}
        />
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
          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
        >
          {allTransfers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun agent transféré</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ancien Département
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nouveau Département
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Province
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de transfert
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Motif
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allTransfers.map((employee) => {
                    const yearsOfService = new Date().getFullYear() - new Date(employee.hireDate).getFullYear();
                    
                    return (
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
                          <div className="text-sm text-gray-900">{employee.previousDepartment}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.province}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(new Date(employee.transferDate || ''), 'dd MMMM yyyy', { locale: fr })}
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                employee.status === 'transferred' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {employee.status === 'transferred' ? 'Transféré' : 'Récupéré'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {employee.transferReason}
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              <ArrowRight className="w-3 h-3 mx-1" />
                              {employee.province}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              leftIcon={<UserCheck className="w-4 h-4" />}
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setDetailsModalOpen(true);
                              }}
                            >
                              Détails
                            </Button>
                            {employee.status === 'transferred' && (
                              <Button
                                size="sm"
                                variant="outline"
                                leftIcon={<RefreshCw className="w-4 h-4" />}
                                onClick={() => handleRecover(employee.id)}
                              >
                                Récupérer
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              leftIcon={<Info className="w-4 h-4" />}
                              onClick={() => {
                                setSelectedTransfer(employee);
                                setTransferDetailsOpen(true);
                              }}
                            >
                              Détails du transfert
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          isOpen={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedEmployee(null);
          }}
        />
      )}
      
      {selectedTransfer && (
        <Modal
          isOpen={transferDetailsOpen}
          onClose={() => {
            setTransferDetailsOpen(false);
            setSelectedTransfer(null);
          }}
          title="Détails du transfert"
        >
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Informations du transfert
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Agent</p>
                  <p className="font-semibold text-gray-900">{selectedTransfer.firstName} {selectedTransfer.lastName}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Matricule</p>
                  <p className="font-semibold text-gray-900">{selectedTransfer.matricule}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Date du transfert</p>
                  <p className="font-semibold text-gray-900">
                    {format(new Date(selectedTransfer.transferDate || ''), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Statut actuel</p>
                  <p className="font-semibold">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedTransfer.status === 'transferred' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedTransfer.status === 'transferred' ? 'Transféré' : 'Récupéré'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Détails de l'affectation
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ancien département</p>
                  <p className="font-semibold text-gray-900">{selectedTransfer.previousDepartment || 'Non spécifié'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Nouveau département</p>
                  <p className="font-semibold text-gray-900">{selectedTransfer.department}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Province de provenance</p>
                  <p className="font-semibold text-gray-900">{selectedTransfer.previousProvince || 'Non spécifiée'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Province de destination</p>
                  <p className="font-semibold text-gray-900">{selectedTransfer.province}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Coordination</p>
                  <p className="font-semibold text-gray-900">
                    {selectedTransfer.coordination === 'national' ? 'Nationale' : 'Provinciale'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Motif du transfert
              </h3>
              
              <div className="p-4 bg-white rounded-lg border border-orange-100">
                <p className="text-gray-800">{selectedTransfer.transferReason || 'Aucun motif spécifié'}</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setTransferDetailsOpen(false);
                  setSelectedTransfer(null);
                }}
              >
                Fermer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TransfersPage;