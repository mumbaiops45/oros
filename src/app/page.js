import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import StorySplit from "@/components/home/StorySplit";
import BestSellers from "@/components/home/BestSellers";
import Reviews from "@/components/home/Reviews";
import DualCta from "@/components/home/DualCta";

export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <CategoryShowcase />
      <FeaturedProducts />
      <StorySplit />
      <BestSellers />
      <Reviews />
      <DualCta />
    </>
  );
}
