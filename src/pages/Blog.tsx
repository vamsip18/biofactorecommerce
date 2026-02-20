import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import {
  Calendar, ArrowRight, Clock, User, Tag, BookOpen,
  TrendingUp, Search, Filter, Heart, Share2, Eye,
  MessageCircle, ChevronRight, Bookmark, Star, ChevronLeft,
  Copy, Droplets, Leaf, Sprout, Wheat, TreePine,
  CloudRain, ThermometerSun, Shield, BarChart3, Grid,
  List, Sliders, ArrowUpDown, ChevronDown, X, Plus,
  Minus, ShoppingCart, Filter as FilterIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTranslation } from '@/contexts/LanguageContext';

// Types based on your database schema
interface BlogPost {
  id: string;
  title: string;
  subheading: string | null;
  content: string | null;
  primary_intent: string | null;
  tags: string[] | null;
  topic: string | null;
  country: string | null;
  service: string | null;
  image_url: string | null;
  created_at: string;
  // Additional frontend properties
  excerpt?: string;
  readTime?: string;
  author?: string;
  authorRole?: string;
  authorImage?: string;
  category?: string;
  views?: number;
  likes?: number;
  comments?: number;
  trending?: boolean;
  color?: string;
  featured?: boolean;
}

// Additional dummy articles for BioFact agriculture and fertilizers
const dummyArticles = [
  {
    id: "biofact-1",
    title: "Revolutionizing Crop Yields with Bio-Organic Fertilizers",
    subheading: "How BioFact's innovative bio-fertilizers are transforming sustainable agriculture across India",
    excerpt: "Discover how BioFact's cutting-edge bio-organic fertilizers are increasing crop yields by up to 40% while reducing chemical dependency.",
    content: `# Revolutionizing Crop Yields with Bio-Organic Fertilizers

## The BioFact Advantage in Modern Agriculture

In an era where sustainable farming practices are no longer optional but essential, BioFact stands at the forefront of agricultural innovation. Our bio-organic fertilizers represent a paradigm shift in how we nourish crops while preserving soil health.

### Understanding Bio-Organic Fertilizers

Bio-organic fertilizers are natural products enriched with beneficial microorganisms that work symbiotically with plants. Unlike chemical fertilizers that provide direct nutrients, bio-fertilizers enhance the soil's natural fertility through microbial activity.

**Key Components of BioFact Bio-Fertilizers:**
- Nitrogen-fixing bacteria (Rhizobium, Azotobacter)
- Phosphate-solubilizing microorganisms
- Potassium-mobilizing bacteria
- Plant growth-promoting rhizobacteria (PGPR)
- Organic matter from plant and animal waste

### Scientific Benefits Backed by Research

**Increased Nutrient Availability**
Studies show that BioFact fertilizers increase nutrient availability by 60-70% compared to conventional methods. The microorganisms break down complex organic compounds into forms easily absorbed by plants.

**Enhanced Soil Structure**
Regular use improves soil aggregation, water retention, and aeration. Our farmers report 25% better water retention in treated soils.

**Reduced Chemical Dependency**
Farmers using BioFact products have reduced chemical fertilizer usage by 40-60% within two growing seasons.

### Case Study: Rice Cultivation in Punjab

A 2-year study involving 500 farmers demonstrated remarkable results:

**Year 1 Results:**
- 22% increase in yield compared to chemical fertilizers
- 35% reduction in fertilizer costs
- Improved soil pH balance

**Year 2 Results:**
- 38% yield increase over baseline
- 52% cost reduction in inputs
- Enhanced soil microbial diversity

### Application Guidelines for Maximum Efficiency

**For Cereal Crops (Wheat, Rice, Maize):**
- Apply 5-10 kg per acre during sowing
- Mix with farmyard manure for enhanced results
- Top dressing after 30 days of sowing

**For Horticultural Crops:**
- 2-3 kg per acre for fruit trees
- Liquid formulation for drip irrigation systems
- Foliar spray during flowering stage

### Environmental Impact Assessment

BioFact's commitment to sustainability extends beyond crop production:

**Carbon Footprint Reduction:**
- 65% lower carbon emissions compared to synthetic fertilizers
- Carbon sequestration in treated soils
- Reduced nitrate leaching into water systems

**Biodiversity Preservation:**
- Increased earthworm population by 300%
- Enhanced beneficial insect habitat
- Preservation of soil microbiome diversity

### Future Directions and Innovations

BioFact R&D is currently developing:
1. **Climate-Resilient Formulations** for drought-prone regions
2. **Crop-Specific Blends** optimized for different plant families
3. **Smart Delivery Systems** using nanotechnology
4. **Digital Monitoring Tools** for precision application

### Conclusion: The Sustainable Choice

Choosing BioFact bio-organic fertilizers isn't just about better crop yields—it's about building resilient agricultural systems that can feed future generations without compromising environmental integrity. Join thousands of farmers who have made the switch to sustainable productivity.

**Ready to Transform Your Farming Practice?**
Contact our agricultural experts today for a personalized soil assessment and fertilizer recommendation.`,
    category: "Bio-Fertilizers",
    tags: ["BioFact", "Organic Farming", "Soil Health", "Sustainable Agriculture", "Microbial Inoculants"],
    color: "from-green-500 to-emerald-600",
    image: "https://images.unsplash.com/photo-1597848212624-e82769e2d4f2?w=800&h=500&fit=crop"
  },
  {
    id: "biofact-2",
    title: "The Science Behind Plant Growth Promoting Rhizobacteria",
    subheading: "How PGPR technology in BioFact fertilizers enhances plant immunity and productivity",
    excerpt: "Exploring the microbial magic that makes BioFact fertilizers superior for plant health and soil vitality.",
    content: `# The Science Behind Plant Growth Promoting Rhizobacteria (PGPR)

## Microbial Allies in Modern Agriculture

Plant Growth Promoting Rhizobacteria represent one of the most significant breakthroughs in sustainable agriculture. These beneficial bacteria form symbiotic relationships with plant roots, creating a protective and nutritive environment that naturally enhances crop performance.

### What Are PGPR?

PGPR are naturally occurring soil bacteria that colonize plant roots and stimulate growth through various mechanisms. BioFact has developed proprietary strains that offer multiple benefits simultaneously.

**Classification of PGPR in BioFact Products:**

1. **Direct Growth Promoters:**
   - Nitrogen fixation
   - Phosphate solubilization
   - Siderophore production
   - Phytohormone production

2. **Indirect Growth Promoters:**
   - Antibiotic production
   - Lytic enzyme secretion
   - Induced Systemic Resistance (ISR)
   - Competition for nutrients with pathogens

### Mechanism of Action

**Root Colonization Process:**
1. **Chemotaxis:** Bacteria move toward root exudates
2. **Adhesion:** Firm attachment to root surfaces
3. **Colonization:** Multiplication and biofilm formation
4. **Metabolic Activity:** Beneficial compound production

**Key Metabolic Products:**
- Indole-3-acetic acid (IAA): Stimulates root elongation
- Gibberellins: Enhance stem growth
- Cytokinins: Promote cell division
- Siderophores: Chelate iron for plant use
- ACC deaminase: Reduces ethylene stress

### Field Performance Data

**Multi-Crop Analysis (2023 Season):**

| Crop | Yield Increase | Disease Reduction | Water Use Efficiency |
|------|---------------|-------------------|---------------------|
| Wheat | 28% | 45% | +18% |
| Rice | 32% | 52% | +22% |
| Cotton | 25% | 38% | +15% |
| Tomato | 41% | 67% | +25% |
| Soybean | 29% | 44% | +20% |

### Integration with Traditional Practices

**Compatibility with:**
- Organic manure and compost
- Green manure crops
- Crop rotation systems
- Conservation tillage

**Incompatibility with:**
- Broad-spectrum chemical pesticides
- Certain fungicides (check compatibility chart)
- High-dose chemical fertilizers

### Quality Assurance and Shelf Life

**BioFact Quality Standards:**
- Minimum 10^8 CFU/g viable cells
- Contamination-free certification
- Strain purity verification
- Temperature stability testing

**Storage Guidelines:**
- Store at 15-25°C in dry conditions
- Avoid direct sunlight
- Use within 12 months of manufacture
- Protect from moisture

### Environmental Benefits

**Soil Health Restoration:**
- Increases organic carbon by 1.5-2%
- Improves soil enzyme activity
- Enhances aggregate stability
- Reduces soil-borne diseases

**Water Conservation:**
- Improved water infiltration
- Reduced irrigation requirements
- Decreased runoff pollution

### Future Research Directions

BioFact's ongoing research focuses on:
1. **Climate-Adaptive Strains** for extreme weather conditions
2. **Multi-Strain Consortia** for synergistic effects
3. **Seed Coating Technologies** for precise application
4. **Digital Monitoring Systems** for microbial activity tracking

### Getting Started with PGPR Technology

**For New Users:**
1. Start with recommended crops
2. Follow application guidelines precisely
3. Monitor soil conditions regularly
4. Keep detailed growth records

**Success Tips:**
- Combine with organic matter
- Maintain optimal soil moisture
- Avoid chemical interference
- Practice crop rotation

**Technical Support:**
Our agricultural scientists are available for field consultations, soil testing, and customized recommendations based on your specific farming conditions.`,
    category: "Microbial Technology",
    tags: ["PGPR", "Soil Microbiome", "Plant Immunity", "Biological Control", "Root Health"],
    color: "from-blue-500 to-cyan-600",
    image: "https://images.unsplash.com/photo-1589923186741-b7d59d6b2c4a?w=800&h=500&fit=crop"
  },
  {
    id: "biofact-3",
    title: "Vermicompost Enrichment with BioFact Supplements",
    subheading: "Transforming organic waste into premium organic fertilizer with enhanced microbial activity",
    excerpt: "Learn how to supercharge your vermicompost production with BioFact's specialized microbial supplements.",
    content: `# Vermicompost Enrichment with BioFact Supplements

## The Gold Standard of Organic Fertilizers

Vermicompost, often called "black gold" in organic farming, represents nature's perfect recycling system. When enhanced with BioFact's proprietary microbial supplements, it transforms into a super-fertilizer with unparalleled benefits for soil and plants.

### Why Enhance Vermicompost?

While traditional vermicompost is excellent, BioFact-enriched vermicompost offers:

**Enhanced Properties:**
- 3x higher microbial diversity
- 5x faster nutrient release
- 40% more plant-available nutrients
- Extended shelf life and stability

### The BioFact Enrichment Process

**Step 1: Base Vermicompost Preparation**
Start with high-quality vermicompost produced from:
- Farmyard manure (aged 15-20 days)
- Agricultural waste (paddy straw, sugarcane trash)
- Kitchen waste (vegetable peels, fruit waste)
- Leaf litter and crop residues

**Step 2: Microbial Inoculation**
Add BioFact Vermi-Boost powder at 500g per 100kg vermicompost:
- Mix thoroughly in layers
- Maintain 40-50% moisture
- Cover with jute bags for 48 hours

**Step 3: Maturation Phase**
Allow 7-10 days for microbial colonization:
- Turn every 3 days
- Monitor temperature (25-35°C optimal)
- Check for earthy smell development

### Quality Parameters of Enriched Vermicompost

**Physical Properties:**
- Dark brown to black color
- Fine, granular texture
- Earthy, pleasant odor
- 40-50% moisture content

**Chemical Composition:**
- Organic carbon: 12-15%
- Nitrogen: 1.5-2.0%
- Phosphorus: 1.0-1.5%
- Potassium: 1.0-1.2%
- C/N ratio: 10-15:1

**Biological Activity:**
- Microbial count: 10^8-10^9 CFU/g
- Enzyme activity: High phosphatase, urease
- Earthworm cocoons: 50-100/g

### Application Rates for Different Crops

**Field Crops (per acre):**
- Wheat/Rice: 1.5-2 tons
- Cotton: 2-2.5 tons
- Sugarcane: 3-4 tons
- Pulses: 1-1.5 tons

**Horticultural Crops:**
- Fruit trees: 5-10 kg per tree
- Vegetables: 2-3 kg per sq.m
- Flowers: 1-2 kg per sq.m
- Medicinal plants: 1.5-2 kg per sq.m

### Economic Analysis

**Cost-Benefit Comparison (1 acre basis):**

| Parameter | Traditional | BioFact-Enhanced |
|-----------|------------|------------------|
| Initial Cost | ₹ 8,000 | ₹ 9,500 |
| Application Frequency | 2 times | 1 time |
| Yield Increase | 15-20% | 30-40% |
| Net Profit Increase | ₹ 12,000 | ₹ 25,000 |
| ROI | 150% | 263% |

### Success Stories

**Case Study 1: Organic Vegetable Farm, Maharashtra**
- Farm size: 10 acres
- Crops: Tomato, brinjal, capsicum
- Results: 45% yield increase, 60% reduction in pest incidence
- Soil improvement: pH balanced from 8.2 to 7.4

**Case Study 2: Mango Orchard, Uttar Pradesh**
- Orchard size: 25 acres
- Variety: Dashehari, Langra
- Results: 35% fruit yield increase, improved fruit quality
- Soil organic carbon: Increased from 0.4% to 1.2%

### Troubleshooting Common Issues

**Problem 1: Slow decomposition**
**Solution:** Increase microbial inoculant by 20%, maintain optimal moisture

**Problem 2: Unpleasant odor**
**Solution:** Add more dry carbon material, improve aeration

**Problem 3: Low worm activity**
**Solution:** Check pH (6.5-7.5 optimal), reduce ammonia content

**Problem 4: Pest infestation**
**Solution:** Maintain proper covering, use neem cake as additive

### Advanced Techniques

**Liquid Vermicompost (Tea) Production:**
1. Mix 1kg enriched vermicompost in 10L water
2. Aerate for 24-48 hours
3. Strain and use as foliar spray
4. Dilution: 1:10 for soil, 1:20 for foliar

**Seed Treatment:**
- Mix vermicompost with water to make slurry
- Coat seeds and dry in shade
- Plant within 24 hours

**Nursery Application:**
- Mix 30% vermicompost with potting media
- Excellent for seedling growth
- Reduces damping-off diseases

### Environmental Impact

**Waste Reduction:**
- Converts 1 ton waste into 400kg premium fertilizer
- Reduces landfill pressure
- Decreases methane emissions

**Carbon Sequestration:**
- Adds stable organic carbon to soil
- Improves soil carbon stock
- Contributes to climate mitigation

### Future Innovations

BioFact is developing:
1. **Portable Vermicompost Units** for urban farming
2. **Crop-Specific Formulations** with targeted nutrients
3. **Smart Monitoring Sensors** for process optimization
4. **Integrated Pest Management** combinations

### Getting Started

**Beginner's Package:**
- BioFact Vermi-Boost: 1kg
- Instruction manual
- Technical support access
- Soil testing voucher

**Advanced Farmer Package:**
- Bulk inoculants (10kg+)
- On-site training
- Custom formulation options
- Market linkage support

**Join the vermicompost revolution and transform your organic waste into agricultural wealth with BioFact technology!**`,
    category: "Organic Composting",
    tags: ["Vermicompost", "Waste Management", "Organic Matter", "Soil Amendment", "Circular Economy"],
    color: "from-amber-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=500&fit=crop"
  },
  {
    id: "biofact-4",
    title: "Precision Agriculture with BioFact Liquid Fertilizers",
    subheading: "Optimizing nutrient delivery through advanced irrigation and fertigation systems",
    excerpt: "Discover how BioFact's liquid formulations enable precise nutrient management for maximum efficiency.",
    content: `# Precision Agriculture with BioFact Liquid Fertilizers

## The Future of Nutrient Management

In the era of smart farming, precision nutrient delivery has become paramount. BioFact's liquid fertilizer formulations combine advanced biotechnology with practical application systems to deliver nutrients exactly when and where crops need them.

### Advantages of Liquid Fertilizers

**Immediate Benefits:**
- 95-98% nutrient availability
- Uniform application
- Rapid plant uptake
- Compatibility with irrigation systems
- Reduced labor requirements

### BioFact Liquid Product Range

**1. Bio-Liq-N (Nitrogen Enriched):**
- Derived from plant-based amino acids
- Contains nitrogen-fixing bacteria
- Suitable for vegetative growth stage

**2. Bio-Liq-PK (Phosphorus-Potassium):**
- Phosphate-solubilizing microbes
- Potassium-mobilizing bacteria
- Enhanced flowering and fruiting

**3. Bio-Liq-Micro (Micronutrients):**
- Chelated iron, zinc, copper, manganese
- Boron and molybdenum in available forms
- Corrects deficiency symptoms rapidly

**4. Bio-Liq-All (Complete Formula):**
- Balanced NPK with micronutrients
- Growth-promoting hormones
- Stress-alleviating compounds

### Application Systems

**Drip Irrigation Integration:**
- Direct injection into drip lines
- No clogging issues
- Automated dosage control
- Real-time adjustment capability

**Foliar Spray Application:**
- 0.5-2% concentration depending on crop
- Early morning or late evening application
- Complete coverage essential
- Repeat at 10-15 day intervals

**Hydroponic Systems:**
- Sterile formulations available
- pH balanced (5.5-6.5)
- Complete nutrient profiles
- Compatible with all hydroponic methods

### Dosage Recommendations

**Field Crops (per acre per application):**
- Cereals: 2-3 liters
- Pulses: 1.5-2 liters
- Oilseeds: 2-2.5 liters
- Commercial crops: 3-4 liters

**Horticultural Crops:**
- Vegetables: 1-2 ml per liter water
- Fruit trees: 3-5 liters per acre
- Flowers: 0.5-1 ml per liter water
- Plantation crops: 4-6 liters per acre

### Performance Metrics

**Comparative Study Results:**

| Parameter | Chemical Fertilizers | BioFact Liquid | Improvement |
|-----------|---------------------|----------------|-------------|
| Nutrient Use Efficiency | 30-40% | 75-85% | +100% |
| Application Loss | 40-50% | 5-10% | -80% |
| Labor Cost | High | Low | -60% |
| Environmental Impact | High | Minimal | -90% |
| Crop Response Time | 7-10 days | 2-3 days | -70% |

### Economic Analysis

**Cost Comparison (1 Hectare Wheat):**

**Traditional Method:**
- Urea: 150kg @ ₹5/kg = ₹750
- DAP: 100kg @ ₹25/kg = ₹2,500
- MOP: 50kg @ ₹20/kg = ₹1,000
- Application cost: ₹500
- **Total: ₹4,750**

**BioFact Liquid Method:**
- Bio-Liq-Complete: 10 liters @ ₹200/liter = ₹2,000
- Application cost: ₹200
- **Total: ₹2,200**
- **Savings: ₹2,550 (54% reduction)**

**Additional Benefits:**
- Yield increase: 25-30%
- Quality premium: 15-20%
- Reduced irrigation: 20-25%
- Soil health improvement: Priceless

### Integration with Smart Farming

**IoT Compatibility:**
- Sensor-based application
- Weather-adjusted dosing
- Growth stage monitoring
- Mobile app control

**Data Analytics:**
- Nutrient uptake tracking
- Soil sensor integration
- Yield prediction models
- ROI calculation tools

### Environmental Sustainability

**Water Conservation:**
- 30-40% less water requirement
- Reduced nutrient leaching
- Groundwater protection
- Runoff minimization

**Carbon Footprint:**
- 80% lower emissions than production
- Reduced transportation energy
- Local manufacturing
- Renewable energy use

### Success Stories

**Case Study: Precision Farming in Karnataka**
- Farm: 50-acre integrated farm
- Crops: Millets, pulses, vegetables
- System: Automated drip with BioFact liquids
- Results: 45% yield increase, 60% water saving, 70% labor reduction

**Case Study: Greenhouse Tomatoes in Punjab**
- Facility: 1-acre polyhouse
- System: Hydroponics with BioFact nutrients
- Results: 300% higher yield than soil, year-round production, premium pricing

### Troubleshooting Guide

**Common Issues and Solutions:**

1. **Clogging in Drip Lines:**
   - Use filtered formulations
   - Regular flushing
   - Proper dilution

2. **Leaf Burn (Foliar Spray):**
   - Reduce concentration
   - Spray during cooler hours
   - Ensure proper coverage

3. **Uneven Application:**
   - Calibrate equipment
   - Check nozzle function
   - Maintain pressure

4. **Storage Issues:**
   - Store in cool, dark place
   - Use within shelf life
   - Prevent contamination

### Future Developments

**Research Pipeline:**
1. **Nano-Encapsulation** for controlled release
2. **Biostimulant Combinations** for stress tolerance
3. **Crop-Specific Formulations** for niche markets
4. **AI-Powered Recommendation Systems**

### Getting Started

**Starter Kit Includes:**
- 5-liter trial pack (choose formulation)
- Application equipment guide
- Mobile app access
- Technical support hotline

**Training Programs:**
- Online certification course
- Field demonstration sessions
- Equipment handling workshops
- Business development training

**Partner Programs:**
- Dealer opportunities
- Demonstration farm partnerships
- Research collaborations
- Export market development

**Embrace precision agriculture with BioFact liquid fertilizers and join the revolution in efficient, sustainable farming!**`,
    category: "Precision Farming",
    tags: ["Liquid Fertilizers", "Drip Irrigation", "Fertigation", "Smart Farming", "Nutrient Management"],
    color: "from-purple-500 to-violet-600",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=500&fit=crop"
  },
  {
    id: "biofact-5",
    title: "Carbon Farming and Soil Sequestration Techniques",
    subheading: "How BioFact solutions help farmers participate in carbon credit markets while improving soil health",
    excerpt: "Learn practical methods to transform your farm into a carbon sink while boosting productivity and profits.",
    content: `# Carbon Farming and Soil Sequestration Techniques

## Farming for Climate and Profit

Carbon farming represents a revolutionary approach where agriculture becomes part of the climate solution. BioFact provides the tools and techniques to help farmers sequester carbon, improve soil health, and generate additional income through carbon credits.

### Understanding Carbon Sequestration

**The Carbon Cycle in Agriculture:**
- Photosynthesis captures atmospheric CO₂
- Plants convert carbon into organic matter
- Soil microbes stabilize carbon in soil
- Proper management enhances storage

**BioFact's Carbon Farming Approach:**
1. **Increase Inputs:** Add more organic carbon to soil
2. **Reduce Losses:** Minimize carbon oxidation
3. **Enhance Storage:** Improve soil's carbon-holding capacity
4. **Monitor Progress:** Track carbon accumulation

### Core Practices for Carbon Sequestration

**1. Cover Cropping System:**
- Legume covers for nitrogen fixation
- Deep-rooted species for carbon mining
- Multi-species mixes for diversity
- Year-round soil coverage

**Recommended Species:**
- Sunhemp (Crotalaria juncea)
- Dhaincha (Sesbania aculeata)
- Cowpea (Vigna unguiculata)
- Mustard (Brassica spp.)

**2. Conservation Tillage:**
- No-till or reduced tillage
- Maintain soil structure
- Preserve soil organic matter
- Reduce fuel consumption

**Implementation Steps:**
- Start with one field section
- Use appropriate equipment
- Monitor soil compaction
- Adjust as needed

**3. BioFact Enhanced Compost Application:**
- Regular compost application
- BioFact microbial enrichment
- Strategic timing and placement
- Integration with crop rotation

**Application Rates:**
- 2-4 tons per acre annually
- Split applications preferred
- Incorporate into top 6 inches
- Combine with green manure

**4. Agroforestry Integration:**
- Tree planting in agricultural systems
- Silvo-pastoral systems
- Alley cropping
- Windbreaks and shelterbelts

**Suitable Species:**
- Gliricidia sepium
- Leucaena leucocephala
- Moringa oleifera
- Fruit trees intercropped

### Carbon Measurement and Monitoring

**Soil Testing Protocol:**
- Baseline testing before implementation
- Annual monitoring of soil organic carbon
- Use standardized laboratories
- Maintain detailed records

**Key Parameters:**
- Soil Organic Carbon (SOC %)
- Bulk density
- Soil depth
- Carbon stock (tons/ha)

**BioFact Monitoring Services:**
- Free baseline testing for registered farmers
- Annual SOC monitoring
- Carbon stock calculation
- Certification support

### Carbon Credit Economics

**Potential Earnings Calculation:**

**For a 10-acre farm implementing full carbon farming:**

| Year | SOC Increase | Carbon Sequestered | Carbon Credits | Value @ ₹1,500/credit |
|------|-------------|-------------------|----------------|----------------------|
| 1 | 0.2% | 4.4 tons | 4.4 | ₹6,600 |
| 2 | 0.4% | 8.8 tons | 8.8 | ₹13,200 |
| 3 | 0.6% | 13.2 tons | 13.2 | ₹19,800 |
| 4 | 0.8% | 17.6 tons | 17.6 | ₹26,400 |
| 5 | 1.0% | 22.0 tons | 22.0 | ₹33,000 |

**Additional Benefits:**
- Reduced fertilizer costs: 30-40%
- Increased water efficiency: 20-30%
- Higher crop yields: 15-25%
- Improved crop resilience

### Case Studies

**Case Study: Carbon Farming in Madhya Pradesh**
- Farm size: 25 acres
- Cropping system: Soybean-Wheat
- Practices implemented: No-till, cover crops, enhanced compost
- Results after 3 years:
  - SOC increased from 0.45% to 1.05%
  - Carbon credits earned: 55 tons
  - Additional income: ₹82,500
  - Yield increase: 28%
  - Input cost reduction: 35%

**Case Study: Smallholder Integration, Odisha**
- Farm size: 2 acres
- Crops: Vegetables and pulses
- Practices: Vermicompost, mulching, agroforestry
- Results:
  - SOC increased from 0.3% to 0.9%
  - Additional income: ₹8,000 from carbon + ₹12,000 from yield
  - Food security improved
  - Market premium for organic produce

### Step-by-Step Implementation Guide

**Year 1: Foundation Building**
1. Get soil tested for baseline carbon
2. Start vermicompost production
3. Plant one cover crop season
4. Reduce tillage intensity
5. Join BioFact carbon program

**Year 2: System Integration**
1. Implement full cover cropping
2. Adopt conservation tillage
3. Increase organic inputs
4. Plant agroforestry trees
5. Document all practices

**Year 3: Optimization**
1. Fine-tune practices
2. Add more diversity
3. Monitor carbon accumulation
4. Apply for carbon credits
5. Share learnings with community

### BioFact Support Services

**Technical Support:**
- Free initial consultation
- Soil testing and analysis
- Practice planning
- Implementation guidance

**Financial Support:**
- Carbon credit facilitation
- Market linkage
- Premium price access
- Government scheme assistance

**Community Building:**
- Farmer field schools
- Knowledge sharing platforms
- Cooperative formation support
- Market collective development

### Environmental Impact Assessment

**Climate Benefits:**
- CO₂ removal from atmosphere
- Reduced nitrous oxide emissions
- Lower methane emissions
- Enhanced climate resilience

**Biodiversity Enhancement:**
- Improved soil microbiome
- Increased above-ground diversity
- Habitat creation
- Pollinator support

**Water Cycle Improvement:**
- Increased infiltration
- Reduced evaporation
- Groundwater recharge
- Flood mitigation

### Future Vision

**BioFact Carbon Farming 2030 Goals:**
1. **Scale:** 1 million acres under carbon farming
2. **Impact:** 5 million tons CO₂ sequestered annually
3. **Income:** ₹500 crore additional farmer income
4. **Recognition:** Global leadership in agricultural carbon solutions

**Research Initiatives:**
- Advanced carbon measurement techniques
- Climate-smart crop varieties
- Blockchain for carbon credit tracking
- AI for practice optimization

### Getting Started Today

**Immediate Actions:**
1. Contact BioFact carbon farming team
2. Schedule soil testing
3. Attend free webinar
4. Download implementation guide
5. Join pilot program

**Resources Available:**
- Detailed technical manuals
- Video tutorials
- Mobile app for tracking
- Community support groups
- Regular training sessions

**Together, let's build a future where farming heals the planet while feeding it!**`,
    category: "Climate Smart Agriculture",
    tags: ["Carbon Farming", "Climate Change", "Soil Carbon", "Carbon Credits", "Sustainable Land Management"],
    color: "from-teal-500 to-green-600",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop"
  }
];
const Blog = () => {
  const t = useTranslation();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch blog posts from static data
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const dummyPosts = dummyArticles.map(article => ({
        ...article,
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        readTime: calculateReadTime(article.content),
        author: "BioFact Research Team",
        authorRole: "Agricultural Scientist",
        authorImage: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=100&h=100&fit=crop",
        category: article.category,
        tags: article.tags,
        image: article.image,
        featured: Math.random() > 0.8,
        views: Math.floor(Math.random() * 5000),
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 100),
        trending: Math.random() > 0.5,
        color: article.color,
        subheading: article.subheading,
        primary_intent: null,
        topic: article.category,
        country: "India",
        service: "Agricultural Solutions",
        created_at: new Date().toISOString(),
        image_url: article.image
      }));
      setBlogPosts(dummyPosts);
    } finally {
      setLoading(false);
    }
  };

  const getRandomAgricultureImage = () => {
    const images = [
      "https://images.unsplash.com/photo-1597848212624-e82769e2d4f2?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1589923186741-b7d59d6b2c4a?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=500&fit=crop",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop"
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const calculateReadTime = (content: string) => {
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const getRandomColor = () => {
    const colors = [
      "from-green-500 to-emerald-600",
      "from-blue-500 to-cyan-600",
      "from-amber-500 to-orange-600",
      "from-purple-500 to-violet-600",
      "from-teal-500 to-green-600"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const categories = [
    t.blog.allCategories,
    t.blog.bioFertilizers,
    t.blog.microbialTech,
    t.blog.organicCompost,
    t.blog.precisionFarming,
    t.blog.climateSmart
  ];

  const popularTags = [
    "BioFact", "Organic Farming", "Soil Health", "Sustainable Agriculture",
    "Microbial Inoculants", "PGPR", "Soil Microbiome", "Plant Immunity",
    "Biological Control", "Vermicompost", "Waste Management", "Organic Matter",
    "Liquid Fertilizers", "Drip Irrigation", "Fertigation", "Smart Farming",
    "Carbon Farming", "Climate Change", "Soil Carbon", "Carbon Credits"
  ];

  // Filter and sort logic
  const filteredPosts = blogPosts.filter(post => {
    if (selectedCategory !== "All" && post.category !== selectedCategory) return false;
    if (selectedTag && !post.tags?.includes(selectedTag)) return false;
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'popular':
        return (b.views || 0) - (a.views || 0);
      case 'trending':
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      default:
        return 0;
    }
  });

  const postsPerPage = 9;
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = sortedPosts.slice(startIndex, endIndex);

  const toggleLike = (id: string) => {
    setLikedPosts(prev =>
      prev.includes(id) ? prev.filter(postId => postId !== id) : [...prev, id]
    );
  };

  const toggleSave = (id: string) => {
    setSavedPosts(prev =>
      prev.includes(id) ? prev.filter(postId => postId !== id) : [...prev, id]
    );
  };

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedTag(null);
    setSearchQuery("");
  };

  // Filter Section Component
  const FilterSection = () => {
    const [expandedSections, setExpandedSections] = useState({
      category: true,
      tags: true
    });

    const toggleSection = (section: 'category' | 'tags') => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };

    return (
      <div className="space-y-6">
        {/* Search */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">{t.blog.search}</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t.blog.searchPlaceholder}
              className="w-full pl-10 pr-3 py-2 border border-green-200 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="border-t pt-4">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full mb-3"
          >
            <h3 className="font-semibold text-gray-900">{t.blog.category}</h3>
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.category ? 'rotate-180' : ''
              }`} />
          </button>

          {expandedSections.category && (
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category
                      ? 'bg-green-100 text-green-800 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tags Filter */}
        <div className="border-t pt-4">
          <button
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between w-full mb-3"
          >
            <h3 className="font-semibold text-gray-900">{t.blog.popularTags}</h3>
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.tags ? 'rotate-180' : ''
              }`} />
          </button>

          {expandedSections.tags && (
            <div className="flex flex-wrap gap-2">
              {popularTags.slice(0, 10).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTag === tag
                      ? 'bg-green-600 text-white font-medium'
                      : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        {(selectedCategory !== "All" || selectedTag || searchQuery) && (
          <button
            onClick={resetFilters}
            className="w-full py-2 px-4 border border-green-200 text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4 mr-2" />
            {t.blog.clearAll}
          </button>
        )}
      </div>
    );
  };

  // Grid View Item Component
  const GridViewItem = ({ post }: { post: BlogPost }) => (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group relative cursor-pointer"
      onClick={() => handlePostClick(post)}
    >
      <div className="bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={post.image || getRandomAgricultureImage()}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <span className={`px-3 py-1 bg-gradient-to-r ${post.color} text-white text-xs font-bold rounded-full`}>
              {post.category}
            </span>
            {post.trending && (
              <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {t.blog.trending}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSave(post.id);
              }}
              className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
            >
              <Bookmark className={`w-4 h-4 ${savedPosts.includes(post.id) ? "fill-amber-400 text-amber-400" : "text-gray-600"}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors mb-2 line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sm text-gray-500 mb-3 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTag(tag);
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(post.id);
                }}
                className="flex items-center gap-1 hover:text-green-600"
              >
                <Heart className={`w-4 h-4 ${likedPosts.includes(post.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>{post.likes}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );

  // List View Item Component
  const ListViewItem = ({ post }: { post: BlogPost }) => (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 hover:border-green-300 p-4 md:p-6 cursor-pointer"
      onClick={() => handlePostClick(post)}
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="md:w-1/4">
          <div className="relative aspect-video md:aspect-square rounded-lg overflow-hidden">
            <img
              src={post.image || getRandomAgricultureImage()}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 bg-gradient-to-r ${post.color} text-white text-xs font-bold rounded`}>
                {post.category}
              </span>
            </div>
          </div>
        </div>
        <div className="md:w-3/4 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">{post.title}</h3>
              <div className="flex gap-2">
                {post.trending && (
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {t.blog.trending}
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-1" />
                {post.author}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {post.date}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
            <div className="w-full sm:w-auto flex items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {post.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTag(tag);
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-full sm:w-auto flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(post.id);
                }}
                className="flex items-center gap-1 hover:text-green-600"
              >
                <Heart className={`w-4 h-4 ${likedPosts.includes(post.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>{post.likes}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(post.id);
                }}
                className="flex items-center gap-1 hover:text-amber-500"
              >
                <Bookmark className={`w-4 h-4 ${savedPosts.includes(post.id) ? "fill-amber-400 text-amber-400" : ""}`} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );

  const PostModal = () => {
    if (!selectedPost) return null;

    return (
      <AnimatePresence>
        {showPostModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPostModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-200">
                  <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        onClick={() => setShowPostModal(false)}
                        className="flex items-center gap-2"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Articles
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyLink}
                          className="flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          {copied ? "Copied!" : "Share"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSave(selectedPost.id)}
                          className="flex items-center gap-2"
                        >
                          <Bookmark className={`w-4 h-4 ${savedPosts.includes(selectedPost.id) ? "fill-amber-400 text-amber-400" : ""}`} />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8">
                  <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="mb-12">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                      >
                        <div className={`inline-block px-4 py-2 bg-gradient-to-r ${selectedPost.color} text-white rounded-full text-sm font-bold mb-4`}>
                          {selectedPost.category}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                          {selectedPost.title}
                        </h1>
                        <p className="text-xl text-gray-600 italic mb-8">
                          {selectedPost.subheading}
                        </p>
                      </motion.div>

                      {/* Author and Metadata */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-wrap items-center gap-6 mb-8"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500/30">
                            <img
                              src={selectedPost.authorImage}
                              alt={selectedPost.author}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{selectedPost.author}</div>
                            <div className="text-sm text-gray-600">{selectedPost.authorRole}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>{selectedPost.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span>{selectedPost.readTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            <span>{selectedPost.views?.toLocaleString()} views</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Featured Image */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative aspect-video rounded-2xl overflow-hidden mb-8"
                      >
                        <img
                          src={selectedPost.image || getRandomAgricultureImage()}
                          alt={selectedPost.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="text-sm font-medium">BioFact Agricultural Solutions</div>
                        </div>
                      </motion.div>

                      {/* Content */}
                      <article className="prose prose-lg max-w-none">
                        <ReactMarkdown>
                          {selectedPost.content || ''}
                        </ReactMarkdown>
                      </article>

                      {/* Tags and Actions */}
                      <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-wrap gap-2">
                            {selectedPost.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm font-medium hover:bg-green-100 transition-colors cursor-pointer"
                                onClick={() => setSelectedTag(tag)}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleLike(selectedPost.id)}
                              className="flex items-center gap-2"
                            >
                              <Heart className={`w-4 h-4 ${likedPosts.includes(selectedPost.id) ? "fill-rose-500 text-rose-500" : ""}`} />
                              Like ({selectedPost.likes})
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">{t.blog.loading}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-900 to-green-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t.blog.title}</h1>
          <p className="text-green-100">
            {t.blog.subtitle}
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
                    <FilterIcon className="w-5 h-5" />
                    {t.blog.filters}
                  </h2>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {filteredPosts.length} {t.blog.articles}
                  </span>
                </div>
                <FilterSection />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            {/* Results Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">
                    {t.blog.showing} {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} {t.blog.of} {filteredPosts.length} {t.blog.articles}
                  </p>
                  <h2 className="text-xl font-semibold text-gray-900">{t.blog.latestInsights}</h2>
                </div>

                <div className="grid grid-cols-[auto,1fr,auto] items-center gap-2">
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="h-10 px-3 border border-green-200 text-green-700 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors inline-flex items-center justify-center whitespace-nowrap"
                  >
                    <Sliders className="w-4 h-4 mr-1.5" />
                    {t.blog.showFilters}
                  </button>

                  {/* Sort By */}
                  <div className="relative w-full">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-10 appearance-none bg-white border border-green-200 rounded-lg px-3 pr-9 text-sm text-gray-700 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 w-full"
                    >
                      <option value="trending">{t.blog.trending}</option>
                      <option value="popular">Most Popular</option>
                      <option value="latest">{t.blog.latest}</option>
                    </select>
                    <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center border border-green-200 rounded-lg overflow-hidden h-10">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`w-10 h-10 text-center ${viewMode === "grid" ? "bg-green-50 text-green-700" : "text-gray-500"
                        }`}
                    >
                      <Grid className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`w-10 h-10 text-center ${viewMode === "list" ? "bg-green-50 text-green-700" : "text-gray-500"
                        }`}
                    >
                      <List className="w-5 h-5 inline" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Article */}
            {blogPosts.filter(post => post.featured).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl overflow-hidden border border-green-200">
                  <div className="md:flex">
                    <div className="md:w-2/5 relative">
                      <img
                        src={blogPosts.filter(post => post.featured)[0]?.image}
                        alt={blogPosts.filter(post => post.featured)[0]?.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="md:w-3/5 p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {blogPosts.filter(post => post.featured)[0]?.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {blogPosts.filter(post => post.featured)[0]?.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {blogPosts.filter(post => post.featured)[0]?.readTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {blogPosts.filter(post => post.featured)[0]?.author}
                          </div>
                        </div>
                        <Button
                          onClick={() => handlePostClick(blogPosts.filter(post => post.featured)[0]!)}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          Read Article
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Articles Grid/List */}
            <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col"} gap-6 mb-8`}>
              {currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  viewMode === "grid" ? (
                    <GridViewItem key={post.id} post={post} />
                  ) : (
                    <ListViewItem key={post.id} post={post} />
                  )
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">{t.blog.noArticles}</p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 border border-green-200 text-green-700 rounded-lg font-medium hover:bg-green-50"
                  >
                    {t.blog.clearFilters}
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-4 py-2 border border-green-200 text-green-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50"
                >
                  <ChevronLeft className="w-4 h-4 inline mr-1" />
                  {t.blog.previous}
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg ${currentPage === pageNum
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "border border-green-200 text-green-700 hover:bg-green-50"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-4 py-2 border border-green-200 text-green-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50"
                >
                  {t.blog.next}
                  <ChevronRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setShowMobileFilters(false)}
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
                  <h2 className="text-lg font-semibold">{t.blog.filters}</h2>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <FilterSection />
                <button
                  className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                  onClick={() => setShowMobileFilters(false)}
                >
                  {t.blog.applyFilters}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Post Modal */}
      <PostModal />
    </Layout>
  );
};

export default Blog;