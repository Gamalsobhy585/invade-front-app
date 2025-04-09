import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL.replace(/\/+$/, "");

export const getDashboardData = async () => {
  const response = await axios.get(`${BASE_URL}/admin/dashboard`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  });
  return response.data?.data || {};
};

export const getRevenueChartData = async ({ period }: { period: string }) => {
  const res = await axios.get(
    `${BASE_URL}/admin/get-admin-revenue?period=${period}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    }
  );

  return res.data.data;
};
export const getOrderChartData = async ({ period }: { period: string }) => {
  const res = await axios.get(
    `${BASE_URL}/admin/get-admin-order-status?period=${period}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    }
  );
  return res.data.data;
};
