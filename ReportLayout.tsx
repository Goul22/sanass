import React from 'react';

interface Props {
  children: React.ReactNode;
  title: string;
  reportNumber: string;
}

export default function ReportLayout({ children, title, reportNumber }: Props) {
  return (
    <div className="p-[37px] bg-white w-[795px] mx-auto max-w-[100%] min-h-[1122px] card-table relative">
      {/* EN-TÊTE */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-9">
          <img src="/public/minis.jpeg" alt="logo" className="w-[270px]" />
        </div>
        <div className="col-span-3">
          <div className="flex justify-center">
            <img src="/public/indice.jpeg" alt="logo" className="w-[70px]" />
          </div>
        </div>
        <div className="col-span-12 text-center">
          <span className="leading-[100%] text-[#7d9c64] font-bold text-[13px] block">
            SERVICE NATIONAL DE SEMENCES
          </span>
          <span className="leading-[100%] text-[13px] block font-bold">
            {"Laboratoire National d'essais de Semences"}
          </span>
        </div>
      </div>
      {/* TABLEAU */}
      <table className="table-fixed w-full border border-collapse border-gray-500 mt-4">
        <thead>
          <tr>
            <th className="border border-gray-400 bg-gray-200 py-2 align-baseline text-xs">
              <h3 className="font-bold text-[18px] text-center uppercase">
                <span className="block">{title}</span>
                <span className="block text-[16px]">
                  {reportNumber}
                </span>
              </h3>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 p-1 text-[13px]">
              {children}
            </td>
          </tr>
        </tbody>
      </table>
      {/* FOOTER */}
      <div className="footer absolute left-0 bottom-0 w-full px-[34px] pb-10">
        <div className="bar w-full flex">
          <img src="/public/bar.png" alt="image" className="w-full" />
        </div>
        <p className="text-center text-xs font-bold mt-2">
          {"Croisement du Boulevard du 30 juin et de l'avenue Batetela,"} <br />{" "}
          Commune de la Gombe, Kinshasa RDC.
        </p>
      </div>
    </div>
  );
}