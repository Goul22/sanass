import React, { useState } from 'react';
import { MapPin, FileText } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Employee } from '../../stores/employeeStore';

interface TransferEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onTransfer: (province: string, reason: string) => void;
  isLoading: boolean;
}

const TransferEmployeeModal: React.FC<TransferEmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  onTransfer,
  isLoading
}) => {
  const [province, setProvince] = useState(employee.province);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Le motif du transfert est requis');
      return;
    }
    setError('');
    onTransfer(province, reason);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transférer l'Agent"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="mb-6">
            <p className="text-gray-700">
              Transfert de: <span className="font-semibold">{employee.firstName} {employee.lastName}</span>
            </p>
            <p className="text-sm text-gray-500">
              Position actuelle: {employee.department} - {employee.province}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nouvelle Province
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Kinshasa">Kinshasa</option>
                  <option value="Nord-Kivu">Nord-Kivu</option>
                  <option value="Sud-Kivu">Sud-Kivu</option>
                  <option value="Kongo-Central">Kongo-Central</option>
                  <option value="Kwilu">Kwilu</option>
                  <option value="Kasaï">Kasaï</option>
                  <option value="Kasaï-Central">Kasaï-Central</option>
                  <option value="Kasaï-Oriental">Kasaï-Oriental</option>
                  <option value="Lomami">Lomami</option>
                  <option value="Sankuru">Sankuru</option>
                  <option value="Maniema">Maniema</option>
                  <option value="Tshopo">Tshopo</option>
                  <option value="Bas-Uele">Bas-Uele</option>
                  <option value="Haut-Uele">Haut-Uele</option>
                  <option value="Ituri">Ituri</option>
                  <option value="Nord-Ubangi">Nord-Ubangi</option>
                  <option value="Sud-Ubangi">Sud-Ubangi</option>
                  <option value="Mongala">Mongala</option>
                  <option value="Équateur">Équateur</option>
                  <option value="Tshuapa">Tshuapa</option>
                  <option value="Mai-Ndombe">Mai-Ndombe</option>
                  <option value="Kwango">Kwango</option>
                  <option value="Tanganyika">Tanganyika</option>
                  <option value="Haut-Lomami">Haut-Lomami</option>
                  <option value="Lualaba">Lualaba</option>
                  <option value="Haut-Katanga">Haut-Katanga</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motif du transfert
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  rows={3}
                  placeholder="Expliquez le motif du transfert..."
                />
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
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
          >
            Confirmer le transfert
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransferEmployeeModal;