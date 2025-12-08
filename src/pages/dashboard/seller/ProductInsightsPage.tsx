import { Navigation } from "@/components/navigation/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/seller/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/seller/select";
import { Button } from "@/components/ui/seller/button";
import { Download, TrendingUp, Package, IndianRupee, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

const ProductInsightsPage = () => {
  const priceTrendData = [
    { month: "Jan", retail: 120, bulk: 95 },
    { month: "Feb", retail: 125, bulk: 98 },
    { month: "Mar", retail: 130, bulk: 100 },
    { month: "Apr", retail: 135, bulk: 104 },
    { month: "May", retail: 138, bulk: 106 },
    { month: "Jun", retail: 140, bulk: 108 },
  ];

  const categoryShareData = [
    { name: "Grains", value: 45, color: "#2E7D32" },
    { name: "Flours", value: 30, color: "#DFA44A" },
    { name: "Ready-to-cook", value: 15, color: "#1F4B6B" },
    { name: "Snacks", value: 10, color: "#8C7B67" },
  ];

  const stockHealthData = [
    { label: "Healthy", value: 70, color: "#4CAF50" },
    { label: "Low", value: 20, color: "#FFC107" },
    { label: "Out of stock", value: 10, color: "#F44336" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F1E5]">
      <Navigation />

      <main className="container px-4 py-10 md:px-6 lg:px-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1F2D3D]">Product Insights</h1>
              <p className="text-[#7A6A58]">Understand how your listed products perform in the marketplace.</p>
            </div>
            <div className="flex gap-3">
              <Select defaultValue="6m">
                <SelectTrigger className="w-[120px] rounded-full bg-white border-[#E6DFD4]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Last Month</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="rounded-full border-[#E6DFD4] bg-white text-[#2E7D32]"
              >
                <Download className="mr-2 h-4 w-4" /> Export Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Avg. Selling Price", value: "₹128 / kg", change: "+6%", icon: IndianRupee, color: "text-green-600" },
              { label: "Active Products", value: "18", change: "+2", icon: Package, color: "text-blue-600" },
              { label: "Repeat Buyers", value: "42%", change: "+4%", icon: TrendingUp, color: "text-purple-600" },
              { label: "GMV from Products", value: "₹3.2L", change: "+15%", icon: BarChart3, color: "text-orange-600" },
            ].map((stat, idx) => (
              <Card key={idx} className="border-[#E6DFD4] shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    <span
                      className={`text-xs font-semibold ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                    >
                      {stat.change} vs last period
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#1F2D3D]">{stat.value}</h3>
                  <p className="text-sm text-[#7A6A58]">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-[#E6DFD4] shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle>Price trends by channel</CardTitle>
                <CardDescription>Average listed and realized price for your products.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD4" vertical={false} />
                    <XAxis dataKey="month" stroke="#7A6A58" tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#7A6A58"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#FFF8EC", borderColor: "#E6DFD4", borderRadius: "12px" }}
                      itemStyle={{ color: "#1F2D3D" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="retail"
                      name="Retail packs"
                      stroke="#2E7D32"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#2E7D32" }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bulk"
                      name="Bulk packs"
                      stroke="#DFA44A"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#DFA44A" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-[#E6DFD4] shadow-sm">
              <CardHeader>
                <CardTitle>Sales by category</CardTitle>
                <CardDescription>Share of GMV by product category.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryShareData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD4" vertical={false} />
                    <XAxis dataKey="name" stroke="#7A6A58" tickLine={false} axisLine={false} />
                    <YAxis stroke="#7A6A58" tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: "#FFF8EC" }} contentStyle={{ borderRadius: "12px" }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {categoryShareData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-[#E6DFD4] shadow-sm">
              <CardHeader>
                <CardTitle>Stock health</CardTitle>
                <CardDescription>How much of your catalog is well-stocked vs low.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockHealthData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stockHealthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px" }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductInsightsPage;
