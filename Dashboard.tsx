import React from 'react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-red-800 mb-4">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h1>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">MINISTÈRE DE L'AGRICULTURE</h2>
            <p className="text-xl text-gray-700">SECRÉTARIAT GÉNÉRAL À L'AGRICULTURE</p>
            <p className="text-xl text-green-700 font-semibold">SERVICE NATIONAL DE SEMENCES</p>
            <div className="flex justify-center my-8">
              <img 
                src="/senasem.jpg" 
                alt="SENASEM Logo" 
                className="w-32 h-32 object-contain"
              />
            </div>
            <p className="text-xl text-green-700 italic">COORDINATION NATIONALE</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-blue-800 mb-6 text-center">Présentation du SENASEM</h3>
          <div className="bg-blue-800 text-white p-6 rounded-lg">
            <p className="text-lg leading-relaxed">
              Le Service National de Semences « SENASEM » est un Service spécialisé du Ministère de l'Agriculture de la République Démocratique du Congo, chargé du contrôle de la qualité des semences et de la certification du matériel de reproduction végétale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;