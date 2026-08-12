import { Geist, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";


export const metadata = {
  title: "OROS 3D — 3D Printed Objects & Custom Batch Printing",
  description:
    "Shop ready-to-ship 3D printed decor, desk gear, figurines, cosplay props and functional parts — or upload your own design for a custom run. Bulk pricing from a minimum order quantity of 10 units.",
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
