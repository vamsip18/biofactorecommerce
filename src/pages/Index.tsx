// src/pages/Index.tsx
import { Layout } from "@/components/layout/Layout";
import {
  CategoryProductsSection,
  BestSellingProducts,
  HeroSection,
  // TrendingTopics,
  BestDealsProducts

} from "@/components/home/BasketPreviewSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <BestSellingProducts />
      <BestDealsProducts />
      {/* <TrendingTopics /> */}
      <CategoryProductsSection />
    </Layout>
  );
};

export default Index;