import { apiGet } from "./apiClient";

export const fetchUsername = async (): Promise<any> => {
  try {
    const userDoc = await apiGet("chatApi", "/users");
    console.log("User document fetched:", userDoc);
    return "testuser";
  } catch (error) {
    console.error("Error fetching username:", error);
    throw error;
  }
};
