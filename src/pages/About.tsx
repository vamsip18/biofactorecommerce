import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Leaf, Heart, Users, Truck, Target, Globe, Award, Clock, TrendingUp, ChevronRight, Star, Target as MissionIcon, Eye as VisionIcon, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Leaf,
    title: "100% Organic",
    description: "Every product is certified organic. No pesticides, no chemicals — just nature's best.",
    color: "from-[#CD98ED] to-purple-500",
    stat: "500+ Products"
  },
  {
    icon: Heart,
    title: "Fighting Food Waste",
    description: "We save produce that would otherwise go to waste, giving it the appreciation it deserves.",
    color: "from-[#CD98ED]/80 to-purple-400",
    stat: "30% Less Waste"
  },
  {
    icon: Users,
    title: "Supporting Local Farmers",
    description: "Fair prices for farmers, fresh produce for you. We build lasting partnerships.",
    color: "from-[#CD98ED]/80 to-purple-400",
    stat: "120+ Farmers"
  },
  {
    icon: Truck,
    title: "Carbon Neutral Delivery",
    description: "Straight to your door, on your schedule. Our delivery fleet is 100% carbon neutral.",
    color: "from-[#CD98ED]/70 to-purple-400",
    stat: "Zero Emissions"
  },
];

const timeline = [
  {
    year: "2018",
    title: "The Beginning",
    description: "Started with a simple idea: save ugly produce and deliver organic food to doorsteps.",
    icon: "🌱",
    achievements: ["First 50 customers", "5 local farm partners", "Zurich pilot"]
  },
  {
    year: "2020",
    title: "Growing Strong",
    description: "Expanded to 5 Swiss cities and partnered with over 50 local organic farmers.",
    icon: "📈",
    achievements: ["5 cities covered", "50+ farm partners", "1,000+ customers"]
  },
  {
    year: "2023",
    title: "Nationwide Impact",
    description: "Now delivering across all of Switzerland, serving over 7,900 happy customers.",
    icon: "🏔️",
    achievements: ["National coverage", "100+ employees", "Food waste award"]
  },
  {
    year: "2025",
    title: "The Future Vision",
    description: "Continuing to innovate sustainable food delivery while reducing waste at every step.",
    icon: "🚀",
    achievements: ["European expansion", "AI optimization", "Carbon negative goal"]
  },
];

const teamMembers = [
  {
    name: "Dr. Maria Schmidt",
    role: "Founder & CEO",
    bio: "Former agricultural scientist turned entrepreneur",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    quote: "Every vegetable has a story worth telling."
  },
  {
    name: "Hans Müller",
    role: "Head of Farming",
    bio: "Third-generation organic farmer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    quote: "The soil speaks to those who listen."
  },
  {
    name: "Elena Rossi",
    role: "Sustainability Director",
    bio: "Environmental policy expert",
    image: "https://images.unsplash.com/photo-1551836026-d5c2c0b4d5a9?w=400&h=400&fit=crop",
    quote: "Sustainability isn't a trend, it's a responsibility."
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#F9DD58] rounded-b-[60px]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                <span className="text-[#3A0F2E]">Food that nourishes</span>
                <span className="block text-white">life itself</span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-black text-3xl md:text-4xl font-serif italic leading-tight mb-8"
              >
                "We blend the wisdom of nature with modern biological science — cultivating 
                food in biologically alive soils, built not on chemicals, but on life itself."
              </motion.p>

              
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Mission Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-gradient-to-br from-[#CD98ED]/5 to-purple-50 rounded-3xl p-8 h-full border border-[#CD98ED]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Icon & Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-[#CD98ED] to-purple-500 rounded-xl text-white">
                      <MissionIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">
                        Our Mission
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900 mt-1">
                        What Drives Us Forward
                      </h2>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      To revolutionize the food system by connecting conscious consumers with local, 
                      organic farmers through a sustainable, waste-free delivery network that nourishes 
                      both people and the planet.
                    </p>

                    <div className="bg-white/50 p-5 rounded-xl border border-[#CD98ED]/10">
                      <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Compass className="w-4 h-4 text-[#CD98ED]" />
                        Our Core Objectives
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        {[
                          "Eliminate food waste by saving 'imperfect' produce",
                          "Create fair economic opportunities for local farmers",
                          "Make organic food accessible to every household",
                          "Build a carbon-neutral supply chain from farm to table",
                          "Educate communities about sustainable agriculture"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#CD98ED] mt-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4">
                      
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Vision Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-purple-50 to-[#CD98ED]/5 rounded-3xl p-8 h-full border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Icon & Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-[#CD98ED] rounded-xl text-white">
                      <VisionIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">
                        Our Vision
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900 mt-1">
                        The Future We're Building
                      </h2>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      To create a world where sustainable agriculture is the norm, every community 
                      has access to nutrient-rich food, and our food systems regenerate rather than 
                      deplete the Earth's resources.
                    </p>

                    <div className="bg-white/50 p-5 rounded-xl border border-purple-200">
                      <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-purple-600" />
                        Long-term Aspirations
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        {[
                          "Establish regenerative farming practices across Europe by 2030",
                          "Reduce food waste in Switzerland by 50% within 5 years",
                          "Create a closed-loop packaging system with zero waste",
                          "Develop educational programs for sustainable living",
                          "Pioneer carbon-negative food delivery models"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Connecting Statement */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-12 text-center"
            >
              <div className="inline-block bg-gradient-to-r from-[#CD98ED]/20 to-purple-500/20 px-6 py-4 rounded-2xl border border-[#CD98ED]/30">
                <p className="text-purple-600 font-semibold text-sm uppercase tracking-wider">
                  "Our mission fuels today's actions. Our vision guides tomorrow's possibilities."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-[#CD98ED]" />
              <span className="text-[#CD98ED] font-semibold text-sm uppercase tracking-wider">
                Our Values
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What We
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#CD98ED] to-purple-500">
                Stand For
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Four pillars that guide everything we do, from farm to table
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300 h-full transition-all duration-300">
                  {/* Icon */}
                  <motion.div 
                    className={`inline-flex p-3 rounded-xl mb-4 bg-gradient-to-br ${value.color} text-white`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <value.icon className="w-6 h-6" />
                  </motion.div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {value.description}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="font-bold text-gray-900">{value.stat}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gradient-to-b from-white to-purple-50/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-[#CD98ED]" />
              <span className="text-[#CD98ED] font-semibold text-sm uppercase tracking-wider">
                Our Team
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet the People
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#CD98ED] to-purple-500">
                Behind the Produce
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Passionate individuals committed to sustainable agriculture and community wellbeing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300 h-full transition-all duration-300">
                  {/* Image */}
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                      <div className="text-[#CD98ED] font-medium mb-2">{member.role}</div>
                      <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
                    </div>

                    {/* Quote */}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-start gap-2">
                        <div className="text-lg text-[#CD98ED]">"</div>
                        <p className="text-gray-700 italic text-sm">{member.quote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
    </Layout>
  );
};

export default About;