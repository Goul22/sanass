import React from 'react';
import { useParams } from 'react-router-dom';

const AdminDetails: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Administrator Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Details for administrator ID: {id}</p>
      </div>
    </div>
  );
};

export default AdminDetails;