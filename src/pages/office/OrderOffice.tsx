import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Building2,
  Users,
  Calendar,
  Package,
  CheckCircle,
  CreditCard,
  Shield,
  Truck,
  Clock,
  Leaf,
  CreditCard as CardIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 299,
    employees: "1-10",
    delivery: "Weekly",
    features: ["Basic fruit selection", "Email support", "Standard delivery"]
  },
  {
    id: "business",
    name: "Business",
    price: 599,
    employees: "11-50",
    delivery: "Twice weekly",
    features: ["Premium selection", "Priority support", "Customizable options"]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    employees: "50+",
    delivery: "Daily",
    features: ["Full customization", "Dedicated manager", "24/7 support"]
  }
];

const deliveryDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["8:00-10:00 AM", "10:00-12:00 PM", "1:00-3:00 PM", "3:00-5:00 PM"];

export const OrderOffice = () => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string>("business");
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    employeeCount: "",
    deliveryDay: "",
    deliveryTime: "",
    specialInstructions: "",
    billingAddress: "",
    paymentMethod: "credit"
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Order Submitted!",
      description: "Your office plan has been confirmed. We'll contact you within 24 hours.",
    });
    setTimeout(() => {
      navigate("/office/success");
    }, 2000);
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-emerald-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/office" className="inline-flex items-center text-emerald-700 hover:text-emerald-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Office Plans
          </Link>
          <h1 className="text-4xl font-bold text-emerald-900">Setup Your Office Delivery</h1>
          <p className="text-emerald-700">Complete in 3 simple steps</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {["Plan Selection", "Company Info", "Payment"].map((label, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step > index + 1 ? 'bg-emerald-500 text-white' : 
                  step === index + 1 ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-500' : 
                  'bg-emerald-50 text-emerald-500'
                }`}>
                  {step > index + 1 ? <CheckCircle className="w-6 h-6" /> : index + 1}
                </div>
                <span className={`text-sm font-medium ${
                  step >= index + 1 ? 'text-emerald-900' : 'text-emerald-700'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500"
              initial={{ width: "0%" }}
              animate={{ width: `${(step - 1) * 50}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
                  <Package className="w-6 h-6 mr-3 text-emerald-600" />
                  Choose Your Plan
                </h2>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {plans.map((plan) => (
                    <Card 
                      key={plan.id}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedPlan === plan.id 
                          ? 'border-2 border-emerald-500 bg-emerald-50' 
                          : 'border-emerald-200 hover:border-emerald-400'
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-emerald-900">{plan.name}</h3>
                            <p className="text-sm text-emerald-700">Up to {plan.employees} employees</p>
                          </div>
                          {selectedPlan === plan.id && (
                            <CheckCircle className="w-6 h-6 text-emerald-500" />
                          )}
                        </div>
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-emerald-900">
                            {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                          </span>
                          {typeof plan.price === 'number' && (
                            <span className="text-emerald-700">/month</span>
                          )}
                        </div>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm text-emerald-800">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="text-center text-sm text-emerald-700">
                          <Truck className="w-4 h-4 inline mr-1" />
                          {plan.delivery} delivery
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
                  <Building2 className="w-6 h-6 mr-3 text-emerald-600" />
                  Company Information
                </h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-emerald-900">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Your company name"
                        className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="text-emerald-900">Contact Person *</Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                        placeholder="Full name"
                        className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-emerald-900">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="contact@company.com"
                        className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-emerald-900">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-emerald-900">Delivery Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Street address, City, ZIP Code"
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-emerald-900">Number of Employees</Label>
                      <Select
                        value={formData.employeeCount}
                        onValueChange={(value) => handleInputChange('employeeCount', value)}
                      >
                        <SelectTrigger className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500">
                          <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-100">51-100 employees</SelectItem>
                          <SelectItem value="101-250">101-250 employees</SelectItem>
                          <SelectItem value="250+">250+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-emerald-900">Preferred Delivery Day</Label>
                      <Select
                        value={formData.deliveryDay}
                        onValueChange={(value) => handleInputChange('deliveryDay', value)}
                      >
                        <SelectTrigger className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {deliveryDays.map(day => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-emerald-900">Delivery Time Window</Label>
                    <Select
                      value={formData.deliveryTime}
                      onValueChange={(value) => handleInputChange('deliveryTime', value)}
                    >
                      <SelectTrigger className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(slot => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialInstructions" className="text-emerald-900">Special Instructions</Label>
                    <Textarea
                      id="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                      placeholder="Any dietary restrictions, building access instructions, etc."
                      rows={3}
                      className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
                  <CardIcon className="w-6 h-6 mr-3 text-emerald-600" />
                  Payment Details
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-emerald-900">Payment Method</Label>
                    <RadioGroup 
                      value={formData.paymentMethod} 
                      onValueChange={(value) => handleInputChange('paymentMethod', value)}
                    >
                      <div className="flex items-center space-x-2 p-4 border border-emerald-200 rounded-lg hover:bg-emerald-50 cursor-pointer">
                        <RadioGroupItem value="credit" id="credit" className="text-emerald-600" />
                        <Label htmlFor="credit" className="text-emerald-900 cursor-pointer">Credit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border border-emerald-200 rounded-lg hover:bg-emerald-50 cursor-pointer">
                        <RadioGroupItem value="invoice" id="invoice" className="text-emerald-600" />
                        <Label htmlFor="invoice" className="text-emerald-900 cursor-pointer">Invoice (Net 30)</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border border-emerald-200 rounded-lg hover:bg-emerald-50 cursor-pointer">
                        <RadioGroupItem value="bank" id="bank" className="text-emerald-600" />
                        <Label htmlFor="bank" className="text-emerald-900 cursor-pointer">Bank Transfer</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.paymentMethod === 'credit' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className="text-emerald-900">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry" className="text-emerald-900">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc" className="text-emerald-900">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip" className="text-emerald-900">ZIP Code</Label>
                          <Input
                            id="zip"
                            placeholder="12345"
                            className="border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'invoice' && (
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                      <p className="text-emerald-800">
                        You'll receive an invoice via email. Payment terms are Net 30.
                      </p>
                    </div>
                  )}

                  {formData.paymentMethod === 'bank' && (
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                      <p className="text-emerald-800">
                        Bank transfer details will be provided on your invoice.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center text-emerald-800 bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <Shield className="w-5 h-5 mr-2 text-emerald-600" />
                    <span className="text-sm">All payments are secure and encrypted</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400"
              >
                Back
              </Button>
              <Button
                onClick={handleNextStep}
                className="bg-emerald-600 hover:bg-emerald-700 px-8 text-white"
              >
                {step === 3 ? 'Complete Order' : 'Continue'}
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24 border-emerald-200 bg-white">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-emerald-900 mb-6">Order Summary</h3>
                
                {selectedPlanData && (
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-emerald-900">{selectedPlanData.name} Plan</h4>
                        <p className="text-sm text-emerald-700">{selectedPlanData.employees} employees</p>
                      </div>
                      <span className="font-bold text-emerald-900">
                        {typeof selectedPlanData.price === 'number' 
                          ? `$${selectedPlanData.price}/mo` 
                          : 'Custom Pricing'}
                      </span>
                    </div>
                    <ul className="space-y-2 text-sm text-emerald-800 mb-4">
                      {selectedPlanData.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-4 border-t border-emerald-200 pt-6">
                  <div className="flex justify-between text-emerald-800">
                    <span>Subtotal</span>
                    <span>$599.00</span>
                  </div>
                  <div className="flex justify-between text-emerald-800">
                    <span>Delivery</span>
                    <span className="text-emerald-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-emerald-800">
                    <span>Tax</span>
                    <span>$47.92</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-emerald-900 border-t border-emerald-200 pt-4">
                    <span>Total</span>
                    <span>$646.92/mo</span>
                  </div>
                </div>

                <div className="mt-6 text-sm text-emerald-700 space-y-3">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-3 text-emerald-500 flex-shrink-0" />
                    <span>Secure 256-bit encryption</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-3 text-emerald-500 flex-shrink-0" />
                    <span>14-day free trial included</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-3 text-emerald-500 flex-shrink-0" />
                    <span>Cancel anytime</span>
                  </div>
                  <div className="flex items-center">
                    <Leaf className="w-4 h-4 mr-3 text-emerald-500 flex-shrink-0" />
                    <span>100% eco-friendly packaging</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};