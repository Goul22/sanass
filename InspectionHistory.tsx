import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Button from '../ui/Button';
import { InspectionData } from '../../stores/agriMultiplierStore';

interface InspectionHistoryProps {
  inspectionHistory: InspectionData[];
  onExport?: () => void;
}

const InspectionHistory: React.FC<InspectionHistoryProps> = ({
  inspectionHistory,
  onExport
}) => {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  const years = [...new Set(inspectionHistory.map(inspection => inspection.year))];
  
  const filteredHistory = selectedYear === 'all' 
    ? inspectionHistory 
    : inspectionHistory.filter(inspection => inspection.year === selectedYear);

  const calculateYieldVariation = (expected: number, realized: number) => {
    const variation = ((realized - expected) / expected) * 100;
    return variation.toFixed(1);
  };

  const exportToCSV = () => {
    const headers = [
      'Année',
      'Date d\'inspection',
      'Superficie (ha)',
      'Rendement prévu (t/ha)',
      'Rendement réalisé (t/ha)',
      'Variation (%)',
      'N° Inspection'
    ];

    const rows = filteredHistory.map(inspection => [
      inspection.year,
      format(new Date(inspection.inspectionDate), 'dd/MM/yyyy', { locale: fr }),
      inspection.surface,
      inspection.expectedYield,
      inspection.realizedYield,
      calculateYieldVariation(inspection.expectedYield, inspection.realizedYield),
      inspection.inspectionId
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inspection_history_${selectedYear === 'all' ? 'complete' : selectedYear}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            value={selectedYear.toString()}
            onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
          >
            <option value="all">Toutes les années</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <Button
          variant="outline"
          onClick={exportToCSV}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Exporter en CSV
        </Button>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Aucune donnée d'inspection disponible</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Année
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inspection
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Superficie (ha)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rendement prévu (t/ha)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rendement réalisé (t/ha)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Inspection
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHistory.map((inspection, index) => {
                const yieldVariation = parseFloat(calculateYieldVariation(inspection.expectedYield, inspection.realizedYield));
                
                return (
                  <motion.tr
                    key={inspection.inspectionId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspection.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(inspection.inspectionDate), 'dd MMMM yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspection.surface}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspection.expectedYield}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspection.realizedYield}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TrendingUp className={`w-4 h-4 mr-1 ${
                          yieldVariation >= 0 ? 'text-green-500' : 'text-red-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          yieldVariation >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {yieldVariation >= 0 ? '+' : ''}{yieldVariation}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspection.inspectionId}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InspectionHistory;