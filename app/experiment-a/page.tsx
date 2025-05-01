import { redirect } from "next/navigation"

export default function ExperimentA() {
  // This is just a redirect to the main page
  // In a real A/B test, you would have different content here
  redirect("/")
}
