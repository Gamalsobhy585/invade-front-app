import { useTranslation } from "react-i18next";

interface VendorProps {
  id: number;
  name: string;
  email: string;
  store_name?: string;
  total_orders?: number;
  total_sales?: string | number;
  vendor_image?: string;
}
function MostSeller({ vendors }: { vendors: VendorProps }) {
  const BASE_URL = import.meta.env.VITE_BASE_Image_URL.replace(/\/+$/, "");

  const { t } = useTranslation();
  return (
    <div key={vendors.id} className="flex justify-between items-center pb-6">
      <div className="flex gap-x-4">
        <img
          src={
            vendors.vendor_image
              ? `${BASE_URL}/storage/${vendors.vendor_image}`
              : "/avatar.webp"
          }
          className="w-[50px] h-[50px] rounded-full"
        />
        <div>
          <h3 className="text-base font-semibold">{vendors.name}</h3>
          <h4 className="text-black/50 text-xs font-medium">
            {vendors.total_orders} {t("home.product")}
          </h4>
        </div>
      </div>
      <div className="flex justify-end">
        <h5 className="text-sm font-medium text-gray-500">
          {vendors.total_sales} {t("home.EGP")}
        </h5>
      </div>
    </div>
  );
}

export default MostSeller;
