import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Storefront chrome. Lives in a route group so /admin can sit in the
 * same app without inheriting the public header and footer.
 */
export default function SiteLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
