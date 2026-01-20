import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Calendar, ArrowRight, Clock, User, Tag, BookOpen, TrendingUp, Search, Filter, Heart, Share2, Eye, MessageCircle, ChevronRight, Bookmark, Star, ChevronLeft, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

// Article content you provided
const articleContent = `# The Art of Fermentation: Naturally Preserving Nutrients in Organic Vegetables and Fruits 

*Explore how the traditional process of fermentation helps preserve nutrients in organic fruits and vegetables for better health benefits.*

---

## Introduction

Fermentation, an ancient method of food preservation, has been practiced for thousands of years across different cultures worldwide. This natural process not only extends the shelf life of fruits and vegetables but also enhances their nutritional value, flavor, and digestibility. In recent decades, fermentation has gained renewed interest, particularly among health-conscious consumers seeking natural and organic food options to improve their well-being.

Organic fruits and vegetables, grown without synthetic pesticides or fertilizers, provide a nutrient-rich foundation for fermentation. The union of organic produce and fermentation exemplifies a powerful synergy—preserving and amplifying the nutrients while delivering probiotic benefits critical for gut health. This blog explores the art and science behind fermenting organic fruits and vegetables, delving into how this simple yet transformative process safeguards essential nutrients and promotes a healthier lifestyle.

---

## Understanding Fermentation and Its Role in Organic Foods

### What is Fermentation?

Fermentation is a metabolic process involving microorganisms such as bacteria, yeasts, and molds that convert sugars and carbohydrates into acids, gases, or alcohol. In the context of fruits and vegetables, lactic acid bacteria (LAB) are primarily responsible for fermenting sugars into lactic acid, which acts as a natural preservative by creating an acidic environment hostile to spoilage-causing microbes.

This process is anaerobic, meaning it occurs without oxygen, and results in the tangy, sour taste characteristic of fermented foods like sauerkraut, kimchi, and pickles. By lowering the pH, fermentation also prevents decay and inhibits harmful bacteria growth, allowing for long-term storage without refrigeration.

### Why Choose Organic Ingredients for Fermentation?

Organic farming emphasizes natural soil management, biodiversity, and avoidance of synthetic chemicals, leading to higher antioxidant levels and nutrient density in the produce. Fermenting organic vegetables and fruits ensures minimal pesticide residues, which could otherwise inhibit beneficial microorganisms or pose health risks.

Organic produce tends to have better flavor profiles and stronger structural integrity, both crucial qualities for successful fermentation. The absence of chemical preservatives or wax coatings common in conventional produce allows fermentation microbes to thrive, resulting in more effective nutrient preservation and probiotic production.

### The Nutritional Impact of Fermentation on Organic Produce

Fermentation does not just preserve nutrients; it often enhances them. For example, the vitamin C content in fermented cabbage can remain stable or even increase due to microbial synthesis. Additionally, fermentation breaks down complex compounds and antinutrients such as phytic acid, improving mineral bioavailability.

Moreover, a broad spectrum of B vitamins, including folate and vitamin B12 (rare in plant foods), can be synthesized by fermenting bacteria. The process also generates beneficial enzymes and organic acids that support digestion and overall gut health. Studies have shown that fermented vegetables often contain up to tenfold higher probiotic levels compared to their fresh counterparts, contributing to immune support and metabolic balance.

---

## The Fermentation Process: Techniques and Best Practices

### Selecting and Preparing Organic Fruits and Vegetables

Choose fresh, crisp, and unblemished organic produce to maximize fermentation success. Popular choices include cabbage, cucumbers, carrots, beets, apples, and berries. Wash thoroughly with cold water to remove dirt and unwanted microbes but avoid peeling when unnecessary, as the skin contains nutrients and native bacteria essential for fermentation.

Cut produce uniformly – shredding cabbage for sauerkraut or slicing cucumbers for pickles – to facilitate even fermentation. Incorporate organic sea salt or Himalayan pink salt at appropriate concentrations (typically 2-3% by weight) to inhibit unwanted bacteria while promoting lactic acid bacteria growth.

### Types of Fermentation Techniques for Organic Produce

1. **Lacto-fermentation:** This is the most common method for vegetables. Submerging produce in a saltwater brine encourages growth of lactic acid bacteria. This method produces classic fermented foods like kimchi and sauerkraut.

2. **Alcoholic Fermentation:** Typically applied to fruits, yeasts convert sugars to alcohol and carbon dioxide. Examples include fermenting grapes into wine or apples into cider. Organic fruits produce high-quality fermentation with richer flavors.

3. **Wild Fermentation vs. Starter Cultures:** Wild fermentation relies on naturally occurring microbes present on produce and in the environment, making it more variable but traditional. Starter cultures, which are commercially available probiotics, provide more consistent results and can be used for specific nutrient profiles.

### Monitoring Fermentation for Optimal Nutrient Preservation

Temperature control is crucial; most vegetable fermentations thrive between 65-72°F (18-22°C). Higher temperatures speed up fermentation but may risk off-flavors, while lower temperatures slow fermentation and might allow spoilage. Keep fermenting jars in a cool, dark space away from sunlight.

Taste and smell test periodically; a pleasantly sour, tangy aroma signals healthy fermentation. Avoid ferments with mold growth, putrid odors, or pink discoloration, which indicate contamination. Properly fermented organic produce can be stored in refrigeration after completion to maintain quality for months.

---

## Nutritional Benefits of Fermented Organic Vegetables and Fruits

### Enhanced Vitamin and Mineral Content

Fermentation often increases vitamin availability, notably vitamins C, K2, and certain B vitamins. For instance, research shows that sauerkraut can retain over 88% of its vitamin C content after fermentation—much higher than cooked or canned counterparts.

Lactic acid bacteria also synthesize vitamin K2, vital for cardiovascular and bone health, which is absent in most fresh fruits and vegetables. Minerals such as calcium, magnesium, and iron become more bioavailable as fermentation reduces phytates and other compounds that bind these elements. This means your body can better absorb and utilize these nutrients from fermented organic foods.

### Probiotic Properties and Gut Health

The live microorganisms in fermented foods act as probiotics, colonizing the gut with beneficial bacteria that aid digestion, strengthen the immune system, and modulate inflammation. According to a 2020 meta-analysis published in *Nutrients,* regular consumption of fermented vegetables correlates with reduced risks of gastrointestinal disorders, improved bowel regularity, and better nutrient absorption.

Organic fermentations typically harbor a broader diversity of beneficial bacteria, as no pesticides or antibiotics interfere with microbial ecosystems. This makes fermented organic veggies a potent source of natural probiotics compared to commercially processed probiotic supplements.

### Improved Digestibility and Reduction of Antinutrients

Many raw fruits and vegetables contain complex fibers and antinutritional factors such as oxalates, tannins, and lectins, which can impair digestion and nutrient uptake. Fermentation breaks down these compounds into simpler, more digestible molecules.

For example, fermenting beans or bitter greens reduces lectin content and softens fibers, making them gentler on the gut and easing nutritional assimilation. This attribute is especially beneficial for people with sensitive digestion or irritable bowel syndromes.

---

## Popular Fermented Organic Fruits and Vegetables Around the World

### Sauerkraut: Europe's Probiotic Powerhouse

Sauerkraut, fermented cabbage native to German and Eastern European cuisine, is a quintessential example of lacto-fermentation. Made simply from organic cabbage and salt, its high vitamin C content historically prevented scurvy among sailors. Modern research recognizes sauerkraut as an excellent source of probiotics, antioxidants, and anti-inflammatory compounds. Its tangy flavor pairs well with hearty meals and can be eaten raw or cooked.

### Kimchi: Korea's Spicy, Nutrient-Dense Staple

Kimchi combines organic napa cabbage, radishes, garlic, ginger, and chili peppers fermented together to create a complex, spicy, and umami-rich dish. It contains high levels of vitamins A, B, and C, along with abundant probiotics such as *Lactobacillus kimchii.* Studies published in the *Journal of Medicinal Food* highlight kimchi's cholesterol-lowering effects and immune system support, making it not only a flavorful condiment but also a functional food for maintaining health.

### Pickles and Fermented Fruits: Diverse Choices for Nutrient Preservation

Fermented cucumbers, carrots, beets, and even fruits like apples and berries offer diverse textures and flavors. Organic fermented pickles maintain crunchy textures without artificial preservatives, and beet kvass (fermented beet juice) serves as a detoxifying tonic rich in antioxidants and electrolytes.

These simple preparations demonstrate that fermentation can be adapted globally to local organic produce, providing both nutritional benefits and culinary variety.

---

## Getting Started with Home Fermentation: Tips for Beginners

### Essential Equipment and Hygiene Practices

Basic fermentation requires minimal equipment: glass jars (mason jars), fermentation weights or clean small plates to keep produce submerged, and breathable covers like cloth or special lids. Use organic, non-iodized salt to preserve flavor and microbial balance.

Cleanliness is paramount. Wash hands, utensils, and jars thoroughly to avoid contamination. Sterilize jars with boiling water if reusing to reduce unwanted microbes, but avoid antibacterial soaps that can kill beneficial bacteria.

### Step-by-Step Guide to Basic Vegetable Fermentation

1. Chop organic vegetables uniformly.
2. Massage the vegetables with salt to release natural juices or add brine.
3. Pack tightly into the jar, pressing down to remove air pockets.
4. Weigh the vegetables down to keep them submerged under the brine.
5. Cover loosely to allow gases to escape without allowing air in.
6. Store at room temperature and ferment for 5-14 days depending on taste preferences.
7. Refrigerate once desired flavor is reached to slow fermentation.

### Troubleshooting Common Issues

- **Mold on surface:** Usually harmless if white and fluffy; skim off carefully. Avoid black, blue, or red mold.
- **Off smells:** Rotten or ammonia odors indicate spoilage—discard and start over.
- **Lack of bubbles or sourness:** Fermentation may be too cold or slow; increase temperature or add starter culture.
- **Softening or sliminess:** Overfermentation can cause breakdown; shorten fermentation time next batch.

---

## Conclusion: Embracing the Art of Fermentation for Optimal Health

Fermentation embodies a time-honored natural method of preserving and enhancing the nutritious qualities of organic fruits and vegetables. Integrating fermentation into daily life provides a beneficial way to consume more probiotics, improve nutrient absorption, and enjoy diverse flavors while supporting sustainable food systems.

The probiotic richness, increased vitamins, and improved digestibility of fermented organic produce demonstrate why this ancient art has stood the test of time. Whether you purchase fermentations from trusted artisan producers or experiment with home fermentation, embracing this process offers profound benefits for gut health, immunity, and overall well-being.

### Key Takeaways:

- Fermentation preserves and often enhances nutrient content in organic fruits and vegetables.
- Organic produce supports healthier fermentation due to higher nutrient density and lack of chemicals.
- Consuming fermented organic foods promotes probiotic intake, improving digestion and immune function.
- Home fermentation is an accessible, sustainable practice for nutrient-rich food preservation.
- Global fermented foods like sauerkraut and kimchi are delicious and nutrient-packed examples worth trying.

By rediscovering fermentation, we honor tradition while nurturing our health with the best that organic foods can offer—naturally, safely, and deliciously.

Explore how the traditional process of fermentation helps preserve nutrients in organic fruits and vegetables for better health benefits.`;

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch blog posts from Supabase
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('addlifeblogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to match frontend structure
      const transformedPosts = data?.map((post: any) => ({
        id: post.id,
        title: post.title,
        excerpt: post.subheading || "No excerpt available",
        content: post.content || articleContent, // Use actual content or fallback
        date: new Date(post.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        readTime: calculateReadTime(post.content || articleContent),
        author: "AddLife Team",
        authorRole: "Organic Living Expert",
        authorImage: "https://images.unsplash.com/photo-1494790108755-2616b786d4d9?w=100&h=100&fit=crop",
        category: post.topic || "Uncategorized",
        tags: post.tags || ["Fermentation", "Organic", "Nutrition", "Health", "Food Preservation"],
        image: post.image_url || "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=500&fit=crop",
        featured: Math.random() > 0.8,
        views: Math.floor(Math.random() * 5000),
        likes: Math.floor(Math.random() * 500),
        comments: Math.floor(Math.random() * 100),
        trending: Math.random() > 0.5,
        color: getRandomColor(),
        subheading: post.subheading,
        primary_intent: post.primary_intent,
        topic: post.topic,
        country: post.country,
        service: post.service,
        created_at: post.created_at
      })) || [];

      setBlogPosts(transformedPosts);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateReadTime = (content: string | null) => {
    const contentToUse = content || articleContent;
    const words = contentToUse.split(' ').length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const getRandomColor = () => {
    const colors = [
      "from-[#CD98ED] to-purple-500",
      "from-[#CD98ED]/80 to-purple-400",
      "from-[#CD98ED]/90 to-purple-400",
      "from-[#CD98ED]/70 to-purple-400",
      "from-[#CD98ED]/60 to-purple-400"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const categories = ["All", "Fermentation", "Organic Nutrition", "Food Preservation", "Gut Health", "Sustainable Living"];
  const popularTags = ["Fermentation", "Organic", "Nutrition", "Probiotics", "Health", "Food", "Preservation", "Gut Health", "Wellness", "Cooking", "Vegetables", "Fruits"];

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Custom components for markdown rendering
  const MarkdownComponents = {
    h1: ({node, ...props}: any) => (
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 pt-8" 
        {...props} 
      />
    ),
    h2: ({node, ...props}: any) => (
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4 pt-6 border-t border-gray-200" 
        {...props} 
      />
    ),
    h3: ({node, ...props}: any) => (
      <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mt-6 mb-3" {...props} />
    ),
    p: ({node, ...props}: any) => (
      <p className="text-gray-700 text-lg leading-relaxed mb-4" {...props} />
    ),
    ul: ({node, ...props}: any) => (
      <ul className="list-disc pl-6 mb-4 text-gray-700" {...props} />
    ),
    ol: ({node, ...props}: any) => (
      <ol className="list-decimal pl-6 mb-4 text-gray-700" {...props} />
    ),
    li: ({node, ...props}: any) => (
      <li className="mb-2 text-lg" {...props} />
    ),
    em: ({node, ...props}: any) => (
      <em className="italic text-gray-600" {...props} />
    ),
    strong: ({node, ...props}: any) => (
      <strong className="font-bold text-gray-900" {...props} />
    ),
    blockquote: ({node, ...props}: any) => (
      <blockquote className="border-l-4 border-[#CD98ED] pl-4 italic text-gray-600 my-4 text-lg" {...props} />
    ),
    hr: ({node, ...props}: any) => (
      <hr className="my-8 border-gray-300" {...props} />
    ),
    code: ({node, inline, className, children, ...props}: any) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="my-6 rounded-xl overflow-hidden">
          <div className="bg-gray-900 text-gray-300 px-4 py-2 text-sm font-mono flex justify-between items-center">
            <span>{match[1]}</span>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-6 px-2 hover:bg-gray-800"
              onClick={() => {
                navigator.clipboard.writeText(String(children));
              }}
            >
              Copy
            </Button>
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            className="!m-0 !rounded-none"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-[#CD98ED]/10 text-[#CD98ED] px-2 py-1 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
  };

  const PostModal = () => {
    if (!selectedPost) return null;

    const tableOfContents = [
      { id: 'introduction', title: 'Introduction' },
      { id: 'understanding', title: 'Understanding Fermentation' },
      { id: 'process', title: 'Fermentation Process' },
      { id: 'benefits', title: 'Nutritional Benefits' },
      { id: 'popular', title: 'Popular Fermented Foods' },
      { id: 'getting-started', title: 'Getting Started' },
      { id: 'conclusion', title: 'Conclusion' },
    ];

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
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#CD98ED]/30">
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
                          src={selectedPost.image || "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&h=600&fit=crop"}
                          alt={selectedPost.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </motion.div>

                      {/* Table of Contents */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-[#CD98ED]/5 to-purple-50 rounded-2xl p-6 mb-8"
                      >
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-[#CD98ED]" />
                          Table of Contents
                        </h3>
                        <div className="space-y-2">
                          {tableOfContents.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => scrollToSection(item.id)}
                              className="flex items-center gap-3 text-gray-700 hover:text-[#CD98ED] transition-colors w-full text-left"
                            >
                              <ChevronRight className="w-4 h-4" />
                              <span>{item.title}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    {/* Article Content */}
                    <article className="prose prose-lg max-w-none">
                      <ReactMarkdown components={MarkdownComponents}>
                        {selectedPost.content || articleContent}
                      </ReactMarkdown>
                    </article>

                    {/* Tags and Actions */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-12 pt-8 border-t border-gray-200"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                          {selectedPost.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="px-4 py-2 bg-[#CD98ED]/10 text-[#CD98ED] border border-[#CD98ED]/30 rounded-full text-sm font-medium"
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
                            Like
                          </Button>
                          <Button className="bg-gradient-to-r from-[#CD98ED] to-purple-500 hover:from-[#CD98ED]/90 hover:to-purple-600">
                            Share Article
                          </Button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Related Articles */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-12"
                    >
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {blogPosts.slice(0, 2).map((post) => (
                          <motion.article
                            key={post.id}
                            whileHover={{ y: -4 }}
                            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handlePostClick(post)}
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                                <img
                                  src={post.image}
                                  alt={post.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">
                                  {post.title}
                                </h4>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {post.excerpt}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-500">{post.readTime}</span>
                                </div>
                              </div>
                            </div>
                          </motion.article>
                        ))}
                      </div>
                    </motion.div>
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
            <div className="w-16 h-16 border-4 border-[#CD98ED] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              ✕
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Blog</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={fetchBlogPosts}
              className="bg-gradient-to-r from-[#CD98ED] to-purple-500 hover:from-[#CD98ED]/90 hover:to-purple-600"
            >
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#F9DD58] rounded-b-[60px]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight grid justify-center">
                <span className="text-[#3A0F2E]">The Organic</span>
                <span className="text-white">Knowledge Base</span>
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-black text-3xl md:text-4xl font-serif italic leading-tight mb-8"
              >
                "Sharing knowledge about organic living and sustainable practices for a healthier planet"
              </motion.p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#CD98ED]" />
                <Input
                  type="search"
                  placeholder="Search articles, topics, or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg rounded-full border-2 border-[#CD98ED]/30 bg-white/10 backdrop-blur-sm text-white placeholder-[#CD98ED]/50 focus:border-[#CD98ED] focus:ring-2 focus:ring-[#CD98ED]/30"
                />
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#CD98ED] to-purple-500 hover:from-[#CD98ED]/90 hover:to-purple-600 rounded-full"
                  size="sm"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                className="group relative cursor-pointer"
                onClick={() => handlePostClick(post)}
              >
                <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg group-hover:shadow-xl transition-all duration-300 h-full">
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
                    <span className={`absolute top-4 left-4 bg-gradient-to-r ${post.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.readTime}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Post Modal */}
      <PostModal />
    </Layout>
  );
};

export default Blog;