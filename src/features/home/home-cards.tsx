import {
  ChevronDown,
  ChevronUp,
  ShoppingBasket,
  SquareChartGantt,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";

type UserCounterProp = {
  user_count: number;
  percentage_change: number;
};

type ProductCounterProp = {
  product_count: number;
  percentage_change: number;
};

type OrderCounterProp = {
  order_count: number;
  percentage_change: number;
};

type RevenueCountProp = {
  total: number | string;
  percentage_change: number;
};

function HomeCards({
  userCounter,
  productCounter,
  orderCounter,
  revenueCount,
}: {
  userCounter: UserCounterProp;
  productCounter: ProductCounterProp;
  orderCounter: OrderCounterProp;
  revenueCount: RevenueCountProp;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between">
      <div className="w-[24%] bg-white rounded-lg p-3">
        <div className="flex gap-x-3">
          <User
            className="p-3 w-14 h-14 bg-[#4BDF0633] rounded-full"
            stroke="#3FC700"
          />
          <div>
            <h3 className="text-xl font-semibold">{userCounter?.user_count}</h3>
            <h4 className="text-black/50 text-sm font-medium">
              {t("home.totalUsers")}
            </h4>
          </div>
        </div>
        <div className="flex justify-end">
          <h5
            className={`text-sm font-semibold flex items-center gap-1 ${
              userCounter?.percentage_change >= 0
                ? "text-[#1DAE68]"
                : "text-[#DF0612]"
            }`}
          >
            {userCounter?.percentage_change}
            %
            <ChevronUp
              className={
                userCounter?.percentage_change >= 0
                  ? ""
                  : "transform rotate-180"
              }
            />
          </h5>
        </div>
      </div>
      <div className="w-[24%] bg-white rounded-lg p-3">
        <div className="flex gap-x-3">
          <SquareChartGantt
            className="p-3 w-14 h-14 bg-[#9747FF33] rounded-full"
            stroke="#9747FF"
          />
          <div>
            <h3 className="text-xl font-semibold">
              {productCounter?.product_count}
            </h3>
            <h4 className="text-black/50 text-sm font-medium">
              {t("home.totalProducts")}
            </h4>
          </div>
        </div>
        <div className="flex justify-end">
          <h5
            className={`text-sm font-semibold flex items-center gap-1 ${
              productCounter?.percentage_change >= 0
                ? "text-[#1DAE68]"
                : "text-[#DF0612]"
            }`}
          >
            {productCounter?.percentage_change}
            %
            <ChevronUp
              className={
                productCounter?.percentage_change >= 0
                  ? ""
                  : "transform rotate-180"
              }
            />
          </h5>
        </div>
      </div>
      <div className="w-[24%] bg-white rounded-lg p-3">
        <div className="flex gap-x-3">
          <ShoppingBasket
            className="p-3 w-14 h-14 bg-[#0684DF33] rounded-full"
            stroke="#0684DF"
          />
          <div>
            <h3 className="text-xl font-semibold">
              {orderCounter?.order_count}
            </h3>
            <h4 className="text-black/50 text-sm font-medium">
              {t("home.totalOrders")}
            </h4>
          </div>
        </div>
        <div className="flex justify-end">
          <h5
            className={`text-sm font-semibold flex items-center gap-1 ${
              orderCounter?.percentage_change >= 0
                ? "text-[#1DAE68]"
                : "text-[#DF0612]"
            }`}
          >
            {orderCounter?.percentage_change}
            %
            <ChevronDown
              className={
                orderCounter?.percentage_change >= 0
                  ? "transform rotate-180"
                  : ""
              }
            />
          </h5>
        </div>
      </div>
      <div className="w-[24%] bg-white rounded-lg p-3">
        <div className="flex gap-x-3">
          <User
            className="p-3 w-14 h-14 bg-[#F2482233] rounded-full"
            stroke="#F24822"
          />
          <div>
            <h3 className="text-xl font-semibold">
              {revenueCount?.total} {t("home.EGP")}
            </h3>
            <h4 className="text-black/50 text-sm font-medium">
              {t("home.totalRevenue")}
            </h4>
          </div>
        </div>
        <div className="flex justify-end">
          <h5
            className={`text-sm font-semibold flex items-center gap-1 ${
              revenueCount?.percentage_change >= 0
                ? "text-[#1DAE68]"
                : "text-[#DF0612]"
            }`}
          >
            {revenueCount?.percentage_change}
            %
            <ChevronUp
              className={
                revenueCount?.percentage_change >= 0
                  ? ""
                  : "transform rotate-180"
              }
            />
          </h5>
        </div>
      </div>
    </div>
  );
}

export default HomeCards;
