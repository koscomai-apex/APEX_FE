import apiClient from "./apiClient";

export const fetchChatSimulation = async ({
  company,
  days = 7,
  input,
  sessionId = "user-123",
  mode = "simulation",
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
    console.error("chat simulation API Error:", error);
    throw error;
  }
};
