import AuthClient from "./AuthClient";

export default async function Page() {
  await new Promise((res) => setTimeout(res, 1000));

  return <AuthClient />;
}