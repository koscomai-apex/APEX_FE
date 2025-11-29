import apiClient from "./apiClient";

export const fetchPortfolio = async (holdings) => {
  try {
    const response = await apiClient.post("/webhook/apex/internal/portfolio", {
      holdings,
    });

    return response.data[0];
  } catch (error) {
    console.error("Portfolio API Error:", error);
    throw error;
  }
};
