import apiClient from "./apiClient";

export const fetchChat = async ({
  company,
  days = 7,
  input,
  sessionId = "user-123",
}) => {
  try {
    const response = await apiClient.post("/webhook/apex/internal", {
      company,
      days,
      sessionId,
      input,
    });

    return response.data;
  } catch (error) {
    console.error("chat API Error:", error);
    throw error;
  }
};
