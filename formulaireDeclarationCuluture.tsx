import React from 'react';
import ReportLayout from '../ui/ReportLayout';

interface Props {
  data: any;
}

export default function FormulaireDeclarationCuluture({ data }: Props) {
  return (
    <ReportLayout title="FORMULAIRE DE DECLARATION DE CULTURE">
      {/* TABLEAU */}
      <table className="table-fixed w-full border border-collapse border-gray-500 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-400 py-2 align-baseline text-xs">
              <h3 className="font-bold text-[18px] text-center uppercase">
                <span className="block">
                  {" "}
                  FORMULAIRE DE DECLARATION DE CULTURE
                </span>
                <span className="block">
                  N°…..…/COORDPROV/….. ../SENASEM/AGRI/20…
                </span>
              </h3>
            </th>
          </tr>
        </thead>
        <thead>
          <tr>
            <th className="border border-gray-400 py-2 align-baseline text-xs">
              <h4 className="font-bold text-[16px] text-center uppercase">
                <span className="block">
                  IDENTIFICATION DU PRODUCTEUR DE SEMENCES
                </span>
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
                    <span className="text-[12px]">Nom et Post-nom</span>
                    <span>:</span>
                  </div>
                </div>
                <div className="col-span-6">
                  <h6 className="font-semibold">{data?.nomEtPostnom || 'N/A'}</h6>
                </div>
                <div className="col-span-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px]">Nom de l’Etablissement </span>
                    <span>:</span>
                  </div>
                </div>
                <div className="col-span-6">
                  <h6 className="font-semibold">{data?.nomEntite || 'N/A'}</h6>
                </div>
                <div className="col-span-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px]">Adresse </span>
                    <span>:</span>
                  </div>
                </div>
                <div className="col-span-6">
                  <h6 className="font-semibold">{data?.adresse || 'N/A'}</h6>
                </div>
                <div className="col-span-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px]">Code de l’Etablissement </span>
                    <span>:</span>
                  </div>
                </div>
                <div className="col-span-6">
                  <h6 className="font-semibold">{data?.codeEntite || 'N/A'}</h6>
                </div>
                <div className="col-span-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px]">Catégorie professionnelle </span>
                    <span>:</span>
                  </div>
                </div>
                <div className="col-span-6">
                  <h6 className="font-semibold">{data?.categorieProfessionnelle || 'N/A'}</h6>
                </div>
                <div className="col-span-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px]">Secteur </span>
                    <span>:</span>
                  </div>
                </div>
                <div className="col-span-6">
                  <h6 className="font-semibold">{data?.secteur || 'N/A'}</h6>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th className="border border-gray-400 py-2 align-baseline text-xs">
              <h4 className="font-bold text-[16px] text-center uppercase">
                <span className="block">INFORMATION SUR LA SEMENCE-MERE</span>
              </h4>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 p-1 text-[13px]">
              <div className="grid grid-cols-12 gap-1">
                <div className="col-span-6">
                  <div className="grid grid-cols-12 gap-1 items-center">
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">1. Espèce</span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.culture || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">2. variété</span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.variete || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">3. Catégorie</span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.categorie || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">4. Génération</span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.generation || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">5. Origine</span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.origine || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">6. Date de réception </span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.dateReception || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="grid grid-cols-12 gap-1 items-center">
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">7. Année de production</span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.anneeProduction || data?.annee || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">8. Saison de production</span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.saisonProduction || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">9. Identification du lot</span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.identificationLot || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">10. Quantité utilisée </span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.quantiteUtilisee || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">11. Teneur en eau </span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.teneurEnEau || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">12. Pouvoir Germinatif</span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.pouvoirGerminatif || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th className="border border-gray-400 py-2 align-baseline text-xs">
              <h4 className="font-bold text-[16px] text-center uppercase">
                <span className="block">INFORMATION SUR LA CULTURE DECLAREE</span>
              </h4>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 p-1 text-[13px]">
              <div className="grid grid-cols-12 gap-1">
                <div className="col-span-5">
                  <div className="grid grid-cols-12 gap-1 items-center">
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">1. Localisation du champ</span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.localisationChamp || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">2. N° du champ</span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.numeroChamp || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">3. Précédent cultural </span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.precedentCultural || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">4. Superficie déclarée</span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.superficie || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">5. Distance d’isolement </span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.distanceIsolement || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">6. Ecartement  </span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.ecartement || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">7. Densité</span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.densite || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-7">
                  <div className="grid grid-cols-12 gap-1">
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">8. Catégorie </span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.classeSemence || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">9. Période de semis/plantation </span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.periodeSemis || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">10. Période de récolte prévue</span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.periodeRecoltePrevue || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">11. Production attendue </span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.productionAttendue || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">12. Traitements phytosanitaires </span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.traitementsPhytosanitaires || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">13. Données GPS</span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.donneesGPS || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px]">14. Amendements du sol </span>
                        <span>:</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{data?.amendementsSol || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th className="border border-gray-400 py-2 px-2 align-baseline text-xs">
             <div className="flex gap-1">
             <h4 className="font-bold text-[16px] text-start uppercase flex-none">
                <span className="block">AUTRES RENSEIGNEMENTS : </span>
              </h4>
              <p className="font-normal text-start">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed voluptatibus, animi repellendus tempora illum blanditiis. Reiciendis quod exercitationem a delectus dignissimos sint, mollitia quidem nobis officiis, dolore qui eaque sunt.</p>
             </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 p-1 text-[13px] h-[90px] align-baseline">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12">
                  <p className="font-semibold">Fait à Kinshasa, le 22 juin 2025</p>
                </div>
                <div className="col-span-6">
                  <span className="text-[12px]">Visa de l’autorité de contrôle </span>
                </div>
                <div className="col-span-6">
                  <span className="text-[12px] block text-end">Etablissement /Agri multiplicateur</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </ReportLayout>
  );
}
