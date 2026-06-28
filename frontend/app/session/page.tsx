import { redirect } from "next/navigation";

export default function SessionPage() {
  redirect("/exercises/target-touch/start");
}