import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserMinus, Clock, UserCog } from 'lucide-react';
import { useEmployeeStore } from '../../stores/employeeStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Button from '../../components/ui/Button';
import EmployeeDetailsModal from '../../components/employees/EmployeeDetailsModal';

const RetireesPage: React.FC = () => {
  const { retirees, isLoading, getEmployees } = useEmployeeStore();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Agents Retraités</h1>
        <p className="text-gray-500 mt-1">Liste des agents qui ont pris leur retraite</p>
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
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {retirees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun agent retraité</p>
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
                      Département
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Province
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Années de service
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'embauche
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {retirees.map((employee) => {
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
                          <div className="text-sm text-gray-900">{employee.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{employee.province}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{yearsOfService} ans</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {format(new Date(employee.hireDate), 'dd MMMM yyyy', { locale: fr })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
          isOpen={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
        />
      )}
    </div>
  );
};

export default RetireesPage;