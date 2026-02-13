import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  Calendar, 
  Users, 
  TrendingUp,
  Settings,
  Bell,
  CreditCard,
  FileText,
  HelpCircle,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const deliveries = [
  { date: "Today", items: ["Apples", "Bananas", "Oranges"], status: "delivered" },
  { date: "Wednesday", items: ["Berries", "Grapes", "Kiwi"], status: "scheduled" },
  { date: "Friday", items: ["Melon", "Pineapple", "Mango"], status: "scheduled" },
];

const teamPreferences = [
  { fruit: "Bananas", preference: 95 },
  { fruit: "Berries", preference: 88 },
  { fruit: "Apples", preference: 82 },
  { fruit: "Oranges", preference: 75 },
  { fruit: "Grapes", preference: 68 },
];

export const OfficeDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Office Dashboard</h1>
              <p className="text-green-100">TechCorp Inc. • 45 employees</p>
            </div>
            <Badge className="bg-white text-emerald-600">
              <Package className="w-4 h-4 mr-2" />
              Business Plan
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Next Delivery</p>
                  <p className="text-2xl font-bold text-green-900">Wed, 10 AM</p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Employees</p>
                  <p className="text-2xl font-bold text-green-900">45</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Monthly Cost</p>
                  <p className="text-2xl font-bold text-green-900">$599</p>
                </div>
                <CreditCard className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Satisfaction</p>
                  <p className="text-2xl font-bold text-green-900">94%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-green-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="deliveries" className="data-[state=active]:bg-white">
              <Package className="w-4 h-4 mr-2" />
              Deliveries
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-white">
              <Settings className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-white">
              <FileText className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-900">Recent Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deliveries.map((delivery, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-green-900">{delivery.date}</p>
                          <p className="text-sm text-green-600">{delivery.items.join(", ")}</p>
                        </div>
                        <Badge className={
                          delivery.status === 'delivered' 
                            ? 'bg-green-500' 
                            : 'bg-blue-500'
                        }>
                          {delivery.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-900">Team Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {teamPreferences.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-green-900">{item.fruit}</span>
                          <span className="text-sm text-green-600">{item.preference}%</span>
                        </div>
                        <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${item.preference}%` }}
                            transition={{ delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Deliveries Tab */}
          <TabsContent value="deliveries">
            <Card className="border-green-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">Delivery Schedule</h3>
                {/* Delivery schedule content */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-green-900 mb-6">Quick Actions</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="border-green-200 text-green-900 hover:bg-green-50 h-auto py-4">
              <Calendar className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Reschedule</div>
                <div className="text-sm text-green-600">Change delivery time</div>
              </div>
            </Button>
            <Button variant="outline" className="border-green-200 text-green-900 hover:bg-green-50 h-auto py-4">
              <Settings className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Preferences</div>
                <div className="text-sm text-green-600">Update fruit selection</div>
              </div>
            </Button>
            <Button variant="outline" className="border-green-200 text-green-900 hover:bg-green-50 h-auto py-4">
              <Bell className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Notifications</div>
                <div className="text-sm text-green-600">Manage alerts</div>
              </div>
            </Button>
            <Button variant="outline" className="border-green-200 text-green-900 hover:bg-green-50 h-auto py-4">
              <HelpCircle className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Support</div>
                <div className="text-sm text-green-600">Get help</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};