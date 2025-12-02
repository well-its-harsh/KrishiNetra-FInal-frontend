import { Navigation } from "@/components/navigation/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/seller/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/seller/select";
import { Button } from "@/components/ui/seller/button";
import { Download, TrendingUp, Users, IndianRupee, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

const AuctionInsightsPage = () => {
    // Dummy Data
    const priceTrendData = [
        { month: 'Jan', millet: 2400, ragi: 2100, jowar: 1800 },
        { month: 'Feb', millet: 2500, ragi: 2150, jowar: 1850 },
        { month: 'Mar', millet: 2450, ragi: 2200, jowar: 1900 },
        { month: 'Apr', millet: 2600, ragi: 2250, jowar: 1950 },
        { month: 'May', millet: 2700, ragi: 2300, jowar: 2000 },
        { month: 'Jun', millet: 2800, ragi: 2400, jowar: 2100 },
    ];

    const stateDemandData = [
        { state: 'Karnataka', demand: 4500 },
        { state: 'Maharashtra', demand: 3800 },
        { state: 'Tamil Nadu', demand: 3200 },
        { state: 'Andhra', demand: 2900 },
        { state: 'Odisha', demand: 2100 },
    ];

    const supplyDemandData = [
        { name: 'Demand', value: 65, color: '#2E7D32' },
        { name: 'Supply', value: 35, color: '#DFA44A' },
    ];

    return (
        <div className="min-h-screen bg-[#F7F1E5]">
            <Navigation />

            <main className="container px-4 py-10 md:px-6 lg:px-10">
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#1F2D3D]">Auction Insights</h1>
                            <p className="text-[#7A6A58]">Real-time market intelligence to optimize your sales.</p>
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
                            <Button variant="outline" className="rounded-full border-[#E6DFD4] bg-white text-[#2E7D32]">
                                <Download className="mr-2 h-4 w-4" /> Export Report
                            </Button>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Avg. Settlement Price", value: "₹2,650/qtl", change: "+12%", icon: IndianRupee, color: "text-green-600" },
                            { label: "Total Bidders", value: "342", change: "+5%", icon: Users, color: "text-blue-600" },
                            { label: "Bid-to-Win Ratio", value: "1:8", change: "-2%", icon: TrendingUp, color: "text-purple-600" },
                            { label: "Market Volume", value: "125 Tons", change: "+18%", icon: BarChart3, color: "text-orange-600" },
                        ].map((stat, idx) => (
                            <Card key={idx} className="border-[#E6DFD4] shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                        <span className={`text-xs font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                            {stat.change} vs last month
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1F2D3D]">{stat.value}</h3>
                                    <p className="text-sm text-[#7A6A58]">{stat.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Price Trend */}
                        <Card className="border-[#E6DFD4] shadow-sm lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Price Trends by Variety</CardTitle>
                                <CardDescription>Average auction closing prices over the last 6 months.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={priceTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD4" vertical={false} />
                                        <XAxis dataKey="month" stroke="#7A6A58" tickLine={false} axisLine={false} />
                                        <YAxis stroke="#7A6A58" tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#FFF8EC', borderColor: '#E6DFD4', borderRadius: '12px' }}
                                            itemStyle={{ color: '#1F2D3D' }}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="millet" name="Pearl Millet" stroke="#2E7D32" strokeWidth={3} dot={{ r: 4, fill: '#2E7D32' }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="ragi" name="Ragi" stroke="#DFA44A" strokeWidth={3} dot={{ r: 4, fill: '#DFA44A' }} />
                                        <Line type="monotone" dataKey="jowar" name="Jowar" stroke="#1F4B6B" strokeWidth={3} dot={{ r: 4, fill: '#1F4B6B' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Demand by State */}
                        <Card className="border-[#E6DFD4] shadow-sm">
                            <CardHeader>
                                <CardTitle>Top Bidding States</CardTitle>
                                <CardDescription>Regions with highest demand for your produce.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stateDemandData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E6DFD4" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="state" type="category" stroke="#7A6A58" tickLine={false} axisLine={false} width={100} />
                                        <Tooltip cursor={{ fill: '#FFF8EC' }} contentStyle={{ borderRadius: '12px' }} />
                                        <Bar dataKey="demand" fill="#2E7D32" radius={[0, 4, 4, 0]} barSize={32} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Demand vs Supply */}
                        <Card className="border-[#E6DFD4] shadow-sm">
                            <CardHeader>
                                <CardTitle>Market Balance</CardTitle>
                                <CardDescription>Current Demand vs Supply ratio in your category.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={supplyDemandData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {supplyDemandData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px' }} />
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

export default AuctionInsightsPage;
