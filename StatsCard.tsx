import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onViewDetails?: () => void;
  // --- NOUVELLES PROPS POUR LA COMPACITÉ ET LA FLEXIBILITÉ ---
  compact?: boolean; // Pour activer un mode compact (par défaut: false)
  subValues?: { label: string; value: string | number; color?: string }[]; // Pour afficher des valeurs secondaires
  children?: React.ReactNode; // Pour un contenu entièrement personnalisé
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  onViewDetails,
  compact = false, // Valeur par défaut
  subValues,
  children
}) => {
  return (
    <motion.div
      // Ajustement des paddings et de la bordure en fonction de `compact`
      className={`relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${compact ? 'p-4' : 'p-6'} border border-gray-100 overflow-hidden`}
      whileHover={{ y: -6, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', transition: { duration: 0.2 } }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className={`flex ${compact ? 'justify-center' : 'justify-between'} items-center gap-3 mb-3`}>
        {/* Taille de l'icône et padding ajustés */}
        <div className={`p-2 rounded-full transition-colors duration-200 ${compact ? 'bg-primary-50 text-primary-600' : 'bg-primary-50 hover:bg-primary-100'} ${compact ? 'shadow-sm' : 'shadow-md'}`}>
          {/* L'icône elle-même peut être stylisée ici ou via les props de l'icône */}
          {React.cloneElement(icon as React.ReactElement, { 
              className: `w-${compact ? '5' : '6'} h-${compact ? '5' : '6'} ${
                  (icon as React.ReactElement).props.className || '' // Garde les classes existantes
              }` 
          })}
        </div>

        {/* Bouton Voir détails déplacé ou ajusté si compact */}
        {onViewDetails && !compact && ( // Masquer en mode compact pour éviter la surcharge
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewDetails}
            className="text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200 font-medium flex items-center"
          >
            Voir détails
            <ChevronRight className="w-4 h-4 ml-1" />
          </motion.button>
        )}
      </div>

      <div className="text-center">
        {/* Taille de titre ajustée */}
        <p className={`font-medium ${compact ? 'text-xs text-gray-500' : 'text-sm text-gray-600'}`}>{title}</p>
        
        {/* Contenu personnalisé via children (prioritaire) */}
        {children ? (
          <div className="mt-1">
            {children}
          </div>
        ) : (
          <>
            {/* Taille de valeur ajustée */}
            <p className={`font-extrabold text-gray-900 ${compact ? 'text-2xl' : 'text-3xl'} mt-1`}>{value}</p>
            
            {/* Affichage des sous-valeurs si présentes */}
            {subValues && subValues.length > 0 && (
              <div className={`mt-2 ${compact ? 'space-y-0.5' : 'space-y-1'}`}>
                {subValues.map((sub, index) => (
                  <div key={index} className="flex justify-center items-baseline gap-1 text-xs">
                    <span className={`text-gray-500 ${sub.color || ''}`}>{sub.label}:</span>
                    <span className={`font-semibold ${sub.color || 'text-gray-800'}`}>{sub.value}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Trend ajusté pour le mode compact */}
            {trend && trendValue && (
              <div className={`flex ${compact ? 'justify-center' : 'justify-start'} items-center mt-2`}>
                <span
                  className={`text-xs font-medium ${
                    trend === 'up'
                      ? 'text-green-600 bg-green-50'
                      : trend === 'down'
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-600 bg-gray-50'
                  } px-2.5 py-0.5 rounded-full text-xs`}
                >
                  {trendValue}
                </span>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Bouton Voir détails affiché après le contenu si compact et si on le souhaite */}
      {onViewDetails && compact && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewDetails}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center mt-3 mx-auto" // self-end pour aligner à droite en flex-col
        >
          Détails <ChevronRight className="w-3 h-3 ml-0.5" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default StatsCard;