import React from 'react';
import { useParams } from 'react-router-dom';

const InternDetails: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Intern Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Viewing details for intern ID: {id}</p>
      </div>
    </div>
  );
};

export default InternDetails;