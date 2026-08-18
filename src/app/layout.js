import "./globals.css";

export const metadata = {
  title: "OROS 3D — 3D Printed Objects & Custom Batch Printing",
  description:
    "Shop ready-to-ship 3D printed decor, desk gear, figurines, cosplay props and functional parts — or upload your own design for a custom run. Bulk pricing from a minimum order quantity of 10 units.",
};

/**
 * Root layout holds only the document shell. The storefront header and
 * footer moved into the (site) route group, so /admin renders on a bare
 * page instead of inside the public chrome.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans text-slate-700 antialiased">
        {children}
      </body>
    </html>
  );
}
