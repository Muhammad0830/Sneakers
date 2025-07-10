// Server component
import ShopPage from "./ShopClient";

export default async function Page() {
  // This will trigger the loading.tsx during route change
  await new Promise((res) => setTimeout(res, 1000));

  return <ShopPage />;
}
