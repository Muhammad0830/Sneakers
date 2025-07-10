import HomeClient from './HomeClient';

export default async function HomePage() {
  // This will trigger the loading.tsx during route change
  await new Promise((res) => setTimeout(res, 1000));

  return <HomeClient />;
}
