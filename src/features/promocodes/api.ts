import { z } from "zod"; 
import { promocodeSchema} from "@/features/promocodes/schemas";

const token = localStorage.getItem("token");
export const searchPromocodes = async ({
  page = 1,
  query = "",
}: {
  page: number;
  query?: string;
}) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/admin/promo-codes?query=${query}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to search promocodes");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };  }
};


export async function getPromocode(id: string) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/promo-codes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };  }
}

export async function updatePromocode(
  id: string,
  promocode: z.infer<typeof promocodeSchema>
) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/promo-codes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(promocode),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}



export async function createPromocode(promocode: z.infer<typeof promocodeSchema>) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/promo-codes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(promocode),
      
      
    });
    if (!res.ok) {
      throw new Error("Failed to create promocode");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };  }
}

export async function deletePromocode(id: string) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/promo-codes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}


