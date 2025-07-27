import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Building2, Sprout, CreditCard, Printer } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

import { AgriMultiplier } from '../../stores/agriMultiplierStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AgriMultiplierDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  multiplier: AgriMultiplier;
}

const AgriMultiplierDetailsModal: React.FC<AgriMultiplierDetailsModalProps> = ({
  isOpen,
  onClose,
  multiplier
}) => {
  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">Approuvé</span>;
      case 'pending':
        return <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
      case 'rejected':
        return <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">Rejeté</span>;
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Détails de l'Agri-Multiplicateur"
      size="full"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Imprimer
          </Button>
        </div>

        <div className="bg-white w-[210mm] mx-auto p-[20mm] shadow-lg print:shadow-none">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center space-x-4">
              <img 
                src="https://pbs.twimg.com/profile_images/1741174756542455808/fNQNLx0J_400x400.jpg" 
                alt="Ministère" 
                className="w-16 h-16 object-contain"
              />
              <div>
                <p className="text-xs uppercase">Ministère de l'Agriculture</p>
                <p className="text-xs">et Sécurité Alimentaire</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs uppercase">Service National de Semences</p>
                <p className="text-xs">SENASEM</p>
              </div>
              <img 
                src="/senasem.jpg" 
                alt="SENASEM" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">DEMANDE D'AGRÉMENT EN QUALITÉ D'AGRIMULTIPLICATEUR</h1>
            <p className="text-lg mt-2">N° {multiplier.requestNumber}</p>
            <div className="mt-4">{getStatusBadge(multiplier.status)}</div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold border-b pb-2 mb-4">Information sur le Candidat</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Type d'Entité</p>
                  <p className="font-medium">
                    {multiplier.entityType === 'cooperative' ? 'Coopérative' : 
                     multiplier.entityType === 'company' ? 'Entreprise' : 'Individuel'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nom de l'Entité</p>
                  <p className="font-medium">{multiplier.entityName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nom du Responsable</p>
                  <p className="font-medium">{multiplier.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Adresse</p>
                  <p className="font-medium">{multiplier.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="font-medium">{multiplier.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{multiplier.email}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold border-b pb-2 mb-4">Localisation</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Localité</p>
                  <p className="font-medium">{multiplier.location.locality}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Secteur</p>
                  <p className="font-medium">{multiplier.location.sector}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Territoire</p>
                  <p className="font-medium">{multiplier.location.territory}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">District</p>
                  <p className="font-medium">{multiplier.location.district}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Province</p>
                  <p className="font-medium">{multiplier.location.province}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold border-b pb-2 mb-4">Critères d'Éligibilité</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Site sur terrain</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Propriété</p>
                      <p className="font-medium">{multiplier.siteInfo.hasLocation ? 'Oui' : 'Non'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Superficie disponible</p>
                      <p className="font-medium">{multiplier.siteInfo.surfaceArea} ha</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Accessibilité du site</p>
                      <p className="font-medium">{multiplier.siteInfo.isAccessible ? 'Oui' : 'Non'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Aspect technique</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Personnel technique disponible</p>
                      <p className="font-medium">{multiplier.technicalAspects.hasTechnicalStaff ? 'Oui' : 'Non'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Respect de la réglementation</p>
                      <p className="font-medium">{multiplier.technicalAspects.respectsRegulations ? 'Oui' : 'Non'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold border-b pb-2 mb-4">Expérience Agricole</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Types de cultures réalisées</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Maraîcher</p>
                      <p className="font-medium">{multiplier.agriculturalExperience.crops.vegetable ? 'Oui' : 'Non'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pérenne</p>
                      <p className="font-medium">{multiplier.agriculturalExperience.crops.perennial ? 'Oui' : 'Non'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vivier</p>
                      <p className="font-medium">{multiplier.agriculturalExperience.crops.vineyard ? 'Oui' : 'Non'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Installations techniques</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Formation en technologie semencière</p>
                      <p className="font-medium">{multiplier.technicalCriteria.hasSeedTechnology ? 'Oui' : 'Non'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Installations de conditionnement</p>
                      <p className="font-medium">{multiplier.technicalCriteria.hasConditioningFacilities ? 'Oui' : 'Non'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold border-b pb-2 mb-4">Gestion et Financement</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Source de financement</p>
                  <p className="font-medium">
                    {multiplier.funding.source === 'own' ? 'Fonds propres' :
                     multiplier.funding.source === 'credit' ? 'Crédit' : 
                     multiplier.funding.details || 'Autre'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Plan d'exploitation</p>
                  <p className="font-medium">{multiplier.operationManagement.hasOperationPlan ? 'Oui' : 'Non'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gestion des stocks</p>
                  <p className="font-medium">{multiplier.operationManagement.hasStorageFacilities ? 'Oui' : 'Non'}</p>
                </div>
              </div>
            </section>

            

            <div className="mt-8 pt-4 border-t">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">Date de la demande:</p>
                  <p className="font-medium">
                    {format(new Date(multiplier.createdAt), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Signature du Coordinateur</p>
                  <div className="h-16"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AgriMultiplierDetailsModal;