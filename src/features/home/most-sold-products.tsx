import { useTranslation } from "react-i18next";
import MostSoldProduct from "./most-sold-product";

interface MostSoldProductsProps {
  id: number;
  name: string;
  image: string;
  vendor_name: string;
  store_name?: string;
  total_quantity_sold?: string | number;
  total_revenue?: string | number;
  number_of_orders: number;
  category_name: string;
}
function MostSoldProducts({ data }: { data: MostSoldProductsProps[] }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-lg px-6 py-4 w-[65%]">
      <h3 className="text-2xl font-semibold pb-5">
        {t("home.mostSoldProduct")}
      </h3>
      <div className="max-h-[500px] overflow-y-auto">
        {data?.map((product: MostSoldProductsProps) => (
          <div key={product.id}>
            <MostSoldProduct product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MostSoldProducts;
