import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Leaf, Users, Target, Globe, Award, ChevronRight, Star, Target as MissionIcon, Eye as VisionIcon, Compass, Shield, Recycle, FlaskConical, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Import field application photo for the top section
import fieldApplication from "@/assets/field-application.png";

const values = [
  {
    icon: Shield,
    title: "Scientific Precision",
    description: "Every formulation is backed by rigorous research, third-party testing, and data-driven results.",
    color: "from-emerald-500 to-green-500",
    stat: "50+ Research Papers"
  },
  {
    icon: Recycle,
    title: "Sustainable Impact",
    description: "We develop biofertilizers that improve soil health while reducing chemical dependency.",
    color: "from-teal-500 to-emerald-500",
    stat: "30% Higher Yield"
  },
  {
    icon: Users,
    title: "Farmer Partnership",
    description: "Working directly with farmers to develop solutions that meet real-world agricultural challenges.",
    color: "from-blue-500 to-cyan-500",
    stat: "500+ Farm Partners"
  },
  {
    icon: Leaf,
    title: "Regenerative Focus",
    description: "Creating products that don't just sustain, but actively regenerate soil ecosystems.",
    color: "from-lime-500 to-green-500",
    stat: "Zero Chemical Runoff"
  },
];

const timeline = [
  {
    year: "2015",
    title: "The Research Phase",
    description: "Started with soil microbiome research at leading agricultural universities.",
    icon: "🔬",
    achievements: ["Microbial isolation", "Lab testing", "Initial formulations"]
  },
  {
    year: "2018",
    title: "First Field Trials",
    description: "Conducted large-scale trials with partner farms across Switzerland.",
    icon: "🌾",
    achievements: ["10 farm partners", "Field validation", "GMP certification"]
  },
  {
    year: "2021",
    title: "Commercial Launch",
    description: "Officially launched biofactor products to the agricultural market.",
    icon: "🚀",
    achievements: ["Product line launch", "National distribution", "100+ clients"]
  },
  {
    year: "2024",
    title: "Global Expansion",
    description: "Expanding our technology to address agricultural challenges worldwide.",
    icon: "🌍",
    achievements: ["EU certification", "Research partnerships", "Soil health focus"]
  },
];

// Online placeholder images for leadership team
const teamMembers = [
  {
    name: "Dr. Elena Schmidt",
    role: "Chief Scientist & Founder",
    bio: "PhD in Soil Microbiology from ETH Zurich. 15+ years researching soil ecosystems.",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
    quote: "The solution to healthy crops begins with understanding the soil microbiome."
  },
  {
    name: "Markus Weber",
    role: "Director of Agricultural Operations",
    bio: "Third-generation farmer with expertise in regenerative agriculture practices.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=face",
    quote: "Real agricultural solutions come from the field, not just the laboratory."
  },
  {
    name: "Dr. Chen Li",
    role: "Head of Research & Development",
    bio: "Expert in microbial formulations and sustainable agricultural technology.",
    image: "https://images.unsplash.com/photo-1551836026-d5c2c0b4d5a9?w=400&h=400&fit=crop&crop=face",
    quote: "Nature provides the blueprint, science provides the precision."
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section with Field Application Photo */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900/10 to-white rounded-b-[60px]">
        {/* Background field application image */}
        <div className="absolute inset-0 z-0">
          <img
            src={fieldApplication}
            alt="Biofactor field research application"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/30 via-emerald-900/10 to-white" />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-gray-900">Pioneering</span>
                <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Biofactor Technology
                </span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-700 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto"
              >
                "We combine cutting-edge soil science with sustainable agriculture to create 
                biofactor solutions that enhance soil vitality, improve crop resilience, 
                and support regenerative farming practices."
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                  asChild
                >
                  <Link to="/technology" className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4" />
                    Our Technology
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
                
              </motion.div>
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
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 h-full border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Icon & Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl text-white">
                      <MissionIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider">
                        Our Mission
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900 mt-1">
                        Revolutionizing Soil Health
                      </h2>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      To develop scientifically-validated biofactor solutions that enhance 
                      soil microbiology, improve crop nutrition, and enable sustainable 
                      agricultural practices for farmers worldwide.
                    </p>

                    <div className="bg-white/70 p-5 rounded-xl border border-emerald-100">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Compass className="w-4 h-4 text-emerald-600" />
                        Scientific Objectives
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        {[
                          "Develop microbial formulations that enhance soil biodiversity",
                          "Create nutrient delivery systems with optimal bioavailability",
                          "Establish protocols for soil health monitoring and improvement",
                          "Partner with research institutions for continuous innovation",
                          "Provide farmers with data-driven agricultural solutions"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
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
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 h-full border border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Icon & Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl text-white">
                      <VisionIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-teal-700 font-semibold text-sm uppercase tracking-wider">
                        Our Vision
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900 mt-1">
                        The Future of Agriculture
                      </h2>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      To create a world where agriculture works in harmony with nature, 
                      where soil health is prioritized, and where sustainable practices 
                      ensure food security for future generations.
                    </p>

                    <div className="bg-white/70 p-5 rounded-xl border border-teal-100">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4 text-teal-600" />
                        2030 Goals
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        {[
                          "Help restore 1 million hectares of degraded soil worldwide",
                          "Develop carbon-negative agricultural systems",
                          "Establish global soil health monitoring network",
                          "Train 10,000 farmers in regenerative practices",
                          "Achieve 100% sustainable packaging and operations"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
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
              <div className="inline-block bg-gradient-to-r from-emerald-100 to-teal-100 px-8 py-6 rounded-2xl border border-emerald-200 max-w-2xl mx-auto">
                <p className="text-emerald-700 font-medium text-lg">
                  "Science guides our research. Nature inspires our solutions. 
                  Farmers validate our impact."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider">
                Our Core Values
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Principles That
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Guide Our Work
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              The foundational beliefs that shape our research, products, and partnerships
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
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-200 hover:border-emerald-200 h-full transition-all duration-300">
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
      <section className="py-16 bg-gradient-to-b from-white to-teal-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-teal-600" />
              <span className="text-teal-700 font-semibold text-sm uppercase tracking-wider">
                Our Leadership Team
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Scientific Minds,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
                Agricultural Experience
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Experts in soil science, microbiology, and sustainable agriculture
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-gray-200 hover:border-teal-200 h-full transition-all duration-300">
                  {/* Image */}
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                      <div className="text-teal-600 font-medium mb-2">{member.role}</div>
                      <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
                    </div>

                    {/* Quote */}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-start gap-2">
                        <div className="text-lg text-teal-500">"</div>
                        <p className="text-gray-700 italic text-sm">{member.quote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scientific Background Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 mb-6">
              <Microscope className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-700">Scientific Excellence</span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Backed by Research & Innovation
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
              {[
                {
                  title: "University Partnerships",
                  description: "Collaborating with leading agricultural research institutions",
                  icon: "🏛️"
                },
                {
                  title: "Field Validation",
                  description: "Extensive testing across diverse soil types and climates",
                  icon: "🌍"
                },
                {
                  title: "Continuous Innovation",
                  description: "Ongoing R&D to advance sustainable agriculture",
                  icon: "🚀"
                }
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-teal-100 shadow-sm">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;