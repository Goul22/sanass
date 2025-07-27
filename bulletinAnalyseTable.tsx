import { QRCodeSVG } from 'qrcode.react';

interface BulletinAnalyseTableProps {
  data: {
    id: number;
    referenceNumber: string;
    cropType: string;
    species: string;
    variety: string;
    scientificName: string;
    productionYear: string;
    productionSeason: string;
    province: string;
    status: string;
    teContent: string;
    pureSeed: string;
    inertMatter: string;
    otherSeeds: string;
    thousandGrainWeight: string;
    normalSeedlings: string;
    abnormalSeedlings: string;
    hardSeeds: string;
    freshSeeds: string;
    deadSeeds: string;
    samplingDate: string;
    analysisStartDate: string;
    analysisEndDate: string;
    sampler: string;
    structure: string;
    site: string;
    territory: string;
    sampleWeight: string;
    batchWeight: string;
    bulletinNumber: string;
    classification: string;
    calculatedPackaging?: string;
    receptionDate: string; // Add this line
  };
}

export default function BulletinAnalyseTable({ data }: BulletinAnalyseTableProps) {
  // Define qrCodeData with relevant information
  const qrCodeData = `${data.referenceNumber}|${data.species}|${data.variety}|${data.productionYear}`;
  
  // Extract order number and year
  const orderNumber = data.referenceNumber.slice(-2);
  const year = new Date(data.receptionDate).getFullYear();

  return (
    <div className="p-[37px] bg-white w-[795px] mx-auto max-w-[100%] min-h-[1122px] card-table relative shadow-lg border border-gray-200">
      {/* EN-TÊTE AVEC DEUX IMAGES */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-9">
          <img src="public/minis.jpeg" alt="logo" className="w-[270px]" />
        </div>
        <div className="col-span-3 relative">
          <div className="flex justify-center">
            <img src="public/indice.jpeg" alt="logo" className="w-[70px]" />
          </div>
        
        
        </div>
        <div className="col-span-12 text-center mb-6">
          <span className="leading-[100%] text-[#7d9c64] font-bold text-lg block">
            SERVICE NATIONAL DE SEMENCES
          </span>
          <span className="leading-[100%] text-md block font-bold text-gray-700">
            {"Laboratoire National d'essais de Semences"}
          </span>
          <div className="h-[2px] bg-green-100 w-1/2 mx-auto mt-2"></div>
        </div>
      </div>
      
      {/* Add QR code component */}
     
      {/* EN-TÊTE */}
      
      
      {/* INFORMATIONS SUR LE REQUÉRANT */}
      <h2 className="font-bold text-[22px] text-center mb-2 mt-2 text-blue-800">
        {"BULLETIN D'ANALYSES Nº"} {orderNumber} / {year}</h2>
      <table className="table-fixed w-full border-2 border-collapse border-gray-400 shadow-sm">
        <thead>
          <tr>
            <th
              className="border border-gray-400 px-1 align-baseline text-xs"
              colSpan={5}
            >
              <h3 className="font-bold text-[16px] text-center underline">
                RÉSULTATS DES ANALYSES
              </h3>
              <p className="text-start font-normal">
                Nom du requérant : 
                <span className="font-bold">{data.sampler}</span>
              </p>
              <p className="text-start font-normal">
                Espèce, cultivar (variété), catégorie, poids du lot: 
                <span className="font-bold">
                  {data.species}; {data.variety} ; {data.classification} ; {data.batchWeight}{data.batchWeight && !data.batchWeight.toLowerCase().includes('kg') ? ' Kg' : ''}
                </span>
              </p>
              <p className="text-start font-normal">
                Numéro du lot :<span className="font-bold">{data.referenceNumber || data.bulletinNumber}</span>
              </p>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 p-1 text-xs">
              Nombre et poids
              <br />
              {"moyen de l'emballage"}
            </td>
            <td className="border border-gray-400 p-1 text-xs">
               Echantillon
              <br />
              reçu le :
            </td>
            <td className="border border-gray-400 p-1 text-xs">
             

              Echantillonnage
              <br />
              effectué le : 
            </td>
            <td className="border border-gray-400 p-1 text-xs">
              Analyse
              <br />
              terminée le :
            </td>
            <td className="border border-gray-400 p-1 text-xs">
              N° de laboratoire
            </td>
          </tr>
          <tr>
            <td className="border border-gray-400 p-1 text-xs font-bold text-center">
              {data.calculatedPackaging || data.packagingCalculation || 'Non calculé'}
            </td>
            <td className="border border-gray-400 p-1 text-xs font-bold text-center">
            {data.analysisStartDate}
            </td>
            <td className="border border-gray-400 p-1 text-xs font-bold text-center">
              
                {data.samplingDate}
            </td>
            <td className="border border-gray-400 p-1 text-xs font-bold text-center">
              {data.analysisEndDate}
            </td>
            <td className="border border-gray-400 p-1 text-xs font-bold text-center">
                {data.referenceNumber}
            </td>
          </tr>
        </tbody>
      </table>
      
      {/* RÉSULTATS DES ANALYSES */}
      <h3 className="font-bold text-center mb-4 underline mt-3">
        RÉSULTATS DES ANALYSES
      </h3>
      <div className="flex flex-col justify-center items-center relative z-10 my-6">
        <img
          src="/public/indice.jpeg"
          alt="logo"
          className="absolute z-[-1] w-[200px] opacity-20"
        />
        <table className="table-fixed w-full border border-collapse border-gray-500">
          <thead className="text-center">
            <tr>
              <th className="border border-gray-400 p-1 text-xs" colSpan={3}>
                PURETÉ
                <br />% en poids
              </th>
              <th
                className="border border-gray-400 text-xs align-baseline"
                colSpan={6}
              >
                <div className="flex flex-col h-full">
                  <div className="items border-b border-gray-400 p-1">
                    GERMINATION (% en nombre)
                  </div>
                  <div className="items border-b border-gray-400 p-1 text-start">
                    4 X 100semences : Pré-réfrigération :0 jour ; KNO:: NO^
                  </div>
                  <div className="items p-1 text-start">TP : T° ambiante°C</div>
                </div>
              </th>
              <th className="border border-gray-400 p-1 text-xs" colSpan={1}>
                TENUE EN EAU
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 p-1 text-xs h-[100px] align-baseline">
                Semences pures:
              </td>
              <td className="border border-gray-400 p-1 text-xs h-[100px] align-baseline">
                Matières inertes:
              </td>
              <td className="border border-gray-400 p-1 text-xs h-[100px] align-baseline">
                {"Semences d'autres espèces:"}
              </td>
              <td className="border border-gray-400 p-1 text-xs h-[100px] align-baseline">
                Nombre de jours:
              </td>
              <td className="border border-gray-400 p-1 text-xs h-[100px] align-baseline">
                Germes normaux:
              </td>
              <td className="border border-gray-400 p-1 text-xs h-[100px] align-baseline">
                Graines dures:
              </td>
              <td className="border border-gray-400 p-1 text-xs h-[100px] align-baseline">
                Graines fraiches:
              </td>
              <td className="border border-gray-400 p-1 text-xs h-[100px] align-baseline">
                Germes anormaux:
              </td>
              <td className="border border-gray-400 p-1 text-xs h-[100px] align-baseline">
                Semences mortes:
              </td>
              <td className="border border-gray-400 p-1 text-xs h-[100px] align-baseline">
                (\% en poids humide):
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 bg-gray-400 p-1 text-xs text-center font-bold">
                {data.pureSeed}
              </td>
              <td className="border border-gray-400 p-1 text-xs text-center font-bold">
                {data.inertMatter}
              </td>
              <td className="border border-gray-400 p-1 text-xs text-center font-bold">
                {data.otherSeeds}
              </td>
              <td className="border border-gray-400 p-1 text-xs text-center font-bold">
                7
              </td>
              <td className="border border-gray-400 p-1 text-xs text-center font-bold bg-gray-400">
                {data.normalSeedlings}
              </td>
              <td className="border border-gray-400 p-1 text-xs text-center font-bold">
                {data.hardSeeds}
              </td>
              <td className="border border-gray-400 p-1 text-xs text-center font-bold">
                {data.freshSeeds}
              </td>
              <td className="border border-gray-400 p-1 text-xs text-center font-bold ">
                {data.abnormalSeedlings}
              </td>
              <td className="border border-gray-400 p-1 text-xs text-center font-bold">
                {data.deadSeeds}
              </td>
              <td className="border border-gray-400 p-1 text-xs text-center font-bold bg-gray-400">
                {data.teContent}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 mb-3 px-6">
        <p className="text-xs">
          <strong>Nature des matières inertes :</strong> R.A.S.
        </p>
      </div>

      {/* AUTRES DÉTERMINATIONS */}

      <table className="table-fixed w-full border border-collapse border-gray-500">
        <thead>
          <tr>
            <th className="border border-gray-400 px-1 align-baseline text-xs text-start w-1/2">
              Nombre et poids <br />
              {"moyen de l'emballage"}
            </th>
            <th className="border border-gray-400 px-1 align-baseline text-xs text-start w-1/2">
              <div className="text-sm font-bold">
                {data.calculatedPackaging || data.packagingCalculation || 'Non calculé'}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Calcul automatique d'emballage
              </div>
            </th>
          </tr>
        </thead>
      </table>
     <div className="px-6">
       <h3 className="font-bold text-center">
         AUTRES DÉTERMINATIONS / OBSERVATIONS: SONDAGE.
       </h3>
       <p className="text-xs mb-1">
         <strong>Classification : {data.classification}.</strong>
       </p>
     </div>
      <table className="table-fixed w-full border border-collapse border-gray-500">
        <thead>
          <tr>
            <th className="border border-gray-400 px-1 align-baseline text-xs text-center">
              SENASEM
            </th>
            <th className="border border-gray-400 px-1 align-baseline text-xs text-center">
              Date :
              <br />
              {data.analysisEndDate}
            </th>
            <th className="border border-gray-400 px-1 align-baseline text-xs text-center h-[60px] relative">
              <div className="flex justify-between items-start h-full">
                <span className="flex-1">Signature du Coordonnateur National</span>
              
               
              </div>
            </th>
          </tr>
        </thead>
      </table>


      
          
      {/* NOTE DE VALIDITÉ */}
      <div className="px-6">
        <p className="text-[11px] italic">
          <strong>NB</strong> : la validité des résultats d'analyses est de{" "}
          <strong className="text-red-500">45 jours</strong> à partir de la date
          d'émission du bulletin d\'analyse.
        </p>
        <div className="grid grid-cols-12">
        <div className="col-span-10">
        
        <hr className="w-[30%] border-gray-400 mt-6 mb-3" />
        <ul className="flex flex-col gap-1">
          <li className="text-[11px]">1. Lorem ipsum dolor sit amet.</li>
          <li className="text-[11px]">2. Lorem ipsum dolor sit amet.</li>
          <li className="text-[11px]">3. Lorem ipsum dolor sit amet.</li>
          <li className="text-[11px]">4. Lorem ipsum dolor sit amet.</li>
          <li className="text-[11px]">5. Lorem ipsum dolor sit amet.</li>
          <li className="text-[11px]">6. Lorem ipsum dolor sit amet.</li>
        </ul>
        </div>
           <div className="col-span-2">
           
             {/* QR Code positionné en haut à droite */}
          <div className="bg-white p-2 rounded border border-gray-300 shadow-sm">
            <QRCodeSVG
              value={qrCodeData}
              size={95}
              level="M"
              includeMargin={true}
            />
            <p className="text-xs mt-2 text-center text-gray-600 font-medium">Scan pour vérification</p>
          </div>
          {/* QR Code positionné en haut à droite */}
           
           </div>
        </div>

      </div>
      

      {/* FOOTER */}
      <div className="footer absolute left-0 bottom-0 w-full px-[34px] pb-10">
        <div className="bar w-full flex">
          <img src="public/bar.png" alt="image" className="w-full" />
        </div>
        <p className="text-center text-xs font-bold mt-2">
          {"Croisement du Boulevard du 30 juin et de l'avenue Batetela,"} <br /> Commune de la Gombe, Kinshasa RDC.
        </p>
      </div>
    </div>
  );
}