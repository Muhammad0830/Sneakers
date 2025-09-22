import axios from "axios";

let accessToken: string | null = null;
let isLoggingOut = false;

export const setAccessToken = (at: string) => {
  accessToken = at;
};

export const clearAccessToken = () => {
  accessToken = null;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:10000",
  withCredentials: true,
});

// attach token to every request
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// handle token refresh
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        // eslint-disable-next-line
      } catch (err) {
        if (!isLoggingOut) {
          isLoggingOut = true;
          if (window.location.pathname.includes("auth")) return;
          window.location.href = "/auth?mode=signin";
        }
      }
    }

    return Promise.reject(error);
  }
);
export default api;
