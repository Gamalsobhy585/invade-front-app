import { z } from "zod"; 
import { taskSchema} from "@/features/tasks/schemas";

const token = localStorage.getItem("token");
export const searchTasks = async ({
  page = 1,
  query = "",
}: {
  page: number;
  query?: string;
}) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/tasks?query=${query}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to search tasks");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };  }
};


export async function getTask(id: string) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${id}`, {
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

export async function updateTask(
  id: string,
  task: z.infer<typeof taskSchema>
) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };
  }
}



export async function createTask(task: z.infer<typeof taskSchema>) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
      
      
    });
    if (!res.ok) {
      throw new Error("Failed to create task");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    
    return { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" };  }
}

export async function deleteTask(id: string) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${id}`, {
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


