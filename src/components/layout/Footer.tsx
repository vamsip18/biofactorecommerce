// src/components/layout/Footer.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Mail, Phone, MapPin, Globe, Award, Shield } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";
import logo from "@/assets/Biofactor-Logo.png";
import termsPdf from "@/assets/docs/Terms.pdf";
import privacyPdf from "@/assets/docs/Privacy.pdf";
import shippingPdf from "@/assets/docs/Shipping.pdf";
import refundPdf from "@/assets/docs/Refund.pdf";

const getFooterFooterLinks = (t: ReturnType<typeof useTranslation>) => ({
  products: [
    { name: t.nav.agriculture, href: "/agriculture" },
    { name: t.nav.aquaculture, href: "/aquaculture" },
    { name: t.nav.largeAnimals, href: "/large-animals" },
    { name: t.nav.kitchenGardening, href: "/kitchen-gardening" },
  ],
  customerCare: [
    { name: t.nav.contact, href: "/contact" },
    { name: t.account.orders, href: "/orders" },
    { name: t.nav.cart, href: "/cart" },
    { name: t.common.checkout, href: "/checkout" },
  ],
});

const getCertifications = (t: ReturnType<typeof useTranslation>) => [
  { name: "GMP Certified", icon: <Shield className="w-3.5 h-3.5" /> },
  { name: "ISO 9001:2015", icon: <Award className="w-3.5 h-3.5" /> },
  { name: "Organic Certified", icon: <Leaf className="w-3.5 h-3.5" /> },
  { name: "Research Backed", icon: <Globe className="w-3.5 h-3.5" /> },
];

// Theme color helpers for footer
const getFooterThemeColors = (theme: 'green' | 'cyan' | 'amber' | 'lime') => {
  if (theme === 'cyan') {
    return {
      gradient: 'bg-gradient-to-b from-cyan-950 via-cyan-900 to-cyan-800',
      blobDark: 'bg-cyan-300',
      blobLight: 'bg-cyan-300',
      text: 'text-cyan-200/80',
      textLight: 'text-cyan-200/60',
      textBright: 'text-cyan-200',
      textBrighter: 'text-cyan-300',
      border: 'border-cyan-800'
    };
  }
  if (theme === 'amber') {
    return {
      gradient: 'bg-gradient-to-b from-amber-950 via-amber-900 to-amber-800',
      blobDark: 'bg-amber-300',
      blobLight: 'bg-amber-300',
      text: 'text-amber-200/80',
      textLight: 'text-amber-200/60',
      textBright: 'text-amber-200',
      textBrighter: 'text-amber-300',
      border: 'border-amber-800'
    };
  }
  if (theme === 'lime') {
    return {
      gradient: 'bg-gradient-to-b from-lime-950 via-lime-900 to-lime-800',
      blobDark: 'bg-lime-300',
      blobLight: 'bg-lime-300',
      text: 'text-lime-200/80',
      textLight: 'text-lime-200/60',
      textBright: 'text-lime-200',
      textBrighter: 'text-lime-300',
      border: 'border-lime-800'
    };
  }
  return {
    gradient: 'bg-gradient-to-b from-emerald-950 via-emerald-900 to-green-900',
    blobDark: 'bg-emerald-300',
    blobLight: 'bg-green-300',
    text: 'text-emerald-200/80',
    textLight: 'text-emerald-200/60',
    textBright: 'text-emerald-200',
    textBrighter: 'text-emerald-300',
    border: 'border-emerald-800'
  };
};

export const Footer = ({ theme = 'green' }: { theme?: 'green' | 'cyan' | 'amber' | 'lime' }) => {
  const colors = getFooterThemeColors(theme);
  const t = useTranslation();
  const footerLinks = getFooterFooterLinks(t);
  const certifications = getCertifications(t);

  return (
    <footer className={`app-footer ${colors.gradient} text-white pt-10 pb-6 relative overflow-hidden`}>
      {/* Background blobs (reduced) */}
      <div className="absolute inset-0 opacity-5">
        <div className={`absolute top-0 left-1/4 w-72 h-72 ${colors.blobDark} rounded-full blur-3xl`} />
        <div className={`absolute bottom-0 right-1/4 w-72 h-72 ${colors.blobLight} rounded-full blur-3xl`} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">

          {/* Brand */}
          <div className="hidden md:block col-span-2 md:col-span-1">
            <motion.div className="flex items-center gap-3 mb-4" whileHover={{ scale: 1.02 }}>
              {/* <img
                src={logo}
                alt="Biofactor Logo"
                className="h-10 w-auto"
              /> */}
              <div>
                <div className="text-xl font-bold">Biofactor Biologicals</div>
              </div>
            </motion.div>
            <p className={`${colors.text} text-sm leading-snug mb-4 max-w-md`}>
              {t.footer.description}
            </p>

            {/* Certifications */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className={`flex items-center gap-2 text-xs ${colors.text}`}
                >
                  <span className={colors.textBrighter}>{cert.icon}</span>
                  {cert.name}
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="hidden md:block">
            <FooterColumn title={t.footer.products} links={footerLinks.products} colors={colors} />
          </div>

          {/* Customer Care */}
          <div className="hidden md:block">
            <FooterColumn title={t.footer.customerCare} links={footerLinks.customerCare} colors={colors} />
          </div>

          {/* Company & Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-base mb-3">{t.nav.contact}</h4>
            <div className={`space-y-3 text-sm ${colors.text}`}>
              <div className="flex gap-2">
                <MapPin className={`w-4 h-4 ${colors.textBrighter} mt-0.5`} />
                <div>
                  Biofactor Inputs Private limited<br />
                  Hyderabad, Telangana
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className={`w-4 h-4 ${colors.textBrighter}`} />
                <a href="tel:+918886624775" className="hover:text-white">
                  +91 88866 24775
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className={`w-4 h-4 ${colors.textBrighter}`} />
                <a href="mailto:info@biofactor.com" className="hover:text-white">
                  info@biofactor.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`mt-8 pt-5 border-t ${colors.border} flex flex-col gap-4 text-xs ${colors.textLight}`}>
          {/* Mobile: Copyright above links */}
          <div className="md:hidden flex flex-col gap-3 text-center">
            <span className="text-xs">{`© ${new Date().getFullYear()} Biofactor Inputs Private limited. All rights reserved`}</span>
            <div className="flex flex-wrap gap-1 justify-center">
              <a href={termsPdf} download className="hover:text-white">{t.footer.termsOfService}</a>
              <span>•</span>
              <a href={privacyPdf} download className="hover:text-white">{t.footer.privacyPolicy}</a>
              <span>•</span>
              <a href={shippingPdf} download className="hover:text-white">{t.footer.shipping}</a>
              <span>•</span>
              <a href={refundPdf} download className="hover:text-white">{t.footer.returns}</a>
            </div>
          </div>

          {/* Desktop: Copyright above links centered */}
          <div className="hidden md:flex md:flex-col md:items-center md:justify-center md:gap-3 md:py-2">
            <span>© {new Date().getFullYear()} Biofactor Inputs Private limited. {t.footer.allRightsReserved}</span>
            <div className="flex gap-6 text-left">
              <a href={termsPdf} download className="hover:text-white">{t.footer.termsOfService}</a>
              <a href={privacyPdf} download className="hover:text-white">{t.footer.privacyPolicy}</a>
              <a href={shippingPdf} download className="hover:text-white">{t.footer.shipping}</a>
              <a href={refundPdf} download className="hover:text-white">{t.footer.returns}</a>
            </div>
          </div>
        </div>
      </div>
    </footer >
  );
};

const FooterColumn = ({
  title,
  links,
  colors
}: {
  title: string;
  links: { name: string; href: string }[];
  colors: ReturnType<typeof getFooterThemeColors>;
}) => (
  <div>
    <h4 className="font-semibold text-base mb-3">{title}</h4>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.name}>
          <Link
            to={link.href}
            className={`text-sm ${colors.textBright} hover:text-white transition-all`}
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
