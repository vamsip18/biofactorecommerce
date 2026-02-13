// src/pages/Index.tsx
import { Layout } from "@/components/layout/Layout";
import {
  AquaCultureSection,
  BestSellingProducts,
  HeroSection,
  TrendingTopics,
  BestDealsProducts
 
} from "@/components/home/BasketPreviewSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <BestSellingProducts />
      <BestDealsProducts />
            <TrendingTopics />
            <AquaCultureSection />
    </Layout>
  );
};

export default Index;