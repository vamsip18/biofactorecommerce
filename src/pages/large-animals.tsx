// src/components/products/large-animals.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout"; 
import { 
  Filter, 
  ChevronDown, 
  Grid, 
  List, 
  Search, 
  X, 
  ShoppingCart,
  Heart,
  Package,
  Clock,
  Sliders,
  ArrowUpDown,
  Minus,
  Plus,
  Share2,
  Truck,
  Shield,
  Check,
  X as XIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// Complete product data - Add formulation and coverage fields
const largeAnimalProducts = [
  {
    id: 1,
    name: "Aadhar Gold Biofertilizer - Foundation Granules - 4Kg",
    description: "Premium biofertilizer for soil health",
    price: 1150.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Biofertilizer",
    tags: ["Organic", "Soil Health"],
    inStock: true,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Aadhar Gold is a premium biofertilizer that enhances soil health and promotes plant growth through natural microbial action."
  },
  {
    id: 2,
    name: "AgriSeal - Protect Crops from Biotic Stress",
    description: "Protection against biotic stress factors",
    price: 998.00,
    originalPrice: 1200.00,
    vendor: "Biofactor",
    category: "Crop Protection",
    tags: ["Protection", "Stress Management"],
    inStock: true,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1597848212624-e5f4b41d7f50?w=400&h=400&fit=crop",
    details: "Agriseal is a specially formulated liquid blend crafted using advanced techniques to alleviate stress in plants. Enriched with vitamin C, amino acids, selenium, silica, and seaweed, this formulation serves as a valuable aid in mitigating various stresses encountered by crops, including climatic stressors like drought, heat, cold, and salinity, as well as biotic stresses.",
    advantages: [
      "Helps plants cope with a variety of stresses, including climatic stresses such as drought, heat, cold and salinity, and biotic stresses (such as pests and diseases).",
      "Actively participates in various metabolic processes in plants including metabolism of carbohydrates and synthesis of nucleic acids and enhances plant growth and resistance to stress.",
      "It overcomes the stresses during the most critical flowering stage, pod stage and more harvests during the plant growth stage and provides high quality yields."
    ],
    dosage: "Spray mode : 500 ml/acre (2.5 ml/liter of water). Drip Irrigation System : 1 L/acre.",
    frequency: "Once during waterlogging and once during flowering, fruiting and heavy harvests.",
    sizes: ["250 ml", "500 ml", "1 litre"]
  },
  {
    id: 3,
    name: "Belom Series - Fermented Liquid Organic Manure - 1Ltr & 5 Ltr",
    description: "Fermented organic manure for plants",
    price: 588.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Organic Manure",
    tags: ["Organic", "Liquid"],
    inStock: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1615485500607-1758f56c2c8a?w=400&h=400&fit=crop",
    details: "Fermented liquid organic manure for enhanced plant growth."
  },
  {
    id: 4,
    name: "BIOBOLIC | Potent Echolic & Uterine Tonic",
    description: "Uterine tonic for animal health",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Animal Health",
    tags: ["Tonic", "Uterine Health"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1557735938-cb4b0d11c73a?w=400&h=400&fit=crop",
    details: "Potent echolic and uterine tonic for large animals."
  },
  {
    id: 5,
    name: "BIOCOPS | supplemental source of copper",
    description: "Copper supplement for animals",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Supplements",
    tags: ["Copper", "Mineral"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1589923186741-b7d59d6b2c4c?w=400&h=400&fit=crop",
    details: "Supplemental copper source for animal nutrition."
  },
  {
    id: 6,
    name: "BIOFLORA | A herbal product for ruminant fertility",
    description: "Herbal fertility support for ruminants",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Fertility",
    tags: ["Herbal", "Fertility"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    details: "Herbal product to enhance ruminant fertility."
  },
  {
    id: 7,
    name: "BIOMAST | A New approach for mastitis",
    description: "Mastitis treatment solution",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Animal Health",
    tags: ["Mastitis", "Treatment"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c033a88e?w=400&h=400&fit=crop",
    details: "Innovative approach for mastitis treatment."
  },
  {
    id: 8,
    name: "BIOMAST | Check mastitis at early stage",
    description: "Early mastitis detection and prevention",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Animal Health",
    tags: ["Mastitis", "Prevention"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop",
    details: "Early stage mastitis detection and prevention."
  },
  {
    id: 9,
    name: "BIOMISE | Proven Probiotics for Ruminants",
    description: "Probiotic supplement for ruminant health",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Probiotics",
    tags: ["Probiotics", "Digestive Health"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1551183053-bf91a717b63d?w=400&h=400&fit=crop",
    details: "Proven probiotics for ruminant digestive health."
  },
  {
    id: 10,
    name: "BIOTEN | Heightens Bioavailable Minerals",
    description: "Mineral bioavailability enhancer",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Supplements",
    tags: ["Minerals", "Bioavailability"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop",
    details: "Enhances mineral bioavailability in animals."
  },
  {
    id: 11,
    name: "BIOTRICA | For Greater Tonicity of the uterus",
    description: "Uterine tonicity support",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Animal Health",
    tags: ["Uterine", "Tonic"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop",
    details: "Improves uterine tonicity in large animals."
  },
  {
    id: 12,
    name: "BIOVITAL - H | vitamin A,D,E & H suspension",
    description: "Vitamin suspension for animals",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Vitamins",
    tags: ["Vitamins", "Suspension"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Vitamin A, D, E & H suspension for animal health."
  },
  {
    id: 13,
    name: "BIOVITAL | Liquid vet",
    description: "Liquid veterinary supplement",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Supplements",
    tags: ["Liquid", "Veterinary"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=400&fit=crop",
    details: "Liquid veterinary supplement for comprehensive care."
  },
  {
    id: 14,
    name: "BLOGO | with Suspension base",
    description: "Suspension-based animal supplement",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Supplements",
    tags: ["Suspension", "Supplement"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1557844352-761f16da8c67?w=400&h=400&fit=crop",
    details: "Suspension-based supplement for animal health."
  },
  {
    id: 15,
    name: "BOC - A Revolutionary Bio-Organic Carbon Product",
    description: "Bio-organic carbon for soil",
    price: 1040.00,
    originalPrice: 1200.00,
    vendor: "Biofactor",
    category: "Organic Carbon",
    tags: ["Carbon", "Organic"],
    inStock: true,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Revolutionary bio-organic carbon product for soil enhancement."
  },
  {
    id: 16,
    name: "Bsl4 Agri",
    description: "Agricultural growth enhancer",
    price: 1333.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Growth Enhancer",
    tags: ["Growth", "Enhancer"],
    inStock: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Agricultural growth enhancer for improved yields."
  },
  {
    id: 17,
    name: "Caliber | The Next Big Thing is Really Small",
    description: "Microbial formulation",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Microbial",
    tags: ["Microbial", "Formulation"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Advanced microbial formulation for agricultural use."
  },
  {
    id: 18,
    name: "Dawn",
    description: "Early morning plant energizer",
    price: 2699.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Plant Care",
    tags: ["Energizer", "Morning"],
    inStock: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Early morning plant energizer and growth promoter."
  },
  {
    id: 19,
    name: "E- Vac - EHP Remedy",
    description: "EHP treatment solution",
    price: 2911.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Disease Control",
    tags: ["EHP", "Treatment"],
    inStock: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Effective EHP remedy for agricultural use."
  },
  {
    id: 20,
    name: "Eight Petals - Home Gardening Kit",
    description: "Complete home gardening solution",
    price: 700.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Gardening",
    tags: ["Gardening", "Home"],
    inStock: true,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Complete home gardening kit with essential tools."
  },
  {
    id: 21,
    name: "FactminNeo",
    description: "Mineral supplement",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Supplements",
    tags: ["Minerals", "Supplement"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Neo formulation mineral supplement."
  },
  {
    id: 22,
    name: "Ferti-stim | Bolus (vet)",
    description: "Fertility stimulation bolus",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Fertility",
    tags: ["Fertility", "Bolus"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Fertility stimulation bolus for veterinary use."
  },
  {
    id: 23,
    name: "G-Vam - Liquid",
    description: "Liquid growth promoter",
    price: 4126.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Growth Promoter",
    tags: ["Growth", "Liquid"],
    inStock: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Liquid growth promoter for plants."
  },
  {
    id: 24,
    name: "Gallant | A high potency iron tonic for animals",
    description: "Iron tonic for animals",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Animal Health",
    tags: ["Iron", "Tonic"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "High potency iron tonic for animal health."
  },
  {
    id: 25,
    name: "High- K Aqua",
    description: "Aquatic potassium supplement",
    price: 1119.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Aqua Culture",
    tags: ["Potassium", "Aqua"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "High potassium supplement for aquatic systems."
  },
  {
    id: 26,
    name: "High-K Liquid Nutrient",
    description: "Liquid potassium nutrient",
    price: 1800.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Nutrients",
    tags: ["Potassium", "Liquid"],
    inStock: true,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "High potassium liquid nutrient formulation."
  },
  {
    id: 27,
    name: "I-Rise | The Next Big Thing is Really Small",
    description: "Microbial growth promoter",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Microbial",
    tags: ["Microbial", "Growth"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Microbial growth promoter for enhanced yields."
  },
  {
    id: 28,
    name: "IINM Chakra -",
    description: "Circular farming solution",
    price: 736.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Farming",
    tags: ["Circular", "Farming"],
    inStock: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Circular farming solution for sustainable agriculture."
  },
  {
    id: 29,
    name: "K Factor – Potassium Mobilising Bacteria",
    description: "Potassium mobilizing bacteria",
    price: 1106.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Bacteria",
    tags: ["Potassium", "Bacteria"],
    inStock: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Potassium mobilizing bacteria for soil health."
  },
  {
    id: 30,
    name: "KAL FACT | Chelated",
    description: "Chelated mineral supplement",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Supplements",
    tags: ["Chelated", "Minerals"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Chelated mineral supplement for better absorption."
  },
  {
    id: 31,
    name: "King- K",
    description: "Premium potassium formulation",
    price: 0.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Nutrients",
    tags: ["Potassium", "Premium"],
    inStock: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Premium potassium formulation for plants."
  },
  {
    id: 32,
    name: "Kipper - 5 Ltr",
    description: "Large volume formulation",
    price: 3807.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Formulations",
    tags: ["Large", "Volume"],
    inStock: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "5 liter formulation for agricultural use."
  },
  {
    id: 33,
    name: "LIVOFACT | Liquid vet",
    description: "Liquid veterinary formulation",
    price: 0.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Veterinary",
    tags: ["Liquid", "Vet"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Liquid veterinary formulation for animal health."
  },
  {
    id: 34,
    name: "MINOFACT | A Complete Nutritional formula",
    description: "Complete nutritional formula",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Nutrition",
    tags: ["Complete", "Nutrition"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Complete nutritional formula for animals."
  },
  {
    id: 35,
    name: "Modiphy",
    description: "Growth modification formula",
    price: 1568.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Growth",
    tags: ["Growth", "Modification"],
    inStock: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Growth modification formula for plants."
  },
  {
    id: 36,
    name: "Native Neem - Natural Insecticide",
    description: "Natural neem insecticide",
    price: 866.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Insecticide",
    tags: ["Neem", "Natural"],
    inStock: true,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Natural neem-based insecticide for pest control."
  },
  {
    id: 37,
    name: "Nutrition & Virnix",
    description: "Nutrition and viral protection",
    price: 1716.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Nutrition",
    tags: ["Nutrition", "Viral"],
    inStock: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Combined nutrition and viral protection formula."
  },
  {
    id: 38,
    name: "Pellucid | A Perfect Blend For Ruminant Liver",
    description: "Liver support for ruminants",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Liver Support",
    tags: ["Liver", "Ruminant"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Perfect blend for ruminant liver health."
  },
  {
    id: 39,
    name: "Proceed -",
    description: "Advanced growth formula",
    price: 1080.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Growth",
    tags: ["Advanced", "Growth"],
    inStock: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Advanced growth formula for agriculture."
  },
  {
    id: 40,
    name: "Regalis - 1Kg",
    description: "Plant growth regulator",
    price: 2832.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Growth Regulator",
    tags: ["Regulator", "Growth"],
    inStock: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Plant growth regulator for controlled growth."
  },
  {
    id: 41,
    name: "Rumifact | Bolus (vet)",
    description: "Ruminant digestive bolus",
    price: 100.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Digestive",
    tags: ["Ruminant", "Bolus"],
    inStock: false,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Bolus for ruminant digestive health."
  },
  {
    id: 42,
    name: "Sea Factor",
    description: "Seaweed-based formulation",
    price: 1679.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Seaweed",
    tags: ["Seaweed", "Natural"],
    inStock: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Seaweed-based natural formulation for plants."
  },
  {
    id: 43,
    name: "V-Vacc",
    description: "Vaccine for plants",
    price: 2799.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Vaccine",
    tags: ["Vaccine", "Protection"],
    inStock: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Plant vaccine for disease protection."
  },
  {
    id: 44,
    name: "Virban 1 Ltr",
    description: "Viral protection formula",
    price: 2575.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Viral Protection",
    tags: ["Viral", "Protection"],
    inStock: true,
    isBestSeller: false,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "1 liter viral protection formula for plants."
  },
  {
    id: 45,
    name: "Virban 2.0",
    description: "Advanced viral protection",
    price: 2499.00,
    originalPrice: null,
    vendor: "Biofactor",
    category: "Viral Protection",
    tags: ["Advanced", "Viral"],
    inStock: true,
    isBestSeller: true,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    details: "Advanced version of viral protection formula."
  },
]

// Add formulation and coverage to all products
const completeProducts = largeAnimalProducts.map(product => ({
  ...product,
  formulation: product.formulation || "Standard",
  coverage: product.coverage || "Standard Coverage"
}));

const sortOptions = [
  { value: "name-asc", label: "Alphabetically, A-Z" },
  { value: "name-desc", label: "Alphabetically, Z-A" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "best-selling", label: "Best Selling" },
  { value: "in-stock", label: "In Stock First" }
];

const priceRanges = [
  { id: "range1", min: 0, max: 500, label: "Under Rs. 500" },
  { id: "range2", min: 500, max: 1000, label: "Rs. 500 - Rs. 1000" },
  { id: "range3", min: 1000, max: 2000, label: "Rs. 1000 - Rs. 2000" },
  { id: "range4", min: 2000, max: 5000, label: "Rs. 2000 - Rs. 5000" },
  { id: "range5", min: 5000, max: Infinity, label: "Over Rs. 5000" }
];

// Filter Section Component
const FilterSection = ({ 
  filters, 
  setFilters 
}: { 
  filters: {
    availability: string[];
    priceRanges: string[];
    search: string;
  };
  setFilters: (filters: any) => void;
}) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    availability: true
  });

  const toggleSection = (section: 'price' | 'availability') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-10 border-green-200 focus:border-green-400"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
      </div>

      {/* Availability Filter */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900">Availability</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${
            expandedSections.availability ? 'rotate-180' : ''
          }`} />
        </button>
        
        {expandedSections.availability && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.availability.includes('in-stock')}
                onChange={(e) => {
                  const newAvailability = e.target.checked 
                    ? [...filters.availability, 'in-stock']
                    : filters.availability.filter(v => v !== 'in-stock');
                  setFilters({ ...filters, availability: newAvailability });
                }}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">In Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.availability.includes('out-of-stock')}
                onChange={(e) => {
                  const newAvailability = e.target.checked 
                    ? [...filters.availability, 'out-of-stock']
                    : filters.availability.filter(v => v !== 'out-of-stock');
                  setFilters({ ...filters, availability: newAvailability });
                }}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Out of Stock</span>
            </label>
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900">Price</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${
            expandedSections.price ? 'rotate-180' : ''
          }`} />
        </button>
        
        {expandedSections.price && (
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.priceRanges.includes(range.id)}
                  onChange={(e) => {
                    const newPriceRanges = e.target.checked 
                      ? [...filters.priceRanges, range.id]
                      : filters.priceRanges.filter(v => v !== range.id);
                    setFilters({ ...filters, priceRanges: newPriceRanges });
                  }}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {(filters.priceRanges.length > 0 || filters.availability.length > 0 || filters.search) && (
        <Button
          variant="outline"
          className="w-full border-green-200 text-green-700 hover:bg-green-50"
          onClick={() => setFilters({ availability: [], priceRanges: [], search: '' })}
        >
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};

// Product Card Component - FIXED: All buttons in same line
const ProductCard = ({ 
  product, 
  onClick 
}: { 
  product: typeof completeProducts[0];
  onClick: () => void;
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      formulation: product.formulation,
      coverage: product.coverage
    });
    toast.success("Added to cart");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="relative flex-1">
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-50 to-white">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isBestSeller && (
              <Badge className="bg-green-600 text-white text-xs font-semibold">
                Best Seller
              </Badge>
            )}
            {!product.inStock && (
              <Badge className="bg-red-500 text-white text-xs font-semibold">
                Sold Out
              </Badge>
            )}
          </div>
          
          {/* Wishlist Button */}
          <button 
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              toast.info("Added to wishlist");
            }}
          >
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-500 mb-2 line-clamp-1">{product.description}</p>
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Package className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{product.vendor}</span>
          </div>

          <div className="flex items-center justify-between gap-4 mt-3">
  {/* Price Section */}
  <div className="flex-1">
    <div className="text-lg font-bold text-gray-900">
      Rs. {product.price.toFixed(2)}
    </div>
    {product.originalPrice && (
      <div className="text-sm text-gray-500 line-through">
        Rs. {product.originalPrice.toFixed(2)}
      </div>
    )}
  </div>

  

  {/* Add to Cart Button */}
  <div className="flex-shrink-0">
    <Button 
      size="sm"
      className={`${
        !product.inStock 
          ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
          : "bg-green-600 hover:bg-green-700 text-white"
      }`}
      disabled={!product.inStock}
      onClick={handleAddToCart}
    >
      {!product.inStock ? (
        <>
          <Clock className="w-3 h-3 mr-1" />
          <span className="text-xs">Sold Out</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-3 h-3 mr-1" />
          <span className="text-xs">Add</span>
        </>
      )}
    </Button>
  </div>
</div>
        </div>  
      </div>
    </motion.div>
  );
};

// Product Modal Component
const ProductModal = ({ 
  product, 
  isOpen, 
  onClose 
}: { 
  product: typeof completeProducts[0] | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      formulation: product.formulation,
      coverage: product.coverage
    });
    toast.success("Added to cart");
    onClose();
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/cart";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <Package className="w-4 h-4" />
              <span className="text-sm text-gray-600">Vendor: {product.vendor}</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="space-y-4">
            <div className="relative h-80 rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-white">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isBestSeller && (
                <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                  Best Seller
                </Badge>
              )}
            </div>
            
            {/* Share Button */}
            <Button variant="outline" className="w-full border-green-200">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Price */}
            <div>
              <div className="text-3xl font-bold text-gray-900">
                Rs. {product.price.toFixed(2)}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Shipping calculated at checkout.
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border text-sm ${
                        selectedSize === size
                          ? "border-green-600 bg-green-50 text-green-700"
                          : "border-gray-300 hover:border-green-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-full border border-gray-300 hover:border-green-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-full border border-gray-300 hover:border-green-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {quantity} × Rs. {product.price.toFixed(2)} = Rs. {(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to cart
              </Button>
              <Button 
                className="flex-1 border-green-600 text-green-600 hover:bg-green-50 h-12 text-lg" 
                variant="outline"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                Buy it now
              </Button>
            </div>

            {/* Product Details */}
            <div className="pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 mb-4">{product.details}</p>
              
              {product.advantages && (
                <>
                  <h4 className="font-semibold text-gray-900 mb-2">Advantages:</h4>
                  <ul className="space-y-2 mb-4">
                    {product.advantages.map((advantage, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-4 h-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              
              {product.dosage && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Dose:</h4>
                  <p className="text-gray-600">{product.dosage}</p>
                </div>
              )}
              
              {product.frequency && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Frequency of application:</h4>
                  <p className="text-gray-600">{product.frequency}</p>
                </div>
              )}
              
              {product.sizes && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Available sizes:</h4>
                  <p className="text-gray-600">{product.sizes.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// List View Item Component - FIXED: All buttons in same line
const ListViewItem = ({ 
  product, 
  onClick 
}: { 
  product: typeof completeProducts[0];
  onClick: () => void;
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      formulation: product.formulation,
      coverage: product.coverage
    });
    toast.success("Added to cart");
  };

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 hover:border-green-300 p-4 md:p-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="md:w-1/4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 md:h-full object-cover rounded-lg"
          />
        </div>
        <div className="md:w-3/4 flex flex-col">
          <div className="flex-1">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-green-50 text-green-700 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Price and Add to Cart in same line */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
            <div className="w-full sm:w-auto flex items-center gap-4">
              <div>
                <div className="text-xl md:text-2xl font-bold text-gray-900">
                  Rs. {product.price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  Vendor: {product.vendor}
                </div>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <Button 
                className={`w-full sm:w-auto ${
                  !product.inStock 
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                {!product.inStock ? "Sold Out" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const LargeAnimalsProducts = () => {
  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<typeof completeProducts[0] | null>(null);
  const [filters, setFilters] = useState({
    availability: [] as string[],
    priceRanges: [] as string[],
    search: ''
  });

  const productsPerPage = 12;

  // Apply filters and sorting
  const filteredAndSortedProducts = completeProducts
    .filter(product => {
      // Search filter
      if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Availability filter
      if (filters.availability.length > 0) {
        const inStockFilter = filters.availability.includes('in-stock');
        const outOfStockFilter = filters.availability.includes('out-of-stock');
        
        if (inStockFilter && outOfStockFilter) {
          // Show both
        } else if (inStockFilter && !product.inStock) {
          return false;
        } else if (outOfStockFilter && product.inStock) {
          return false;
        }
      }
      
      // Price range filter
      if (filters.priceRanges.length > 0) {
        const matchesPriceRange = filters.priceRanges.some(rangeId => {
          const range = priceRanges.find(r => r.id === rangeId);
          if (!range) return false;
          return product.price >= range.min && product.price <= range.max;
        });
        if (!matchesPriceRange) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "best-selling":
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        case "in-stock":
          return (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0);
        default:
          return 0;
      }
    });

  // Calculate pagination
  const totalProducts = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900 to-green-900 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Large Animal Products</h1>
            <p className="text-green-100">
              Premium biofactor solutions for large animal health and care
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="lg:w-1/4 hidden lg:block">
              <div className="sticky top-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filters
                    </h2>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {filteredAndSortedProducts.filter(p => p.inStock).length} in stock
                    </Badge>
                  </div>
                  <FilterSection filters={filters} setFilters={setFilters} />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:w-3/4">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6">
                <Button
                  onClick={() => setMobileFiltersOpen(true)}
                  variant="outline"
                  className="w-full justify-center border-green-200 text-green-700"
                >
                  <Sliders className="w-4 h-4 mr-2" />
                  Show Filters ({Object.values(filters).flat().length + (filters.search ? 1 : 0)})
                </Button>
              </div>

              {/* Results Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} products
                    </p>
                    <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                    {/* Sort By */}
                    <div className="relative w-full sm:w-auto">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white border border-green-200 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 w-full"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center border border-green-200 rounded-lg overflow-hidden w-full sm:w-auto">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`flex-1 sm:flex-none p-2 text-center ${
                          viewMode === "grid" ? "bg-green-50 text-green-700" : "text-gray-500"
                        }`}
                      >
                        <Grid className="w-5 h-5 inline" />
                        <span className="ml-2 text-sm hidden sm:inline">Grid</span>
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`flex-1 sm:flex-none p-2 text-center ${
                          viewMode === "list" ? "bg-green-50 text-green-700" : "text-gray-500"
                        }`}
                      >
                        <List className="w-5 h-5 inline" />
                        <span className="ml-2 text-sm hidden sm:inline">List</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col"} gap-6 mb-8`}>
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    viewMode === "grid" ? (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onClick={() => setSelectedProduct(product)}
                      />
                    ) : (
                      <ListViewItem
                        key={product.id}
                        product={product}
                        onClick={() => setSelectedProduct(product)}
                      />
                    )
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                    <Button
                      variant="outline"
                      className="mt-4 border-green-200 text-green-700"
                      onClick={() => setFilters({ availability: [], priceRanges: [], search: '' })}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="border-green-200"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    // Show only first, last, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={index}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`${
                            currentPage === pageNum 
                              ? "bg-green-600 hover:bg-green-700" 
                              : "border-green-200"
                          }`}
                        >
                          {pageNum}
                        </Button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return <span key={index} className="text-gray-500">...</span>;
                    }
                    return null;
                  })}
                  
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="border-green-200"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween" }}
                className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button onClick={() => setMobileFiltersOpen(false)}>
                      <XIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <FilterSection filters={filters} setFilters={setFilters} />
                  <Button
                    className="w-full mt-6 bg-green-600 hover:bg-green-700"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Product Modal */}
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </Layout>
  );
};