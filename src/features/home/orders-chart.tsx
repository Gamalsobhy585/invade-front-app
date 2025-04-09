"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getOrderChartData } from "./api";
import { LoaderCircle } from "lucide-react";

interface ChartData {
  order_status: Record<string, number>; // Defines the structure of the data
}

export function OrdersChart() {
  const [type, setType] = React.useState("monthly");
  const { t, i18n } = useTranslation();

  // Fetch data based on the selected type
  const { data, isLoading } = useQuery<ChartData>({
    queryKey: ["getOrderChartData", type],
    queryFn: () => getOrderChartData({ period: type }),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });
console.log(data);
  // Transform data for the PieChart
  const chartData = React.useMemo(() => {
    if (!data?.order_status) return [];
    return Object.entries(data.order_status).map(([status, count]) => ({
      order_status: parseInt(status, 10),
      count: count,
    }));
  }, [data]);

  // Calculate total orders
  const totalOrders = chartData.reduce((sum, item) => sum + item.count, 0);

  // Chart Configuration
  const chartConfig = {
    1: { label: t("home.status.completed"), color: "#34D399" },
    2: { label: t("home.status.canceled"), color: "#F87171" },
    3: { label: t("home.status.in_progress"), color: "#60A5FA" },
  };

  return (
    <Card
      className="flex flex-col lg:col-span-2 xl:col-span-1 h-[500px]"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <CardHeader className="flex-row items-center justify-between pb-14">
        <CardTitle>{t("home.charts.orders.title")}</CardTitle>
        <Select value={type} onValueChange={(value) => setType(value)}>
          <SelectTrigger className="w-[10rem] rounded-lg">
            <SelectValue
              placeholder={t("home.charts.income.time_range.orderInYear")}
            />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="monthly" className="rounded-lg">
              {t("home.charts.income.time_range.orderInYear")}
            </SelectItem>
            <SelectItem value="daily" className="rounded-lg">
              {t("home.charts.income.time_range.orderInMonth")}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="relative mx-auto max-h-[300px] w-full">
          {isLoading ? (
            <div className="w-full flex items-center justify-center h-full text-primary">
              <LoaderCircle size={30} className="animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                  formatter={(value, name, props) => {
                    const payload = props?.payload;
                    if (payload) {
                      return [
                        value,
                        chartConfig[payload.order_status as keyof typeof chartConfig]?.label,
                      ];
                    }
                    return [value, name];
                  }}
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="order_status"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  startAngle={90}
                  endAngle={450}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.order_status}
                      fill={
                        chartConfig[
                          entry.order_status as keyof typeof chartConfig
                        ]?.color
                      }
                    />
                  ))}
                </Pie>
                {/* Add total orders text in the center */}
                <text
                  x="50%"
                  y="45%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="25"
                  fontWeight="bold"
                  fill="#333"
                >
                  {totalOrders}
                </text>
                <text
                  x="50%"
                  y="55%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
                  fontWeight="bold"
                  fill="#333"
                >
                  {t("home.charts.orders.total_orders")}
                </text>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center mb-4">
          {Object.entries(chartConfig).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: value.color }}
              ></div>
              <span className="text-sm">{value.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
