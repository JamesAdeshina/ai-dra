import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import "./accessibility.css";

import {
  AccessibilityBootstrapScript,
} from "@/features/settings/accessibility/components/accessibility-bootstrap-script";

import {
  AccessibilityProvider,
} from "@/features/settings/accessibility/components/accessibility-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI-DRA",
  description: "Digital Rehabilitation Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <AccessibilityBootstrapScript />
      </head>

      <body
        className={`${inter.className} min-h-full flex flex-col`}
      >
        <AccessibilityProvider>
          {children}
        </AccessibilityProvider>
      </body>
    </html>
  );
}