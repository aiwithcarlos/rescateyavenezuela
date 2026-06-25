import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/providers/AppProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ayuda Venezuela — Mapa de Rescate",
  description:
    "Mapa de incidentes activos para coordinar rescates y ayuda tras el terremoto del 24 de junio de 2026 en Venezuela. Reporta incidentes o regístrate como voluntario.",
  applicationName: "Ayuda Venezuela",
  appleWebApp: {
    capable: true,
    title: "Ayuda Venezuela",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#DC2626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col bg-gray-50">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
