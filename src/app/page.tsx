import { redirect } from "next/navigation";

export default function HomePage() {
  // This page won't actually render because the middleware will handle the redirect
  // But we need it to avoid Next.js errors
  redirect("/dashboard");
}
