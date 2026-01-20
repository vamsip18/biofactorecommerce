import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Gift as GiftIcon, Heart, Package, Sparkles, CreditCard, Check, ChevronRight, Calendar, Truck, Star, MessageCircle, QrCode, Download, Share2, Mail, User, Building, MapPin, Home } from "lucide-react";
import { Link } from "react-router-dom";
import giftBasket from "@/assets/gift-basket.png";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const basketOptions = [
  {
    id: "essentiel",
    title: "Essentiel",
    weight: "7-8 kg",
    price: 70,
    description: "For 1-2 people",
    features: ["Perfect for couples", "Weekly variety", "3-4 days of meals"],
    popular: false,
    color: "from-blue-400 to-cyan-500",
    image: "panier-legumes-fruits-bio-livraison-suisse-romande"
  },
  {
    id: "mezzo",
    title: "Mezzo",
    weight: "9-10 kg",
    price: 85,
    description: "For 3-4 people",
    features: ["Ideal for families", "8-10 varieties", "Recipe suggestions included"],
    popular: true,
    color: "from-cyan-500 to-blue-600",
    image: "panier-legumes-fruits-bio-mezzo-livraison-suisse-romande-uglyfruits"
  },
  {
    id: "grande",
    title: "Grande",
    weight: "12-13 kg",
    price: 99,
    description: "For 5-8 people",
    features: ["Large households", "12+ varieties", "Meal planning guide"],
    popular: false,
    color: "from-sky-400 to-blue-500",
    image: "panier-legumes-fruits-bio-grande-livraison-suisse-romande-uglyfruits"
  },
];

const testimonials = [
  {
    name: "Sarah Müller",
    role: "Gift Recipient",
    content: "The most thoughtful gift I've ever received! Fresh, delicious, and such a healthy treat every week.",
    rating: 5,
  },
  {
    name: "Thomas Weber",
    role: "Corporate Gifting",
    content: "We gifted our entire team Add Life baskets. It was a huge hit and aligned perfectly with our wellness values.",
    rating: 5,
  },
  {
    name: "Elena Rossi",
    role: "Repeat Gifter",
    content: "I've gifted Add Life to family and friends for three years now. It's my go-to for meaningful presents.",
    rating: 5,
  },
];

const Gift = () => {
  const [selectedGiftType, setSelectedGiftType] = useState<'basket' | 'custom'>('basket');
  const [selectedBasket, setSelectedBasket] = useState('mezzo');
  const [customAmount, setCustomAmount] = useState(70);
  const [giftMessage, setGiftMessage] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  
  // Billing information
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showGiftCard, setShowGiftCard] = useState(false);

  const selectedOption = basketOptions.find(opt => opt.id === selectedBasket);
  const giftAmount = selectedGiftType === 'basket' ? selectedOption?.price || 85 : customAmount;

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Process payment and show gift card
      setShowGiftCard(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const formatCurrency = (amount: number) => {
    return `CHF ${amount.toFixed(2)}`;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#F9DD58] rounded-b-[60px]">
        {/* Removed animated background elements */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight">
  <span className="text-black">For Fresh Food </span>
  <span className="text-white">Lovers</span>
</h1>

<motion.p
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="text-xl text-black"
>
  Give a gift card of any value to try our organic vegetable and fruit baskets 
  that rescue imperfect produce.
</motion.p>


            </motion.div>

                
                  <img
                    src={giftBasket}
                    alt="Beautiful organic gift basket"
                    className="w-full h-auto rounded-3xl "
                  />
                  

                
              
            
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-8">
              {[1, 2, 3].map((step) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: step * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    ${currentStep >= step 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }
                  `}>
                    {step}
                  </div>
                  <span className={`
                    text-sm font-medium hidden sm:block
                    ${currentStep >= step ? 'text-gray-900' : 'text-gray-600'}
                  `}>
                    {step === 1 && 'Choose Gift'}
                    {step === 2 && 'Personalize'}
                    {step === 3 && 'Billing & Payment'}
                  </span>
                  {step < 3 && (
                    <ChevronRight className="w-5 h-5 text-blue-300 hidden sm:block" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                  {/* Step 1: Choose Gift Type */}
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Choose the Amount
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                      {/* Basket Options */}
                      <div className="space-y-4">
                        <Label className="text-lg font-semibold text-gray-900">
                          Select a Basket Size
                        </Label>
                        <RadioGroup
                          value={selectedGiftType}
                          onValueChange={(value) => setSelectedGiftType(value as 'basket' | 'custom')}
                          className="space-y-4"
                        >
                          <div
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                              selectedGiftType === 'basket'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => setSelectedGiftType('basket')}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="basket" id="basket" />
                              <Label htmlFor="basket" className="text-lg font-semibold text-gray-900 cursor-pointer">
                                Predefined Basket
                              </Label>
                            </div>
                          </div>
                          
                          <div
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                              selectedGiftType === 'custom'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                            onClick={() => setSelectedGiftType('custom')}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="custom" id="custom" />
                              <Label htmlFor="custom" className="text-lg font-semibold text-gray-900 cursor-pointer">
                                Custom Amount
                              </Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Gift Amount Display */}
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-2">Gift Value</div>
                          <div className="text-4xl font-bold text-gray-900 mb-1">
                            {formatCurrency(giftAmount)}
                          </div>
                          <div className="text-gray-600 text-sm">
                            Minimum: CHF 70.–
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Basket Options Grid */}
                    {selectedGiftType === 'basket' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid md:grid-cols-3 gap-6"
                      >
                        {basketOptions.map((basket) => (
                          <motion.div
                            key={basket.id}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedBasket(basket.id)}
                            className={`cursor-pointer rounded-2xl p-6 border-2 transition-all ${
                              selectedBasket === basket.id
                                ? 'border-blue-500 shadow-xl scale-105'
                                : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                            }`}
                          >
                            {basket.popular && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full">
                                Most Popular
                              </div>
                            )}
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {basket.title}
                            </h3>
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                              CHF {basket.price}.–
                            </div>
                            <div className="text-gray-600 text-sm mb-4">
                              {basket.weight} • {basket.description}
                            </div>
                            
                            <div className="space-y-2 mb-6">
                              {basket.features.map((feature) => (
                                <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                                  <Check className="w-4 h-4 text-blue-500" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                            
                            <div className="text-center">
                              <div className={`px-4 py-2 rounded-lg font-medium ${
                                selectedBasket === basket.id
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {selectedBasket === basket.id ? 'Selected' : 'Select'}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {/* Custom Amount Input */}
                    {selectedGiftType === 'custom' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto"
                      >
                        <div className="text-center mb-6">
                          <div className="text-lg font-semibold text-gray-900 mb-2">
                            Freely choose the gift voucher amount
                          </div>
                          <div className="text-gray-600 text-sm">
                            Minimum: 70 CHF
                          </div>
                        </div>
                        
                        <div className="relative">
                          <div className="text-5xl font-bold text-gray-900 text-center mb-4">
                            {customAmount}
                          </div>
                          <div className="text-center text-gray-600 mb-6">CHF</div>
                          
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                              onClick={() => setCustomAmount(Math.max(70, customAmount - 10))}
                            >
                              -10
                            </Button>
                            <Input
                              type="number"
                              min="70"
                              step="10"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(Math.max(70, parseInt(e.target.value) || 70))}
                              className="text-center text-xl font-bold border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                              onClick={() => setCustomAmount(customAmount + 10)}
                            >
                              +10
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            {[70, 100, 150].map((amount) => (
                              <Button
                                key={amount}
                                type="button"
                                variant="outline"
                                className={`border-gray-300 ${
                                  customAmount === amount 
                                    ? 'bg-blue-100 text-blue-900 border-blue-500' 
                                    : 'text-gray-700 hover:bg-blue-50'
                                }`}
                                onClick={() => setCustomAmount(amount)}
                              >
                                CHF {amount}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-end">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      onClick={handleNextStep}
                    >
                      Continue to Personalize
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                  {/* Step 2: Personalize */}
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Personalize Your Gift
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Gift Message (Optional)
                          </Label>
                          <Textarea
                            placeholder="Write a heartfelt message for your recipient..."
                            value={giftMessage}
                            onChange={(e) => setGiftMessage(e.target.value)}
                            className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Recipient's Email
                          </Label>
                          <Input
                            type="email"
                            placeholder="email@example.com"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                          <p className="text-gray-600 text-sm mt-1">
                            The gift voucher will be sent to this email
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Delivery Date (Optional)
                          </Label>
                          <Input
                            type="date"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <p className="text-gray-600 text-sm mt-1">
                            Schedule when the gift voucher should be delivered
                          </p>
                        </div>

                        {/* Gift Preview */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                              <GiftIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">Gift Voucher Preview</h4>
                              <p className="text-gray-600 text-sm">
                                {selectedGiftType === 'basket' ? selectedOption?.title : 'Custom Amount'}
                              </p>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                              {formatCurrency(giftAmount)}
                            </div>
                            <div className="text-gray-600 text-sm">
                              Valid for 12 months
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={handlePrevStep}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      onClick={handleNextStep}
                    >
                      Continue to Billing
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                  {/* Step 3: Billing */}
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Billing Address
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Your Email
                          </Label>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                              First Name
                            </Label>
                            <Input
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                              Last Name
                            </Label>
                            <Input
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Company Name (optional)
                          </Label>
                          <Input
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Street and Number
                          </Label>
                          <Input
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                              Postal Code
                            </Label>
                            <Input
                              value={postalCode}
                              onChange={(e) => setPostalCode(e.target.value)}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                              City
                            </Label>
                            <Input
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="terms"
                          checked={acceptTerms}
                          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                          className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <Label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                          I accept the terms and conditions
                        </Label>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Gift Voucher</span>
                          <span className="font-bold text-gray-900">{formatCurrency(giftAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Processing Fee</span>
                          <span className="font-bold text-gray-900">CHF 0.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Delivery</span>
                          <span className="font-bold text-gray-900">FREE</span>
                        </div>
                        <div className="pt-3 border-t border-blue-200">
                          <div className="flex justify-between">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-gray-900">{formatCurrency(giftAmount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={handlePrevStep}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      onClick={handleNextStep}
                      disabled={!acceptTerms}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Confirm and Pay
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            
          </div>
        </div>
      </section>

      {/* Gift Card Success Modal */}
      <AnimatePresence>
        {showGiftCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowGiftCard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-b from-white to-blue-50 rounded-3xl max-w-lg w-full p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-8">
                <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-4">
                  <GiftIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Gift Card Created!
                </h3>
                <p className="text-gray-600">
                  Your gift voucher has been sent to {recipientEmail || 'the recipient'}
                </p>
              </div>

              {/* Gift Card Design */}
              <div className="bg-gradient-to-br from-blue-600 to-cyan-700 rounded-2xl p-8 text-white mb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-sm opacity-80">Gift Voucher</div>
                    <div className="text-2xl font-bold">BIO-GIFT-2024-{Math.random().toString(36).substr(2, 8).toUpperCase()}</div>
                  </div>
                  <QrCode className="w-16 h-16 bg-white p-2 rounded-lg" />
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold mb-2">{formatCurrency(giftAmount)}</div>
                  <div className="text-blue-200/80">Valid until December 31, 2025</div>
                </div>
                
                {giftMessage && (
                  <div className="border-t border-blue-400/30 pt-4 mt-4">
                    <div className="text-sm opacity-80 mb-2">Personal Message:</div>
                    <div className="italic">"{giftMessage}"</div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  onClick={() => window.print()}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Print Voucher
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Email
                </Button>
              </div>

              <div className="text-center mt-6">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-gray-900"
                  onClick={() => setShowGiftCard(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-blue-500" />
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                Loved by Many
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Gift Stories
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              See what people are saying about gifting the organic experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-gray-700 italic text-lg mb-6">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
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

export default Gift;