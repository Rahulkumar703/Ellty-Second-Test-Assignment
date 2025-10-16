import type { IAPIResponse, IStartingNumber } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchStartingNumbers = async () => {
  try {
    // Make the API call
    const response = await fetch(`${API_URL}/starting-number`, {
      credentials: "include",
    });

    // Parse the response
    const data: IAPIResponse<IStartingNumber[]> = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    let responseMessage =
      "An unknown error occurred during fetching starting numbers.";
    if (error instanceof Error) {
      responseMessage = error.message;
    }
    throw new Error(responseMessage);
  }
};

export const deleteStartingNumber = async (id: string) => {
  try {
    // Make the API call
    const response = await fetch(`${API_URL}/starting-number/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    // Parse the response
    const data: IAPIResponse<null> = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    let responseMessage =
      "An unknown error occurred during deleting a starting number.";
    if (error instanceof Error) {
      responseMessage = error.message;
    }
    throw new Error(responseMessage);
  }
};

export const createStartingNumber = async (value: number) => {
  try {
    // Make the API call
    const response = await fetch(`${API_URL}/starting-number/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ value }),
    });
    // Parse the response
    const data: IAPIResponse<null> = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    let responseMessage =
      "An unknown error occurred during adding a starting number.";
    if (error instanceof Error) {
      responseMessage = error.message;
    }
    throw new Error(responseMessage);
  }
};
