import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/**
 * The API answers with { success, message, data }, so unwrap `data` on the
 * way out and flatten an error into a plain Error carrying the API's own
 * `message` — every caller then just reads `error.message`.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const apiError = new Error(
        error.response.data?.message || `Request failed (${error.response.status})`
      );
      apiError.status = error.response.status;
      apiError.data = error.response.data;

      // a rejected token is dead — drop it so the panel bounces to login
      if (apiError.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      return Promise.reject(apiError);
    }

    if (error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    return Promise.reject(
      new Error(
        `Could not reach the API at ${api.defaults.baseURL}. Is oros_backend running?`
      )
    );
  }
);

/** Unwraps the `data` envelope. */
export const unwrap = (response) => response.data?.data;

export default api;
