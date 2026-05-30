import type { Metadata } from "next";
import { ThemeDomSync } from "@/components/ui/ThemeDomSync";
import { THEME_INIT_SCRIPT } from "@/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Old UI — Component Library",
  description: "A curated set of UI primitives with swappable themes, bespoke icons, and dashboard-ready components.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen font-sans">
        <ThemeDomSync />
        {children}
      </body>
    </html>
  );
}
