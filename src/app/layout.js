import { Geist, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";


export const metadata = {
  title: "OROS — Pure Botanicals for Everyday Rituals",
  description:
    "Certified organic skincare, hair care and wellness essentials, cold-pressed in small batches and shipped plastic-neutral across India.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body className="min-h-screen bg-white font-sans text-slate-700 antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
