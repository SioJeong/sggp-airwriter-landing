import { redirect } from "next/navigation"

export default function ExperimentB() {
  // In a real implementation, this would be a different version of the landing page
  // For now, we'll just redirect to the main page
  redirect("/")
}
