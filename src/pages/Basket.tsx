import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Check, Leaf, Package, Truck, Calendar, Users, Apple, Carrot, Heart, ChevronRight, Star } from "lucide-react";
import { useState } from "react";

const BasketPage = () => {
  const [selectedOption, setSelectedOption] = useState<'vegetables-fruits' | 'fruits-only'>('vegetables-fruits');
  const [householdSize, setHouseholdSize] = useState({ adults: 2, children: 0 });
  const [dietType, setDietType] = useState('omnivore');
  const [mealsPerWeek, setMealsPerWeek] = useState(10);
  const [selectedBasketSize, setSelectedBasketSize] = useState('mezzo');
  const [selectedFrequency, setSelectedFrequency] = useState('every-2-weeks');
  const [deliveryDay, setDeliveryDay] = useState('Thursday');
  const [firstDeliveryDate, setFirstDeliveryDate] = useState('2026-01-15');
  const [fruitsPerDay, setFruitsPerDay] = useState(3);

  const basketSizes = [
    { id: 'essentiel', name: 'Essentiel', weight: '7-8 kg', price: 70, weeklyPrice: 35, description: 'For 1-2 people', recommended: false },
    { id: 'mezzo', name: 'Mezzo', weight: '9-10 kg', price: 85, weeklyPrice: 42.50, description: 'For 3-4 people', recommended: true },
    { id: 'grande', name: 'Grande', weight: '12-13 kg', price: 99, weeklyPrice: 49.50, description: 'For 5-8 people', recommended: false },
  ];

  const fruitBaskets = [
    { id: 'petite', name: 'Petite', weight: '7-8 kg', price: 60, description: 'Perfect for 1-2 people', icon: '🍎' },
    { id: 'medium', name: 'Medium', weight: '10-11 kg', price: 80, description: 'Ideal for 3-4 people', icon: '🍊' },
    { id: 'large', name: 'Large', weight: '14-15 kg', price: 100, description: 'Great for 5+ people', icon: '🍉' },
  ];

  const frequencies = [
    { id: 'every-week', name: 'Every week', weeklyPrice: 85, description: 'That\'s a basket of CHF 85.– delivered every week' },
    { id: 'every-2-weeks', name: 'Every 2 weeks', weeklyPrice: 42.50, description: 'That\'s a basket of CHF 85.– delivered every 2 weeks' },
    { id: 'every-month', name: 'Every month', weeklyPrice: 21.25, description: 'That\'s a basket of CHF 85.– delivered monthly' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle basket submission
    console.log({
      selectedOption,
      householdSize,
      dietType,
      mealsPerWeek,
      selectedBasketSize,
      selectedFrequency,
      deliveryDay,
      firstDeliveryDate,
      fruitsPerDay
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#F9DD58] rounded-b-[60px]">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-black text-3xl md:text-4xl font-serif italic leading-tight mb-8">
                {selectedOption === 'vegetables-fruits' ? 
                  'Basket of Vegetables and Fruits' : 
                  'Box of Fruits'
                }
              </h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-black text-3xl md:text-4xl font-serif italic leading-tight mb-8"
              >
                {selectedOption === 'vegetables-fruits' ? 
                  'Fresh organic vegetables and fruits delivered to your doorstep' :
                  'Organic fruit baskets delivered to your home.'
                }
              </motion.p>
            </motion.div>

            {/* Option Selector */}
            
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit}>
            <div className="max-w-6xl mx-auto">
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex p-1 bg-blue-800/30 backdrop-blur-sm rounded-2xl mb-12"
            >
              <button
                onClick={() => setSelectedOption('vegetables-fruits')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedOption === 'vegetables-fruits'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                    : 'text-blue-200 hover:text-white hover:bg-blue-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Carrot className="w-5 h-5" />
                  Vegetables & Fruits
                </div>
              </button>
              <button
                onClick={() => setSelectedOption('fruits-only')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedOption === 'fruits-only'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                    : 'text-blue-200 hover:text-white hover:bg-blue-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Apple className="w-5 h-5" />
                  Fruits Only
                </div>
              </button>
            </motion.div>
              {/* Step 1: Configuration */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    What's the right basket for me?
                  </h2>
                </div>
                <p className="text-gray-600 mb-8">
                  Configure to suit your needs
                </p>

                {/* Configuration Form */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Household Size */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <Users className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Household size</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className="text-gray-700 mb-4 block">Number of adults</Label>
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-12 h-12 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={() => setHouseholdSize(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                          >
                            -
                          </Button>
                          <div className="text-3xl font-bold text-gray-900">{householdSize.adults}</div>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-12 h-12 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={() => setHouseholdSize(prev => ({ ...prev, adults: prev.adults + 1 }))}
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-700 mb-4 block">Number of children</Label>
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-12 h-12 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={() => setHouseholdSize(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                          >
                            -
                          </Button>
                          <div className="text-3xl font-bold text-gray-900">{householdSize.children}</div>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-12 h-12 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={() => setHouseholdSize(prev => ({ ...prev, children: prev.children + 1 }))}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Eating Habits */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <Leaf className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">Eating habits</h3>
                    </div>

                    {selectedOption === 'vegetables-fruits' ? (
                      <div className="space-y-6">
                        <div>
                          <Label className="text-gray-700 mb-4 block">Type of diet</Label>
                          <RadioGroup
                            value={dietType}
                            onValueChange={setDietType}
                            className="grid grid-cols-3 gap-3"
                          >
                            <div>
                              <RadioGroupItem value="vegan" id="vegan" className="peer sr-only" />
                              <Label
                                htmlFor="vegan"
                                className="flex flex-col items-center justify-between rounded-lg border-2 border-gray-300 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 cursor-pointer"
                              >
                                <span className="font-medium text-gray-900">Vegan</span>
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem value="vegetarian" id="vegetarian" className="peer sr-only" />
                              <Label
                                htmlFor="vegetarian"
                                className="flex flex-col items-center justify-between rounded-lg border-2 border-gray-300 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 cursor-pointer"
                              >
                                <span className="font-medium text-gray-900">Vegetarian</span>
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem value="omnivore" id="omnivore" className="peer sr-only" />
                              <Label
                                htmlFor="omnivore"
                                className="flex flex-col items-center justify-between rounded-lg border-2 border-gray-300 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 cursor-pointer"
                              >
                                <span className="font-medium text-gray-900">Omnivore</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div>
                          <Label className="text-gray-700 mb-4 block">
                            Frequency of meals per week at home (lunch, dinner)
                          </Label>
                          <div className="space-y-4">
                            <Slider
                              value={[mealsPerWeek]}
                              onValueChange={([value]) => setMealsPerWeek(value)}
                              max={14}
                              step={2}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>2</span>
                              <span>4</span>
                              <span>6</span>
                              <span>8</span>
                              <span>10</span>
                              <span>12</span>
                              <span>14</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Label className="text-gray-700 mb-4 block">Fruits per day (per person)</Label>
                        <div className="grid grid-cols-4 gap-3">
                          {[2, 3, 4, 5].map((amount) => (
                            <button
                              key={amount}
                              type="button"
                              onClick={() => setFruitsPerDay(amount)}
                              className={`flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all ${
                                fruitsPerDay === amount
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                              }`}
                            >
                              <span className="text-2xl font-bold text-gray-900">{amount}</span>
                              <span className="text-sm text-gray-600">/ day</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Basket Selection */}
                <div className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedOption === 'vegetables-fruits' ? 'A. Choose basket size' : 'Choose my basket'}
                      </h3>
                      <p className="text-gray-600">
                        {selectedOption === 'vegetables-fruits' ? 'Our recommendation based on your preferences' : 'Select the perfect fruit basket size'}
                      </p>
                    </div>
                    {selectedOption === 'vegetables-fruits' && (
                      <div className="flex items-center gap-2 text-blue-700">
                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                        <span className="font-medium">Recommended</span>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {(selectedOption === 'vegetables-fruits' ? basketSizes : fruitBaskets).map((basket) => (
                      <motion.div
                        key={basket.id}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedBasketSize(basket.id)}
                        className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
                          selectedBasketSize === basket.id
                            ? 'border-blue-500 bg-white shadow-lg'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        {basket.recommended && selectedOption === 'vegetables-fruits' && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full">
                            Our recommendation
                          </div>
                        )}

                        {selectedOption === 'fruits-only' && (
                          <div className="text-3xl mb-4">{basket.icon}</div>
                        )}

                        <div className="mb-4">
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{basket.name}</h4>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                              CHF {selectedOption === 'vegetables-fruits' ? basket.price : basket.price}.–
                            </span>
                            {selectedOption === 'vegetables-fruits' && (
                              <span className="text-gray-600">/ {basket.weight}</span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Leaf className="w-4 h-4 text-blue-500" />
                            <span>100% organic {selectedOption === 'vegetables-fruits' ? 'fruits & vegetables' : 'fruits'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Truck className="w-4 h-4 text-blue-500" />
                            <span>Free delivery included</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Package className="w-4 h-4 text-blue-500" />
                            <span>{basket.description}</span>
                          </div>
                        </div>

                        {selectedOption === 'vegetables-fruits' && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="text-center">
                              <div className="text-sm text-gray-600 mb-1">Budget:</div>
                              <div className="text-lg font-bold text-gray-900">
                                CHF {basket.weeklyPrice}/week
                              </div>
                              <div className="text-sm text-gray-600">
                                That's a basket of CHF {basket.price}.– delivered every 2 weeks
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-6">
                          <Button
                            type="button"
                            variant={selectedBasketSize === basket.id ? 'default' : 'outline'}
                            className="w-full"
                            onClick={() => setSelectedBasketSize(basket.id)}
                          >
                            {selectedBasketSize === basket.id ? 'Selected' : 'Select'}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Frequency Selection (Vegetables & Fruits only) */}
                {selectedOption === 'vegetables-fruits' && (
                  <div className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">B. Choose basket sending frequency</h3>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      {frequencies.map((frequency) => (
                        <motion.div
                          key={frequency.id}
                          whileHover={{ y: -5 }}
                          onClick={() => setSelectedFrequency(frequency.id)}
                          className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
                            selectedFrequency === frequency.id
                              ? 'border-blue-500 bg-white shadow-lg'
                              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                          }`}
                        >
                          <h4 className="text-lg font-bold text-gray-900 mb-4">{frequency.name}</h4>
                          
                          <div className="text-center mb-4">
                            <div className="text-2xl font-bold text-gray-900">
                              CHF {frequency.weeklyPrice}/week
                            </div>
                            <div className="text-sm text-gray-600">
                              {frequency.description}
                            </div>
                          </div>

                          <Button
                            type="button"
                            variant={selectedFrequency === frequency.id ? 'default' : 'outline'}
                            className="w-full"
                            onClick={() => setSelectedFrequency(frequency.id)}
                          >
                            {selectedFrequency === frequency.id ? 'Selected' : 'Select'}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              
              
            </div>
          </form>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Baskets</h2>
            <p className="text-gray-600">Experience the difference with our organic produce</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🌱',
                title: 'Farm Fresh',
                description: 'Direct from local organic farms within 200km'
              },
              {
                icon: '♻️',
                title: 'Zero Waste',
                description: 'Rescuing imperfect produce to reduce food waste'
              },
              {
                icon: '🚚',
                title: 'Free Delivery',
                description: 'Carbon-neutral delivery to your doorstep'
              },
              {
                icon: '📱',
                title: 'Flexible',
                description: 'Pause, skip, or cancel anytime'
              },
              {
                icon: '🍽️',
                title: 'Recipe Guide',
                description: 'Weekly recipes to make the most of your basket'
              },
              {
                icon: '❤️',
                title: 'Community',
                description: 'Supporting local farmers and sustainable agriculture'
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BasketPage;