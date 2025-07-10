import { notFound } from "next/navigation";

export default function CatchAllPage() {
  notFound(); // triggers app/not-found.tsx
}
