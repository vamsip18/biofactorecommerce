import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  // Detect page theme based on URL
  const isAquaPage = location.pathname.includes('/aquaculture') ||
    location.pathname.includes('/probiotics') ||
    location.pathname.includes('/disease-management');

  const isLargeAnimalsPage = location.pathname.includes('/large-animals');

  const isKitchenGardeningPage = location.pathname.includes('/kitchen-gardening');

  let theme: 'green' | 'cyan' | 'amber' | 'lime' = 'green';
  if (isAquaPage) theme = 'cyan';
  else if (isLargeAnimalsPage) theme = 'amber';
  else if (isKitchenGardeningPage) theme = 'lime';

  return (
    <div className="min-h-screen flex flex-col">
      <Header theme={theme} />
      <main className="app-main flex-1 pb-4 md:pb-0">{children}</main>
      <Footer theme={theme} />
    </div>
  );
};