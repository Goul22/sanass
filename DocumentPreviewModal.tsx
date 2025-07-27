import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentName: string;
  documentType: string;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  documentUrl,
  documentName,
  documentType
}) => {
  if (!isOpen) return null;

  const isImage = documentUrl.match(/\.(jpg|jpeg|png|gif)$/i);
  const isPDF = documentUrl.match(/\.pdf$/i);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-semibold text-gray-900">{documentName}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-hidden flex flex-col">
            <div className="mb-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(documentUrl, '_blank')}
                leftIcon={<ExternalLink className="w-4 h-4" />}
              >
                Ouvrir dans un nouvel onglet
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = documentUrl;
                  link.download = documentName;
                  link.click();
                }}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Télécharger
              </Button>
            </div>

            <div className="bg-gray-50 rounded-lg overflow-auto flex-1">
              {isImage ? (
                <img
                  src={documentUrl}
                  alt={documentName}
                  className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                />
              ) : isPDF ? (
                <iframe
                  src={documentUrl}
                  title={documentName}
                  className="w-full h-[70vh]"
                />
              ) : (
                <div className="flex items-center justify-center p-8 h-[50vh]">
                  <p className="text-gray-500">
                    Aperçu non disponible. Cliquez sur "Ouvrir" ou "Télécharger" pour voir le document.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DocumentPreviewModal;