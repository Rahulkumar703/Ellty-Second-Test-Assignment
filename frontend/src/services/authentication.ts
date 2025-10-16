import type { IAPIResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export const register = async (
  name: string,
  username: string,
  password: string
) => {
  try {
    // Basic validation
    if (!name || !username || !password) {
      throw new Error("Name, username, and password are required.");
    }

    // Make the API call
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    // Parse the response
    const data: IAPIResponse<null> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    let responseMessage = "An unknown error occurred during registration.";
    if (error instanceof Error) {
      responseMessage = error.message;
    }
    throw new Error(responseMessage);
  }
};

export const login = async (username: string, password: string) => {
  try {
    // Basic validation
    if (!username || !password) {
      throw new Error("Username and password are required.");
    }

    // Make the API call
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    // Parse the response
    const data: IAPIResponse<null> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    let responseMessage = "An unknown error occurred during login.";
    if (error instanceof Error) {
      responseMessage = error.message;
    }
    throw new Error(responseMessage);
  }
};

export const logout = async () => {
  try {
    // Make the API call
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "GET",
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
    let responseMessage = "An unknown error occurred during logout.";
    if (error instanceof Error) {
      responseMessage = error.message;
    }
    throw new Error(responseMessage);
  }
};

export const me = async () => {
  try {
    // Make the API call
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    // Parse the response
    const data: IAPIResponse<{
      _id: string;
      username: string;
    }> = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    let responseMessage = "An unknown error occurred during logout.";
    if (error instanceof Error) {
      responseMessage = error.message;
    }
    throw new Error(responseMessage);
  }
};
