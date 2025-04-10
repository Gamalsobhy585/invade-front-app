import axios from "axios";
import { registerSchema } from "./schema";
import { z } from "zod";

const BASE_URL = import.meta.env.VITE_BASE_URL.replace(/\/+$/, ""); 

export const login = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${BASE_URL}/login`, data,{
    headers: {
      'Accept-Language': 'en-US'
    },
  });
  return response.data;
};

export async function logout() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/logout`,
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

export const register =  async (data: z.infer<typeof registerSchema>) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, data, {
      headers: {
        'Accept-Language': 'en-US'
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Registration failed", error);
    throw error; 
  }
}
