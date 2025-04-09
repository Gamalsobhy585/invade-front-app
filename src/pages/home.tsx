import { useTranslation } from "react-i18next";

import { Helmet } from "react-helmet";
import HomeCards from "@/features/home/home-cards";
import MostSellers from "@/features/home/most-sellers";
import MostSoldProducts from "@/features/home/most-sold-products";
import IncomeChart from "@/features/home/income-chart";
import { OrdersChart } from "@/features/home/orders-chart";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/features/home/api";

const Home = () => {
  const { i18n } = useTranslation();

  const { data } = useQuery({
    queryKey: ["getCategories"],
    queryFn: () => {
      return getDashboardData();
    },
  });

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <HomeCards
          userCounter={data?.userCounterChart}
          productCounter={data?.productCounterChart}
          orderCounter={data?.orderCountChart}
          revenueCount={data?.revenueCountChart}
        />
        <div
          className="flex justify-between pt-4"
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
          <MostSellers data={data?.data?.top_vendors} />
          <MostSoldProducts data={data?.data?.top_products} />
        </div>

        <div className="flex justify-between gap-4 pt-4 items-baseline">
          <div className="w-[50%]">
            <IncomeChart />
          </div>
          <div className="w-[50%]">
            <OrdersChart />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
