// src/pages/Index.tsx
import { Layout } from "@/components/layout/Layout";
import {
  CategoryProductsSection,
  BestSellingProducts,
  HeroSection,
  ShopByDivisionSection,
  // TrendingTopics,
  BestDealsProducts

} from "@/components/home/BasketPreviewSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ShopByDivisionSection />
      <BestSellingProducts />
      <BestDealsProducts />
      {/* <TrendingTopics /> */}
      <CategoryProductsSection />
    </Layout>
  );
};

export default Index;