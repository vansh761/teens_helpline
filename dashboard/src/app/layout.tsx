import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { DashboardHeader } from "@/components/DashboardHeader";

export const metadata: Metadata = {
  title: "Teens Helpline Dashboard",
  description: "Book career counselling, guidance sessions, and subject tuition.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col" style={{ background: "var(--paper)" }}>
        <AuthProvider>
          <DashboardHeader />
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
