import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL.replace(/\/+$/, ""); 

export const login = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, data);
  return response.data;
};

export async function logout() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/logout`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();

    if (!response.ok) throw new Error("Something Went Wrong!");

    return data;
  } catch (error) {
    console.error(error);
  }
}