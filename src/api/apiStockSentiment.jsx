import apiClient from "./apiClient";

export const fetchStockSentiment = async ({
  company,
  days = 7,
  mode = "sentiment",
}) => {
  try {
    const response = await apiClient.post("/webhook/apex/internal", {
      mode,
      company,
      days,
    });

    return response.data;
  } catch (error) {
    console.error("Stock Sentiment API Error:", error);
    throw error;
  }
};
