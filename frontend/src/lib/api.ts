import axios from "axios";

let accessToken: string | null = null;
let isLoggingOut = false;

export const setAccessToken = (at: string) => {
  accessToken = at;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
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
      const isAuthPage = window.location.pathname.startsWith("/auth");

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
        if (!isAuthPage && !isLoggingOut) {
          isLoggingOut = true;
          window.location.href = "/auth?mode=signin";
        }
      }
    }

    return Promise.reject(error);
  }
);
export default api;
