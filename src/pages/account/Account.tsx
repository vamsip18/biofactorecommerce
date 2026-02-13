import { motion } from "framer-motion";
import { AccountLayout } from "./AccountLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, Calendar, MapPin, Phone, User, Edit2, Save, X } from "lucide-react";
import { useState } from "react";

const Account = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    birthDate: "1990-05-15",
    deliveryDay: "Thursday",
    phone: "+41 32 123 45 67",
    street: "Chemin des Cevins 4",
    postalCode: "2096",
    city: "Cressier",
    company: "ADD LIFE SA"
  });

  const handleSave = () => {
    // Save data to backend
    console.log("Saving user data:", userData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AccountLayout title="My Profile">
      <div className="space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h3 className="text-2xl font-bold text-green-900">Personal Information</h3>
            <p className="text-green-700/70">Manage your account details and preferences</p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </motion.div>

        {/* Account Information */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Login Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-green-900">Login Information</h4>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-green-700 mb-2 block">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    <Input
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      className="pl-10 border-green-300 bg-white"
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-green-700 mb-2 block">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    <Input
                      type="password"
                      value="••••••••"
                      className="pl-10 border-green-300 bg-white"
                      readOnly
                    />
                  </div>
                  {isEditing && (
                    <Button
                      variant="link"
                      className="text-green-600 hover:text-green-800 p-0 h-auto mt-2"
                    >
                      Change Password
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-green-900">Personal Information</h4>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-green-700 mb-2 block">First Name</Label>
                    <Input
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleChange}
                      className="border-green-300"
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <Label className="text-green-700 mb-2 block">Last Name</Label>
                    <Input
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleChange}
                      className="border-green-300"
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-green-700 mb-2 block">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    <Input
                      name="birthDate"
                      type="date"
                      value={userData.birthDate}
                      onChange={handleChange}
                      className="pl-10 border-green-300"
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-green-700 mb-2 block">Preferred Delivery Day</Label>
                  <Select
                    value={userData.deliveryDay}
                    onValueChange={(value) => setUserData(prev => ({ ...prev, deliveryDay: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="border-green-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Billing & Contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Billing Address */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-green-900">Billing Address</h4>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-green-700 mb-2 block">Company Name</Label>
                  <Input
                    name="company"
                    value={userData.company}
                    onChange={handleChange}
                    className="border-green-300"
                    readOnly={!isEditing}
                  />
                </div>

                <div>
                  <Label className="text-green-700 mb-2 block">Street and Number</Label>
                  <Input
                    name="street"
                    value={userData.street}
                    onChange={handleChange}
                    className="border-green-300"
                    readOnly={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-green-700 mb-2 block">Postal Code</Label>
                    <Input
                      name="postalCode"
                      value={userData.postalCode}
                      onChange={handleChange}
                      className="border-green-300"
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <Label className="text-green-700 mb-2 block">City</Label>
                    <Input
                      name="city"
                      value={userData.city}
                      onChange={handleChange}
                      className="border-green-300"
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-green-900">Contact Information</h4>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-green-700 mb-2 block">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    <Input
                      name="phone"
                      value={userData.phone}
                      onChange={handleChange}
                      className="pl-10 border-green-300"
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-green-700 mb-2 block">How did you hear about us?</Label>
                  <Select disabled={!isEditing}>
                    <SelectTrigger className="border-green-300">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="friend">Friend/Family</SelectItem>
                      <SelectItem value="search">Search Engine</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
              <h4 className="font-bold mb-4">Account Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-100/80">Member Since</span>
                  <span className="font-bold">March 2023</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-100/80">Subscription</span>
                  <span className="font-bold">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-100/80">Next Delivery</span>
                  <span className="font-bold">Thursday, Jan 15</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h4 className="text-lg font-bold text-green-900 mb-4">Recent Activity</h4>
          <div className="bg-gradient-to-b from-white to-green-50 rounded-2xl border border-green-200/50 p-6">
            <div className="space-y-4">
              {[
                { date: "Today", action: "Updated delivery preferences", icon: "📅" },
                { date: "Yesterday", action: "Order #2345 delivered", icon: "📦" },
                { date: "Jan 10", action: "Added new payment method", icon: "💳" },
                { date: "Jan 8", action: "Updated billing address", icon: "🏠" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-green-50/50">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-green-900">{activity.action}</p>
                    <p className="text-sm text-green-700/70">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AccountLayout>
  );
};

export default Account;