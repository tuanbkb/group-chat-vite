import { apiGet, apiPost, apiPut } from "./apiClient";

export const fetchUserData = async (userId: string): Promise<any> => {
  try {
    const userDoc = await apiGet("chatApi", "/users/profile", {
      queryParams: {
        userId
      },
    });
    console.log("User document fetched:", userDoc);
    return userDoc;
  } catch (error) {
    console.error("Error fetching username:", error);
    throw error;
  }
};

export const updateDisplayName = async (userId: string, newDisplayName: string): Promise<any> => {
  try {
    const response = await apiPut("chatApi", "/users/profile", {
      userId: userId,
      name: newDisplayName,
    });
    console.log("Display name updated:", response);
    return response;
  } catch (error) {
    console.error("Error updating display name:", error);
    throw error;
  }
};

export const queryUsersByName = async (q: string): Promise<any> => {
  try {
    const users = await apiGet("chatApi", "/users/byName", {
      queryParams: {
        q,
      },
    });
    console.log("Users fetched by name:", users);
    return users;
  } catch (error) {
    console.error("Error querying users by name:", error);
    throw error;
  }
};

export const queryUsersByEmail = async (q: string): Promise<any> => {
  try {
    const users = await apiGet("chatApi", "/users/byEmail", {
      queryParams: {
        q,
      },
    });
    console.log("Users fetched by email:", users);
    return users;
  } catch (error) {
    console.error("Error querying users by email:", error);
    throw error;
  }
};

export const uploadAvatar = async (userId: string, avatarData: string, type: "upload" | "url"): Promise<any> => {
  try {
    const response = await apiPost("chatApi", "/image", {
      userId,
      imageData: avatarData,
      type,
    });
    console.log("Avatar uploaded:", response);
    return response;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};