import api, { setAccessToken } from "@/lib/api";

export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
}) {
  const res = await api.post("/auth/signup", data);
  setAccessToken(res.data.accessToken);
  return res.data;
}

export async function loginUser(data: { email: string; password: string }) {
  try {
    const res = await api.post("/auth/login", data);
    setAccessToken(res.data.accessToken);
    return res.data;
    // eslint-disable-next-line
  } catch (err: any) {
    const message = err.message;
    throw new Error(message)
  }
}

export async function logoutUser() {
  await api.post("/auth/logout");
}

export async function getProfile() {
  const res = await api.get("/user/me");
  return res.data;
}
