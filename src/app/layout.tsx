import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { UiStyleInjector } from "@/components/ui-style-injector";
import "./globals.css";

const fontVars = [
  GeistSans.variable,
  GeistMono.variable,
].join(" ");

export const metadata: Metadata = {
  title: "Health Claims",
  description: "Sistema profesional de liquidacion de siniestros de salud.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${fontVars} h-full antialiased`}
    >
      <body className="bg-background text-foreground min-h-full">
        <UiStyleInjector />
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
