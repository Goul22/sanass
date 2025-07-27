import React, { useState } from 'react';
import { UserCheck, UserX, UserMinus, UserCog } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Employee, EmployeeStatus } from '../../stores/employeeStore';

interface ChangeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onChangeStatus: (status: EmployeeStatus, reason: string) => void;
  isLoading: boolean;
}

const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
  isOpen,
  onClose,
  employee,
  onChangeStatus,
  isLoading
}) => {
  const [selectedStatus, setSelectedStatus] = useState<EmployeeStatus>(employee.status);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus !== employee.status && !reason.trim()) {
      setError('Le motif du changement de statut est requis');
      return;
    }
    setError('');
    onChangeStatus(selectedStatus, reason);
  };

  // Determine which status options to show based on current status
  const showActiveOption = employee.status !== 'active';
  const showDeserterOption = employee.status !== 'deserter';
  const showRetiredOption = employee.status !== 'retired';
  const showDetachmentOption = employee.status !== 'detachment';
  const showAvailabilityOption = employee.status !== 'availability';
  const showSuspensionOption = employee.status !== 'suspension';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Modifier le Statut de l'Agent"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="mb-6">
            <p className="text-gray-700">
              Agent: <span className="font-semibold">{employee.firstName} {employee.lastName}</span>
            </p>
            <p className="text-sm text-gray-500">
              Statut actuel: {getStatusLabel(employee.status)}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau Statut
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {showActiveOption && (
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('active')}
                    className={`p-3 flex items-center space-x-2 rounded-lg border ${
                      selectedStatus === 'active'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <UserCheck className="w-5 h-5" />
                    <span>Actif</span>
                  </button>
                )}

                {showDeserterOption && (
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('deserter')}
                    className={`p-3 flex items-center space-x-2 rounded-lg border ${
                      selectedStatus === 'deserter'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <UserX className="w-5 h-5" />
                    <span>Déserteur</span>
                  </button>
                )}

                {showRetiredOption && (
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('retired')}
                    className={`p-3 flex items-center space-x-2 rounded-lg border ${
                      selectedStatus === 'retired'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <UserMinus className="w-5 h-5" />
                    <span>Retraité</span>
                  </button>
                )}

                {showDetachmentOption && (
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('detachment')}
                    className={`p-3 flex items-center space-x-2 rounded-lg border ${
                      selectedStatus === 'detachment'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <UserCog className="w-5 h-5" />
                    <span>Détachement</span>
                  </button>
                )}

                {showAvailabilityOption && (
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('availability')}
                    className={`p-3 flex items-center space-x-2 rounded-lg border ${
                      selectedStatus === 'availability'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <UserCog className="w-5 h-5" />
                    <span>Disponibilité</span>
                  </button>
                )}

                {showSuspensionOption && (
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('suspension')}
                    className={`p-3 flex items-center space-x-2 rounded-lg border ${
                      selectedStatus === 'suspension'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <UserCog className="w-5 h-5" />
                    <span>Suspension</span>
                  </button>
                )}
              </div>
            </div>

            {selectedStatus !== employee.status && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motif du changement
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                  placeholder="Expliquez le motif du changement de statut..."
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={selectedStatus === employee.status}
          >
            Confirmer le changement
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const getStatusLabel = (status: EmployeeStatus): string => {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'transferred':
      return 'Transféré';
    case 'retired':
      return 'Retraité';
    case 'deserter':
      return 'Déserteur';
    case 'detachment':
      return 'Détachement';
    case 'availability':
      return 'Disponibilité';
    case 'suspension':
      return 'Suspension';
    default:
      return status;
  }
};

export default ChangeStatusModal;