import apiClient from "./apiClient";

export const fetchChatFeedback = async ({
  company,
  days = 7,
  mode = "feedback",
  sessionId = "user-123",
  input,
}) => {
  try {
    const response = await apiClient.post("/webhook/apex/internal", {
      input,
      sessionId,
      mode,
      company,
      days,
    });

    return response.data;
  } catch (error) {
    console.error("chat feedback API Error:", error);
    throw error;
  }
};
