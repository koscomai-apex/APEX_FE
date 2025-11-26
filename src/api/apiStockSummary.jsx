import apiClient from "./apiClient";

export const fetchStockSummary = async ({
  company,
  days,
  sessionId,
  mode = "summary",
}) => {
  try {
    const response = await apiClient.post("/webhook/apex/internal", {
      mode,
      company,
      days,
      sessionId,
    });

    return response.data;
  } catch (error) {
    console.error("Stock Summary API Error:", error);
    throw error;
  }
};
