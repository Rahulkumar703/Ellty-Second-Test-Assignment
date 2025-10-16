const API_URL = import.meta.env.VITE_API_URL;
import type { IAPIResponse, IOperationsTree } from "@/types";

export const fetchOperations = async ({
  parentId,
  parentType,
}: {
  parentId: string;
  parentType: "StartingNumber" | "Operation";
}) => {
  try {
    // Make the API call
    const response = await fetch(
      `${API_URL}/operation/${parentType}/${parentId}`
    );

    // Parse the response
    const data: IAPIResponse<IOperationsTree[]> = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error("Error fetching operations:", error);
    throw error;
  }
};

export const createOperation = async ({
  parentId,
  parentType,
  operator,
  value,
}: {
  parentId: string;
  parentType: "StartingNumber" | "Operation";
  operator: "+" | "-" | "*" | "/";
  value: number;
}) => {
  try {
    const response = await fetch(`${API_URL}/operation/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ parentId, parentType, operator, value }),
    });

    const data: IAPIResponse<Omit<IOperationsTree, "children">> =
      await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error("Error creating operation:", error);
    throw error;
  }
};
