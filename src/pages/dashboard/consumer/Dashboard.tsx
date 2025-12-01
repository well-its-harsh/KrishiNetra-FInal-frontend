import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingBag,
  Award,
  Truck,
  CreditCard,
  MessageSquare,
  Settings,
  Plus,
  Upload,
  FileText,
  Eye,
  Send,
  TrendingUp,
  Leaf,
  BarChart3,
  ChevronLeft,
  Star,
  ArrowUpRight,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip as RechartsTooltip, XAxis, PieChart, Pie, Cell } from "recharts";
import pearlMilletImage from "@/assets/product-pearl-millet.jpg";
import ragiFlourImage from "@/assets/product-ragi-flour.jpg";
import foxtailMilletImage from "@/assets/product-foxtail-millet.jpg";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Package, label: "Listings", active: false },
  { icon: Warehouse, label: "Inventory", active: false },
  { icon: ShoppingBag, label: "Orders", active: false },
  { icon: Award, label: "Quality Certificates", active: false },
  { icon: Truck, label: "Logistics", active: false },
  { icon: CreditCard, label: "Payments", active: false },
  { icon: MessageSquare, label: "Messages", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const kpiHighlights = [
  {
    id: "orders",
    title: "Total Orders Today",
    value: "24",
    change: "+12%",
    subLabel: "vs yesterday",
    icon: ShoppingBag,
    accentBg: "bg-[#E4F5E6]",
    accentColor: "#2E7D32",
    sparkline: [12, 16, 14, 18, 21, 19, 24],
  },
  {
    id: "pickups",
    title: "Pending Pickups",
    value: "8",
    change: "3 urgent",
    subLabel: "across 4 hubs",
    icon: Truck,
    accentBg: "bg-[#FDEFD7]",
    accentColor: "#DFA44A",
    sparkline: [2, 4, 5, 6, 5, 7, 8],
  },
  {
    id: "price",
    title: "Avg Selling Price",
    value: "₹142/kg",
    change: "+5.1%",
    subLabel: "premium millet mix",
    icon: BarChart3,
    accentBg: "bg-[#E7ECF5]",
    accentColor: "#355070",
    sparkline: [110, 115, 120, 130, 135, 142, 140],
  },
  {
    id: "revenue",
    title: "Revenue This Month",
    value: "₹1,24,500",
    change: "+18.3%",
    subLabel: "₹22k projected uplift",
    icon: TrendingUp,
    accentBg: "bg-[#F1F7DB]",
    accentColor: "#556B2F",
    sparkline: [42000, 58000, 61000, 72000, 84500, 91000, 124500],
  },
];

const bestSellingProducts = [
  {
    name: "Pearl Millet Gold",
    image: pearlMilletImage,
    price: "₹142/kg",
    rating: 4.7,
    orders: 182,
    stockStatus: "In stock",
    stockTone: "bg-[#E4F5E6] text-[#2E7D32]",
    badge: "FPO Verified",
  },
  {
    name: "Ragi Flour Artisan",
    image: ragiFlourImage,
    price: "₹168/kg",
    rating: 4.8,
    orders: 156,
    stockStatus: "Low reserve",
    stockTone: "bg-[#FFF3D9] text-[#B7741D]",
    badge: "Organic",
  },
  {
    name: "Foxtail Millet Prime",
    image: foxtailMilletImage,
    price: "₹152/kg",
    rating: 4.6,
    orders: 139,
    stockStatus: "Refill due",
    stockTone: "bg-[#E1EEF9] text-[#1F4B6B]",
    badge: "Lab Verified",
  },
  {
    name: "Pearl Millet Reserve",
    image: pearlMilletImage,
    price: "₹149/kg",
    rating: 4.5,
    orders: 126,
    stockStatus: "In stock",
    stockTone: "bg-[#E4F5E6] text-[#2E7D32]",
    badge: "FSSAI",
  },
];

const topSellers = [
  { name: "Green Valley FPO", initials: "GV", category: "Organic grains", revenue: "₹6.8L", growth: "+24%", consistency: "98%", avatarColor: "bg-[#E4F5E6]" },
  { name: "Millet Basket Co-op", initials: "MB", category: "Urban retail", revenue: "₹5.2L", growth: "+18%", consistency: "95%", avatarColor: "bg-[#FDEFD7]" },
  { name: "Village Harvest", initials: "VH", category: "Bulk B2B", revenue: "₹4.4L", growth: "+14%", consistency: "93%", avatarColor: "bg-[#E1EEF9]" },
  { name: "Foxtail Collective", initials: "FC", category: "Exports", revenue: "₹3.9L", growth: "+11%", consistency: "90%", avatarColor: "bg-[#F1F7DB]" },
];

const volumeTrend = [
  { month: "Apr", orders: 120, revenue: 42 },
  { month: "May", orders: 150, revenue: 54 },
  { month: "Jun", orders: 168, revenue: 58 },
  { month: "Jul", orders: 190, revenue: 64 },
  { month: "Aug", orders: 210, revenue: 71 },
  { month: "Sep", orders: 236, revenue: 78 },
  { month: "Oct", orders: 252, revenue: 84 },
];

const fulfillmentMix = [
  { name: "Direct FPO", value: 38, color: "#2E7D32" },
  { name: "Certified Organic", value: 27, color: "#DFA44A" },
  { name: "Lab Verified", value: 19, color: "#355070" },
  { name: "FSSAI Batches", value: 16, color: "#8B5E34" },
];

const ordersData = [
  {
    id: "ORD-2024-1234",
    buyer: "Green Valley Stores",
    product: "Pearl Millet",
    qty: "50 kg",
    status: "Pending verify",
    badgeClass: "bg-[#FFF3D9] text-[#B7741D]",
    eta: "Pickup in 3h",
    priority: "High",
  },
  {
    id: "ORD-2024-1235",
    buyer: "FarmFresh Co-op",
    product: "Ragi Flour",
    qty: "100 kg",
    status: "Ready to ship",
    badgeClass: "bg-[#E4F5E6] text-[#2E7D32]",
    eta: "Dispatch slot 5pm",
    priority: "Medium",
  },
  {
    id: "ORD-2024-1236",
    buyer: "Organic Bazaar",
    product: "Foxtail Millet",
    qty: "75 kg",
    status: "In transit",
    badgeClass: "bg-[#E1EEF9] text-[#1F4B6B]",
    eta: "ETA 22 Nov",
    priority: "Low",
  },
  {
    id: "ORD-2024-1237",
    buyer: "Millet Basket",
    product: "Kodo Millet",
    qty: "60 kg",
    status: "Awaiting pickup",
    badgeClass: "bg-[#F1F7DB] text-[#556B2F]",
    eta: "Driver assigned",
    priority: "High",
  },
  {
    id: "ORD-2024-1238",
    buyer: "Village Harvest",
    product: "Barnyard Millet",
    qty: "45 kg",
    status: "Quality check",
    badgeClass: "bg-[#FFE8E0] text-[#C6533D]",
    eta: "Lab slot 2pm",
    priority: "Medium",
  },
];

const pickupRoutes = [
  { label: "Jaipur Hub", x: 70, y: 150, urgent: true },
  { label: "Nashik Mill", x: 180, y: 90, urgent: false },
  { label: "Raipur Cluster", x: 280, y: 130, urgent: false },
];

const quickActions = [
  { title: "Add new listing", description: "Push fresh millet lots live", icon: Plus },
  { title: "Schedule pickup", description: "Lock slots with logistics", icon: Truck },
  { title: "Upload certificate", description: "Keep compliance updated", icon: FileText },
];

const buildSparklinePath = (points: number[]) => {
  if (!points.length) return "";
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;

  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 40 - ((point - min) / range) * 40;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
};

const Sparkline = ({ points, color, id }: { points: number[]; color: string; id: string }) => {
  const path = useMemo(() => buildSparklinePath(points), [points]);
  if (!path) return null;

  return (
    <svg viewBox="0 0 100 40" className="mt-4 h-12 w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-fill`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`${path} L100 40 L0 40 Z`} fill={`url(#${id}-fill)`} />
      <path d={path} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <circle r={2.5} fill="#fff" stroke={color} strokeWidth={1.5} cx="100" cy={path.split("L").pop()?.split(",")[1] || 20} />
    </svg>
  );
};

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoadingProducts(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F0E4]">
      <Navigation />

      <div className="flex">
        <aside
          className={cn(
            "grain-texture sticky top-16 hidden h-[calc(100vh-4rem)] flex-col border-r border-[#F0E4D4] bg-[#FFF8EC]/95 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-500 lg:flex",
            collapsed ? "w-24" : "w-72",
          )}
        >
          <div className="flex items-center gap-3 rounded-2xl border border-white/40 bg-white/70 p-4 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2E7D32]/10">
              <Leaf className="h-6 w-6 text-[#2E7D32]" />
            </div>
            {!collapsed && (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#7A6A58]">Millet</p>
                <p className="text-lg font-semibold text-[#1F2D3D]">Command</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex-1 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200",
                    item.active
                      ? "bg-white/90 text-[#2E7D32] shadow-[0_10px_25px_rgba(46,125,50,0.12)]"
                      : "text-[#7A6A58] hover:bg-white/40",
                    collapsed ? "justify-center" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-2xl bg-white/70 transition-colors",
                      item.active ? "text-[#2E7D32]" : "text-[#A28C74]",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.active && (
                    <span className="ml-auto rounded-full bg-[#2E7D32]/10 px-3 py-1 text-xs font-semibold text-[#2E7D32]">Live</span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            className="btn-ripple mt-auto flex items-center justify-between rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-semibold text-[#7A6A58] shadow-sm"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            {!collapsed && <span>Collapse</span>}
            <ChevronLeft className={cn("h-4 w-4 text-[#7A6A58] transition-transform", collapsed && "rotate-180")} />
          </button>
        </aside>

        <main className="flex-1 space-y-8 p-6 lg:p-10">
          <section className="rounded-[28px] border border-[#EADFD1] bg-gradient-to-br from-white/95 to-[#FDF7EF] p-6 shadow-[0_30px_80px_rgba(121,98,63,0.1)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[#8C7B67]">Seller portal</p>
                <h1 className="text-3xl font-semibold text-[#1F2D3D] md:text-4xl">Marketplace Control Center</h1>
                <p className="text-[#5B4D3B]">Luxury insights tailored for millet entrepreneurs.</p>
              </div>
              <Button variant="outline" className="btn-ripple rounded-full border-[#E7DCCA] text-[#2E7D32] hover:bg-white">
                <FileText className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpiHighlights.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.id}
                  className="rounded-[20px] border border-[#E7DCCA] bg-gradient-to-br from-white to-[#FBF5EC] p-5 shadow-[0_25px_60px_rgba(96,80,52,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_35px_80px_rgba(96,80,52,0.12)]"
                >
                  <div className="flex items-center justify-between">
                    <div className={cn("rounded-2xl p-3", kpi.accentBg)}>
                      <Icon className="h-5 w-5" style={{ color: kpi.accentColor }} />
                    </div>
                    <Badge className="rounded-full bg-white/80 text-[#8C7B67] shadow-sm">{kpi.subLabel}</Badge>
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#8C7B67]">{kpi.title}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-[#1F2D3D]">{kpi.value}</span>
                    <span className={kpi.change.includes("-") ? "text-[#C6533D]" : "text-[#2E7D32]"}>{kpi.change}</span>
                  </div>
                  <Sparkline points={kpi.sparkline} color={kpi.accentColor} id={kpi.id} />
                </div>
              );
            })}
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2 rounded-[24px] border border-[#E7DCCA] bg-white/95 shadow-[0_30px_60px_rgba(93,74,51,0.08)]">
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="text-2xl text-[#1F2D3D]">Best selling products</CardTitle>
                  <CardDescription className="text-[#7A6A58]">Aligned with premium marketplace card styling</CardDescription>
                </div>
                <Button variant="ghost" className="btn-ripple rounded-full text-[#2E7D32] hover:bg-[#E4F5E6]">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  View catalog
                </Button>
              </CardHeader>
              <CardContent>
                {isLoadingProducts ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <Skeleton key={`product-skeleton-${idx}`} className="h-32 rounded-2xl bg-white/60" />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {bestSellingProducts.map((product) => (
                      <div
                        key={product.name}
                        className="group flex items-center gap-4 rounded-2xl border border-[#F1E7DA] bg-gradient-to-br from-white to-[#F9F4EA] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#E0CDB4] hover:shadow-[0_20px_40px_rgba(99,81,48,0.15)]"
                      >
                        <div className="h-20 w-20 overflow-hidden rounded-2xl border border-white/80">
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-base font-semibold text-[#1F2D3D]">{product.name}</p>
                            <Badge variant="secondary" className="rounded-full bg-[#FFF8EC] text-[#C0924A]">
                              {product.badge}
                            </Badge>
                          </div>
                          <p className="text-sm text-[#7A6A58]">{product.price}</p>
                          <div className="flex items-center gap-2 text-sm text-[#5B4D3B]">
                            <Star className="h-4 w-4 fill-[#DFA44A] text-[#DFA44A]" />
                            <span>{product.rating}</span>
                            <span className="text-[#B09782]">· {product.orders} orders</span>
                          </div>
                          <Badge className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", product.stockTone)}>{product.stockStatus}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border border-[#E7DCCA] bg-white/90 shadow-[0_20px_50px_rgba(93,74,51,0.12)]">
              <CardHeader>
                <CardTitle className="text-xl text-[#1F2D3D]">Top sellers</CardTitle>
                <CardDescription className="text-[#7A6A58]">Dual-column profile insights</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {topSellers.map((seller) => (
                  <div key={seller.name} className="rounded-2xl border border-[#EFE2D1] bg-white/80 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white/70" style={{ backgroundColor: seller.avatarColor }}>
                        <AvatarImage alt={seller.name} />
                        <AvatarFallback className="text-[#2E7D32]">{seller.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-[#1F2D3D]">{seller.name}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#B09782]">{seller.category}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-[#7A6A58]">Revenue</span>
                      <span className="font-semibold text-[#1F2D3D]">{seller.revenue}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-[#7A6A58]">Growth</span>
                      <span className="font-semibold text-[#2E7D32]">{seller.growth}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-[#7A6A58]">Consistency</span>
                      <span className="font-semibold text-[#355070]">{seller.consistency}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2 rounded-[24px] border border-[#E7DCCA] bg-white/95 shadow-[0_30px_60px_rgba(93,74,51,0.08)]">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1F2D3D]">Performance pulse</CardTitle>
                <CardDescription className="text-[#7A6A58]">Curved analytics with natural palette</CardDescription>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeTrend}>
                    <defs>
                      <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DFA44A" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#DFA44A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#EEE2D2" vertical={false} strokeDasharray="3 6" />
                    <XAxis dataKey="month" stroke="#B09782" tickLine={false} />
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: 16,
                        borderColor: "#E7DCCA",
                        background: "#FFFCF7",
                        boxShadow: "0 12px 30px rgba(96,80,52,0.1)",
                      }}
                    />
                    <Area type="monotone" dataKey="orders" stroke="#2E7D32" strokeWidth={3} fillOpacity={1} fill="url(#ordersGradient)" strokeLinecap="round" />
                    <Area type="monotone" dataKey="revenue" stroke="#DFA44A" strokeWidth={3} fillOpacity={1} fill="url(#revenueGradient)" strokeLinecap="round" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border border-[#E7DCCA] bg-white/95 shadow-[0_20px_50px_rgba(93,74,51,0.12)]">
              <CardHeader>
                <CardTitle className="text-xl text-[#1F2D3D]">Fulfillment mix</CardTitle>
                <CardDescription className="text-[#7A6A58]">Doughnut overview</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={fulfillmentMix} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4}>
                        {fulfillmentMix.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: 16,
                          borderColor: "#E7DCCA",
                          background: "#FFFCF7",
                          boxShadow: "0 12px 30px rgba(96,80,52,0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid gap-3">
                  {fulfillmentMix.map((segment) => (
                    <div key={segment.name} className="flex items-center justify-between text-sm text-[#5B4D3B]">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                        <span className="font-medium">{segment.name}</span>
                      </div>
                      <span className="font-semibold">{segment.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-[2.3fr_1fr]">
            <Card className="rounded-[26px] border border-[#E7DCCA] bg-white/95 shadow-[0_30px_70px_rgba(93,74,51,0.12)]">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl text-[#1F2D3D]">Orders in motion</CardTitle>
                  <CardDescription className="text-[#7A6A58]">Elevated row cards with inline controls</CardDescription>
                </div>
                <Badge className="rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">Live sync</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {ordersData.map((order) => (
                  <div
                    key={order.id}
                    className="group rounded-2xl border border-[#F1E7DA] bg-gradient-to-br from-white to-[#FBF6ED] p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(99,81,48,0.15)]"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-[#B09782]">{order.id}</p>
                        <p className="mt-1 text-lg font-semibold text-[#1F2D3D]">{order.buyer}</p>
                        <p className="text-sm text-[#7A6A58]">
                          {order.product} · {order.qty}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold", order.badgeClass)}>{order.status}</Badge>
                        <Badge className="rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">{order.priority} priority</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="btn-ripple rounded-full bg-white/80 text-[#2E7D32] hover:bg-[#E4F5E6]">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="btn-ripple rounded-full bg-white/80 text-[#DFA44A] hover:bg-[#FFF3D9]">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#7A6A58]">
                      <span className="flex items-center gap-1">
                        <Compass className="h-4 w-4 text-[#C0924A]" />
                        {order.eta}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[#C0924A]/40" />
                      <span>Tracking synced · 2 events</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-[24px] border border-[#E7DCCA] bg-white/95 shadow-[0_25px_60px_rgba(93,74,51,0.1)]">
                <CardHeader>
                  <CardTitle className="text-xl text-[#1F2D3D]">Pickup map</CardTitle>
                  <CardDescription className="text-[#7A6A58]">Interactive markers with curved routes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-hidden rounded-[24px] border border-[#E8DECF] bg-gradient-to-br from-[#FDF7EF] to-[#EFE3D1] p-4">
                    <svg viewBox="0 0 360 200" className="h-52 w-full">
                      <defs>
                        <linearGradient id="route" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#2E7D32" stopOpacity={0.6} />
                          <stop offset="100%" stopColor="#DFA44A" stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                      <path d="M40 160 Q140 40 220 140 T340 80" stroke="url(#route)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="8 8" />
                      {pickupRoutes.map((route) => (
                        <g key={route.label}>
                          <circle cx={route.x} cy={route.y} r={12} fill={route.urgent ? "#C6533D" : "#2E7D32"} opacity={0.18} />
                          <circle cx={route.x} cy={route.y} r={6} fill={route.urgent ? "#C6533D" : "#2E7D32"} />
                          <text x={route.x + 12} y={route.y - 10} fontSize="10" fill="#5B4D3B">
                            {route.label}
                          </text>
                        </g>
                      ))}
                    </svg>
                    <div className="mt-4 flex items-center justify-between text-sm text-[#5B4D3B]">
                      <Badge className="rounded-full bg-[#2E7D32]/10 text-[#2E7D32]">3 live pickups</Badge>
                      <Badge className="rounded-full bg-[#FFF3D9] text-[#B7741D]">2 urgent</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[24px] border border-[#E7DCCA] bg-white/95 shadow-[0_20px_50px_rgba(93,74,51,0.12)]">
                <CardHeader>
                  <CardTitle className="text-xl text-[#1F2D3D]">Quick actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={action.title}
                        variant="ghost"
                        className="btn-ripple flex w-full items-center justify-between rounded-2xl border border-transparent bg-white/80 px-4 py-4 text-left text-[#1F2D3D] shadow-sm hover:border-[#E7DCCA]"
                      >
                        <span className="flex items-center gap-3">
                          <span className="rounded-2xl bg-[#F1F7DB] p-2 text-[#2E7D32]">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold">{action.title}</span>
                            <span className="text-xs text-[#7A6A58]">{action.description}</span>
                          </span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-[#C0924A]" />
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="rounded-[24px] border border-dashed border-[#D8C9B7] bg-gradient-to-br from-white to-[#F9F4EA] text-center shadow-[0_18px_45px_rgba(93,74,51,0.12)]">
                <CardHeader>
                  <CardTitle className="text-xl text-[#1F2D3D]">Quality dossier</CardTitle>
                  <CardDescription className="text-[#7A6A58]">Premium upload surface</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border-2 border-dashed border-[#E7DCCA] bg-white/70 p-6">
                    <Upload className="mx-auto h-10 w-10 text-[#C0924A]" />
                    <p className="mt-3 text-sm text-[#7A6A58]">Drag & drop PDF or browse files</p>
                    <Button variant="outline" className="btn-ripple mt-4 rounded-full border-[#E7DCCA] text-[#2E7D32] hover:bg-white">
                      <FileText className="mr-2 h-4 w-4" />
                      Upload certificate
                    </Button>
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[#B09782]">FPO · Organic · Lab verified</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <Button
        className="btn-ripple fixed bottom-8 right-8 z-40 h-14 w-14 rounded-full bg-[#2E7D32] text-white shadow-[0_20px_50px_rgba(46,125,50,0.45)] hover:bg-[#256428]"
        size="icon"
        aria-label="Create quick action"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Dashboard;
