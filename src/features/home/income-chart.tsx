"use client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { getRevenueChartData } from "./api";
import { useTranslation } from "react-i18next";

const IncomeChart = () => {
  const [type, setType] = useState("monthly");

  const { data: chartData, isLoading } = useQuery({
    queryKey: ["getChartData", type],
    queryFn: () => getRevenueChartData({ period: type }),
  });

  const arabicMonths: Record<string, string> = {
    "1": "يناير",
    "2": "فبراير",
    "3": "مارس",
    "4": "أبريل",
    "5": "مايو",
    "6": "يونيو",
    "7": "يوليو",
    "8": "أغسطس",
    "9": "سبتمبر",
    "10": "أكتوبر",
    "11": "نوفمبر",
    "12": "ديسمبر",
  };

  const englishMonths: Record<string, string> = {
    "1": "January",
    "2": "February",
    "3": "March",
    "4": "April",
    "5": "May",
    "6": "June",
    "7": "July",
    "8": "August",
    "9": "September",
    "10": "October",
    "11": "November",
    "12": "December",
  };

  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  const formattedData = chartData?.map(
    (item: { day?: number; month?: string; revenue: number }) => {
      return type === "daily"
        ? { day: item.day, revenue: item.revenue }
        : {
            month: isArabic
              ? arabicMonths[item.month!]
              : englishMonths[item.month!],
            revenue: item.revenue,
          };
    }
  );
  return (
    <Card className="lg:col-span-2 w-full h-[500px]">
      <CardHeader className="flex items-center justify-between gap-2  border-b py-5 sm:flex-row mb-6">
        <CardTitle className="text-xl font-semibold">
          {t("home.charts.income.title")}
        </CardTitle>

        <Select value={type} onValueChange={(value) => setType(value)}>
          <SelectTrigger
            className="w-[10rem] rounded-lg"
            aria-label="Select a value"
          >
            <SelectValue
              placeholder={t("home.charts.income.time_range.monthly")}
            />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="monthly" className="rounded-lg">
              {t("home.charts.income.time_range.monthly")}
            </SelectItem>
            <SelectItem value="daily" className="rounded-lg">
              {t("home.charts.income.time_range.daily")}
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="aspect-auto h-[300px] w-full">
          {isLoading ? (
            <div className="w-full flex items-center justify-center h-full text-primary ">
              <LoaderCircle size={30} className="animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer>
              <AreaChart data={formattedData}>
                <defs>
                  <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="red" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="red" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey={type === "daily" ? "day" : "month"}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                />
                <YAxis axisLine={false} tickLine={false} direction={"ltr"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Area
                  dataKey="revenue"
                  type="linear"
                  fill="url(#fillTotal)"
                  stroke="red"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeChart;
