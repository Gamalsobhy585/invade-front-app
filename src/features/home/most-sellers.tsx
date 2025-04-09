import MostSeller from "./most-seller";
import { useTranslation } from "react-i18next";

interface TopVendorsProps {
  id: number;
  name: string;
  email: string;
  store_name?: string;
  total_orders?: number;
  total_sales?: string | number;
}

function MostSellers({ data }: { data: TopVendorsProps[] }) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-lg shadow-lg px-6 py-4 w-[33%]">
      <h3 className="text-2xl font-semibold pb-5">{t("home.mostSellers")}</h3>
      <div className="max-h-[500px] overflow-y-auto">
        {data?.map((vendors: TopVendorsProps) => (
          <div key={vendors.id}>
            <MostSeller vendors={vendors} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MostSellers;
