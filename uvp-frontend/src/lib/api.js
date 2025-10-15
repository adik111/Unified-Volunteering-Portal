// Axios API client setup for backend communication
// Base URL is a placeholder and can be configured via environment variable
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Simple helpers to demonstrate usage across the app
export const getRequest = (url, config = {}) => apiClient.get(url, config);
export const postRequest = (url, data, config = {}) => apiClient.post(url, data, config);
export const putRequest = (url, data, config = {}) => apiClient.put(url, data, config);
export const deleteRequest = (url, config = {}) => apiClient.delete(url, config);

export default apiClient;

