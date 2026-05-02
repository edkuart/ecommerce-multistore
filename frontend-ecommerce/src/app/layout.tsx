import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Header } from "@/components/layout/Header";
import { PwaRegister } from "@/components/layout/PwaRegister";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  manifest: "/manifest.webmanifest",
  title: "Catálogo ecommerce",
  description:
    "Catálogo de productos con cotización directa, captura de leads y atención por WhatsApp.",
  applicationName: "Catálogo ecommerce",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Catálogo ecommerce",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${dmSerif.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <body className="min-h-screen antialiased">
        <PwaRegister />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
