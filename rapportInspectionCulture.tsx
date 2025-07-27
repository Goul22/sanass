import React from 'react';
import ReportLayout from '../ui/ReportLayout';

interface Props {
  data: any;
}

export default function RapportInspectionCulture({ data }: Props) {
  return (
    <ReportLayout title="RAPPORT D’INSPECTION DES CULTURES">
      {/* TABLEAU */}
      <table className="table-fixed w-full border border-collapse border-gray-500 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-400 bg-gray-200 py-2 align-baseline text-xs">
              <h3 className="font-bold text-[18px] text-center uppercase">
                <span className="block">
                  {" "}
                  RAPPORT D’INSPECTION DES CULTURES
                </span>
                <span className="block text-[16px]">
                  N°…..…/COORDPROV/….. ../SENASEM/AGRI/20…
                </span>
              </h3>
            </th>
          </tr>
        </thead>
        <thead>
          <tr>
            <th className="border border-gray-400 bg-gray-200 p-1 align-baseline text-xs">
              <h4 className="font-bold text-[16px] text-center uppercase">
                <span className="block">
                  DENTIFICATION DE L’EXPLOITATION SEMENCIERE
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
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">
                      Type<sup>3</sup> :
                    </span>
                    <p className="font-medium">{data?.type || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">
                      Secteur<sup>4</sup> :
                    </span>
                    <p className="font-medium">{data?.secteur || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">Noms :</span>
                    <p className="font-medium">{data?.noms || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">Adresse :</span>
                    <p className="font-medium">{data?.adresse || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">Code :</span>
                    <p className="font-medium">{data?.codeEntite || 'N/A'}</p>
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
                  RENSEIGNEMENTS SUR LE SITE D’EXPLOITATION
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
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">
                      Nombre de champs visités<sup>3</sup> :
                    </span>
                    <p className="font-medium">{data?.nombreChampsVisites || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">N° du champ :</span>
                    <p className="font-medium">{data?.numeroChamp || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">
                      Type de visite<sup>6</sup> :
                    </span>
                    <p className="font-medium">{data?.typeVisite || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">Densité :</span>
                    <p className="font-medium">{data?.densite || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">
                      Nombre de champs agréés :
                    </span>
                    <p className="font-medium">{data?.nombreChampsAgrees || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">Densité :</span>
                    <p className="font-medium">{data?.densite2 || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">
                      Nombre de champs agréés :
                    </span>
                    <p className="font-medium">{data?.nombreChampsAgrees2 || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">Période de semis :</span>
                    <p className="font-medium">{data?.periodeSemis || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">
                      Nombre de champs refusés<sup>7</sup> :
                    </span>
                    <p className="font-medium">{data?.nombreChampsRefuses || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">
                      Production attendue(Kg) :
                    </span>
                    <p className="font-medium">{data?.productionAttendue || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">Précédent cultural :</span>
                    <p className="font-medium">{data?.precedentCultural || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">Observations :</span>
                    <p className="font-medium">{data?.observations || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">Nom de l'inspecteur :</span>
                    <p className="font-medium">{data?.nomInspecteur || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">Date d'inspection :</span>
                    <p className="font-medium">{data?.dateInspection ? new Date(data.dateInspection).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="flex  items-center gap-1">
                    <span className="text-[12px]">Amendements du sol :</span>
                    <p className="font-medium">{data?.amendementsSol || 'N/A'}</p>
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
                <span className="block">IDENTIFICATION DES CHAMPS AGREES</span>
              </h4>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 p-1 align-baseline h-[70px] text-[13px]">
              <p className="font-medium">{data?.observations || 'N/A'}</p>
            </td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th className="border border-gray-400 bg-gray-200 py-2 align-baseline text-xs">
              <h4 className="font-bold text-[16px] text-center uppercase">
                <span className="block">DECISION DE L’INSPECTEUR OFFICIEL</span>
              </h4>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 p-1 text-[13px] align-baseline h-[60px]">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12">
                  <p className="font-medium">
                    Conformément aux textes du « Règlement Technique de la
                    Production, du Contrôle et de la Certification des Semences
                    des Principales Cultures Vivrières », seuls les champs
                    identifiés ci-dessus sont agréés et déclarés conformes et
                    leurs récoltes peuvent avoir droit à la qualification de
                    semences. Les autres champs sont refusés à la multiplication
                    de semences et par conséquent indexés ; leurs récoltes
                    seront destinées à la consommation.
                  </p>
                </div>
                <div className="col-span-12">
                  <p className="text-center font-medium">
                    Fait à……………………..le,…….…………..
                  </p>
                </div>
                <div className="col-span-6">
                  <span className="text-[12px] block">Exploitant semencier </span>
                  <p className="font-medium mb-4">(Nom et Signature)</p>
                </div>
                <div className="col-span-6">
                  <span className="text-[12px] text-center block">Exploitant semencier </span>
                  <p className="font-medium text-center mb-4">(Nom et Signature)</p>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </ReportLayout>
  );
}
