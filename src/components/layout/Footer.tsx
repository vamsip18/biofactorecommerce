// src/components/layout/Footer.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Mail, Phone, MapPin, Globe, Award, Shield } from "lucide-react";
import logo from "@/assets/logo.png";

const footerLinks = {
  products: [
    { name: "Biofertilizers", href: "/products/biofertilizers" },
    { name: "Soil Amendments", href: "/products/amendments" },
    { name: "Microbial Inoculants", href: "/products/inoculants" },
    { name: "Growth Promoters", href: "/products/growth-promoters" },
    { name: "All Products", href: "/products" },
  ],
  solutions: [
    { name: "For Farmers", href: "/solutions/farmers" },
    { name: "For Growers", href: "/solutions/growers" },
    { name: "For Research", href: "/solutions/research" },
    { name: "For Distributors", href: "/solutions/distributors" },
    { name: "Case Studies", href: "/case-studies" },
  ],
  resources: [
    { name: "Technical Papers", href: "/resources/technical" },
    { name: "Research & Development", href: "/resources/research" },
    { name: "Application Guides", href: "/resources/guides" },
    { name: "FAQs", href: "/faq" },
    { name: "Blog", href: "/blog" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Technology", href: "/technology" },
    { name: "Team", href: "/team" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ],
};

const certifications = [
  { name: "GMP Certified", icon: <Shield className="w-3.5 h-3.5" /> },
  { name: "ISO 9001:2015", icon: <Award className="w-3.5 h-3.5" /> },
  { name: "Organic Certified", icon: <Leaf className="w-3.5 h-3.5" /> },
  { name: "Research Backed", icon: <Globe className="w-3.5 h-3.5" /> },
];

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-emerald-900 to-green-900 text-white pt-8 pb-5 relative overflow-hidden">
      {/* Background blobs (reduced) */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-300 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-green-300 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div className="flex items-center gap-2 mb-4" whileHover={{ scale: 1.02 }}>
              <div>
                <div className="text-xl font-bold">Biofactor</div>
                <div className="text-emerald-200 text-xs">
                  Advanced Agricultural Solutions
                </div>
              </div>
            </motion.div>

            <p className="text-emerald-200/80 text-sm leading-snug mb-4 max-w-md">
              Scientifically formulated bio-solutions to enhance soil health,
              improve crop yields, and promote sustainable agriculture.
            </p>

            {/* Certifications */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="flex items-center gap-2 text-xs text-emerald-200/90"
                >
                  <span className="text-emerald-300">{cert.icon}</span>
                  {cert.name}
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <FooterColumn title="Products" links={footerLinks.products} />

          

          {/* Company & Contact */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-6">
            <FooterColumn title="Company" links={footerLinks.company} />

            <div>
              <h4 className="font-semibold text-base mb-3">Contact</h4>
              <div className="space-y-3 text-sm text-emerald-200/80">
                <div className="flex gap-2">
                  <MapPin className="w-4 h-4 text-emerald-300 mt-0.5" />
                  <div>
                    Agricultural Research Park<br />
                    Geneva, Switzerland
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-300" />
                  <a href="tel:+41123456789" className="hover:text-white">
                    +41 123 456 789
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-300" />
                  <a href="mailto:info@biofactor.ag" className="hover:text-white">
                    info@biofactor.ag
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-200/60">
          <span>© {new Date().getFullYear()} Biofactor AG. All rights reserved.</span>

          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/sitemap" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) => (
  <div>
    <h4 className="font-semibold text-base mb-3">{title}</h4>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.name}>
          <Link
            to={link.href}
            className="text-sm text-emerald-200/70 hover:text-white transition-all"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
