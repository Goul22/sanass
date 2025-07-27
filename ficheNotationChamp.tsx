import React from 'react';
import ReportLayout from '../ui/ReportLayout';

interface Props {
  data: any;
}

export default function FicheNotationChamp({ data }: Props) {
  console.log('Data received by FicheNotationChamp:', data);
  return (
    <ReportLayout title="FICHE DES NOTATIONS AU CHAMP">
      {/* TABLEAU */}
      <table className="table-fixed w-full border border-collapse border-gray-500 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-400 bg-gray-200 py-2 align-baseline text-xs">
              <h3 className="font-bold text-[18px] text-center uppercase">
                <span className="block"> FICHE DES NOTATIONS AU CHAMP</span>
                <span className="block text-[16px]">
                  N° …..…/COORD ………./SENASEM/AGRI/20……
                </span>
              </h3>
            </th>
          </tr>
        </thead>
        <thead>
          <tr>
            <th className="border border-gray-400 p-1 bg-gray-200 align-baseline text-xs">
              <h4 className="font-bold text-[17px] text-start uppercase">
                <span className="block">PROVINCE DE :</span>
              </h4>
            </th>
          </tr>
        </thead>
        <thead>
          <tr>
            <th className="border border-gray-400 bg-gray-200 p-1 align-baseline text-xs">
              <h4 className="font-bold text-[16px] text-center uppercase">
                <span className="block">IDENTIFICATION DU PRODUCTEUR</span>
              </h4>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 p-1 text-[13px]">
              <div className="grid grid-cols-12 gap-1">
                <div className="col-span-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px]">
                      Nom et adresse du producteur
                    </span>
                    <span>:</span>
                  </div>
                </div>
                <div className="col-span-6">
                  <h6 className="font-semibold">{data?.nomEtAdresseProducteur || 'N/A'}</h6>
                </div>
                <div className="col-span-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px]">
                      Localisation du site d’exploitation
                    </span>
                    <span>:</span>
                  </div>
                </div>
                <div className="col-span-6">
                  <h6 className="font-semibold">{data?.localisationSite || 'N/A'}</h6>
                </div>
                <div className="col-span-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px]">
                      Numéro d’identification de la parcelle contrôlée{" "}
                    </span>
                    <span>:</span>
                  </div>
                </div>
                <div className="col-span-6">
                  <h6 className="font-semibold">{data?.numeroIdentificationParcelle || 'N/A'}</h6>
                </div>
                <div className="col-span-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px]">
                      Numéro de la déclaration des cultures de la parcelle{" "}
                    </span>
                    <span>:</span>
                  </div>
                </div>
                <div className="col-span-6">
                  <h6 className="font-semibold">{data?.numeroDeclarationCulture || 'N/A'}</h6>
                </div>
                <div className="col-span-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px]">
                      La déclaration des cultures établie par{" "}
                    </span>
                    <span>:</span>
                  </div>
                </div>
                <div className="col-span-6">
                  <h6 className="font-semibold">{data?.nomEntite || 'N/A'}</h6>
                </div>
                <div className="col-span-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px]">Date de l’inspection </span>
                    <span>:</span>
                  </div>
                </div>
                <div className="col-span-6">
                  <h6 className="font-semibold">{data?.dateInspection ? new Date(data.dateInspection).toLocaleDateString() : 'N/A'}</h6>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th className="border border-gray-400 bg-gray-200 py-2 align-baseline text-xs">
              <h4 className="font-bold text-[16px] text-center uppercase">
                <span className="block">
                  RENSEIGNEMENTS SUR LA PARCELLE CONTROLEE
                </span>
              </h4>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 p-1 text-[13px]">
              <div className="grid grid-cols-12 gap-1 items-center">
                <div className="col-span-6">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Espèce:</span>
                    <p className="font-semibold">{data?.culture || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Variété:</span>
                    <p className="font-semibold">{data?.variete || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Période de semis:</span>
                    <p className="font-semibold">{data?.periodeSemis || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Catégorie:</span>
                    <p className="font-semibold">{data?.classeSemence || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Superficie déclarée (ha):</span>
                    <p className="font-semibold">{data?.superficie || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Période de récolte:</span>
                    <p className="font-semibold">{data?.periodeRecolte || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Densité de plantes:</span>
                    <p className="font-semibold">{data?.densitePlantes || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Dose de semis:</span>
                    <p className="font-semibold">{data?.doseSemis || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Stade de la végétation:</span>
                    <p className="font-semibold">{data?.stadeVegetation || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Production attendue (Kg):</span>
                    <p className="font-semibold">{data?.productionAttendue || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Origine de la semence-mère:</span>
                    <p className="font-semibold">{data?.origineSemenceMere || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Catégorie de la semence-mère:</span>
                    <p className="font-semibold">{data?.categorieSemenceMere || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th className="border border-gray-400 bg-gray-200 py-2 align-baseline text-xs">
              <h4 className="font-bold text-[16px] text-center uppercase">
                <span className="block">
                VERIFICATION AU CHAMP
                </span>
              </h4>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 p-1 text-[13px]">
              <div className="grid grid-cols-12 gap-1 items-center">
                <div className="col-span-12">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Précédent cultural :</span>
                    <p className="font-semibold">{data?.precedentCultural || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Isolement (m) :</span>
                    <p className="font-semibold">{data?.isolement || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Stade de croissance et état général de la culture :</span>
                    <p className="font-semibold">{data?.stadeCroissance || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Etat général de la culture :</span>
                    <p className="font-semibold">{data?.etatGeneralCulture || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Action phytosanitaire :</span>
                    <p className="font-semibold">{data?.actionPhytosanitaire || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Mauvaises herbes (les nommer et %) :</span>
                    <p className="font-semibold">{data?.mauvaisesHerbes || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Plante cultivées d’autres espèces (les nommer et %) :</span>
                    <p className="font-semibold">{data?.plantesCultiveesAutresEspeces || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Plantes adventices (les nommer et %) :</span>
                    <p className="font-semibold">{data?.plantesAdventices || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px]">Maladie (s) identifiée (s) et/ou suspectée (s) (spécifier les symptômes) :</span>
                    <p className="font-semibold">{data?.maladies || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th className="border border-gray-400 bg-gray-200 py-2 align-baseline text-xs">
              <h4 className="font-bold text-[16px] text-center uppercase">
                <span className="block">
                AUTRES OBSERVATIONS ET REMARQUES
                </span>
              </h4>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 p-1 text-[13px] align-baseline h-[60px]">
            <p className="font-semibold">{data?.autresObservations || 'N/A'}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </ReportLayout>
  );
}
