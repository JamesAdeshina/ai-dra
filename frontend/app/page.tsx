import "@/features/landing/components/landing-page.css";
import type { Metadata } from "next";
import { LandingPage } from "@/features/landing/components/landing-page";

export const metadata: Metadata = {
  title: "AI-DRA | Intelligent, Connected Stroke Rehabilitation",
  description:
    "AI-DRA is a University of Derby research prototype using computer vision to support accessible, connected upper-limb rehabilitation for stroke survivors.",
  openGraph: {
    title: "AI-DRA | Intelligent, Connected Stroke Rehabilitation",
    description:
      "Guided upper-limb stroke rehabilitation with movement feedback, connected support, and research monitoring.",
    images: ["/landing/social-preview.png"],
  },
  icons: {
    icon: "/landing/favicon.svg",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
