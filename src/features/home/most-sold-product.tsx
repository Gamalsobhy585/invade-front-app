import { useTranslation } from "react-i18next";

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
const BASE_URL = import.meta.env.VITE_BASE_Image_URL.replace(/\/+$/, "");

function MostSoldProduct({ product }: { product: MostSoldProductsProps }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border p-3 flex justify-between my-4 items-center">
      <div className="w-[20%]">
        <img
          src={`${BASE_URL}/storage/${product.image}`}
          className="w-full h-[70px] object-contain"
        />
      </div>
      <div className="w-[20%] text-center border-l py-4">
        <h3 className="text-[#00000099] font-semibold text-lg pb-3">
          {product.name}
        </h3>
        <h4 className="text-base font-semibold">
          {product.total_revenue} {t("home.EGP")}
        </h4>
      </div>
      <div className="w-[20%] text-center border-l py-4">
        <h3 className="text-[#00000099] font-semibold text-lg pb-3">
          {t("home.category")}
        </h3>
        <h4 className="text-base font-semibold">{product.category_name}</h4>
      </div>
      <div className="w-[20%] text-center border-l py-4">
        <h3 className="text-[#00000099] font-semibold text-lg pb-3">
          {t("home.soldQty")}
        </h3>
        <h4 className="text-base font-semibold text-primary">
          {product.total_quantity_sold}
        </h4>
      </div>
      <div className="w-[20%] text-center py-4">
        <h3 className="text-[#00000099] font-semibold text-lg pb-3">
          {t("home.vendor")}
        </h3>
        <h4 className="text-base font-semibold">{product.vendor_name}</h4>
      </div>
    </div>
  );
}

export default MostSoldProduct;
