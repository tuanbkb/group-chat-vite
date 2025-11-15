import { apiGet, apiPut } from "./apiClient";

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

// export const fetchFriendlist = async (userId: string): Promise<any> => {
//   try {
//     const friendDocs = await apiGet("chatApi", "/users", {

//     });
//   }
// }
