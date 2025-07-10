import SignupClient from "./SignUpClient";

export default async function Page() {
  await new Promise((res) => setTimeout(res, 1000));

  return <SignupClient />;
}