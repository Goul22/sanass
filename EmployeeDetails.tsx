import React from 'react';
import { useParams } from 'react-router-dom';
import { useEmployeeStore } from '../../stores/employeeStore';
import { useEffect, useState } from 'react';

const EmployeeDetails: React.FC = () => {
  const { id } = useParams();
  const { employees, getEmployees } = useEmployeeStore();
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    if (employees.length === 0) {
      getEmployees();
    }
  }, [employees, getEmployees]);

  useEffect(() => {
    if (id && employees.length > 0) {
      const foundEmployee = employees.find(emp => emp.id === id);
      setEmployee(foundEmployee);
    }
  }, [id, employees]);

  if (!employee) {
    return <div className="p-6">Loading employee details...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Employee Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Employee ID: {employee.matricule}</p>
        <h2 className="text-xl font-semibold mt-6 mb-4">Contact</h2>
        <p className="text-gray-600">Email: {employee.email}</p>
        <p className="text-gray-600">Phone: {employee.phone}</p>
        <p className="text-gray-600">Address: {employee.address}</p>
        {/* Additional employee details will be added here */}
      </div>
    </div>
  );
};

export default EmployeeDetails;