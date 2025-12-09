import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Signup from "./pages/Signup";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import Marketplace from "./pages/dashboard/consumer/Marketplace";
import CheckoutPage from "./pages/dashboard/consumer/CheckoutPage";
import OrdersPage from "./pages/dashboard/consumer/OrdersPage";
import ProductDetail from "./pages/dashboard/consumer/ProductDetail";
import AuctionDeliveryScanPage from "./pages/dashboard/consumer/AuctionDeliveryScanPage";
import SellerMarketplace from "./pages/dashboard/seller/SellerMarketplace";
import CreateAuctionPage from "./pages/dashboard/seller/CreateAuctionPage";
import MyLotsPage from "./pages/dashboard/seller/MyLotsPage";
import AuctionDetailPage from "./pages/dashboard/seller/AuctionDetailPage";
import CreateProductPage from "./pages/dashboard/seller/CreateProductPage";
import MyProductsPage from "./pages/dashboard/seller/MyProductsPage";
import ProductInsightsPage from "./pages/dashboard/seller/ProductInsightsPage";
import ProductListingModePage from "./pages/dashboard/seller/ProductListingModePage";
import CreateBulkProductPage from "./pages/dashboard/seller/CreateBulkProductPage";
import MyBulkProductsPage from "./pages/dashboard/seller/MyBulkProductsPage";
import SellerContractsPage from "./pages/dashboard/seller/SellerContractsPage";
import InstitutionDashboard from "./pages/dashboard/institution/InstitutionDashboard";
import TransporterDashboard from "./pages/dashboard/transporter/TransporterDashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

console.log('App component is rendering');

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<SignIn />} />
          
          {/* Dashboard Routes */}
          <Route 
            path="/dashboard/consumer" 
            element={
              <ProtectedRoute allowedRoles={['consumer']}>
                <Marketplace />
              </ProtectedRoute>
            } 
          />

          <Route
            path="/product/:id"
            element={
              <ProtectedRoute allowedRoles={['consumer']}>
                <ProductDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/institution"
            element={
              <ProtectedRoute allowedRoles={['institution']}>
                <InstitutionDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/transporter"
            element={
              <ProtectedRoute allowedRoles={['transporter']}>
                <TransporterDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['consumer']}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['consumer']}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/consumer/scan-delivery"
            element={
              <ProtectedRoute allowedRoles={['consumer']}>
                <AuctionDeliveryScanPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/seller"
            element={
              <ProtectedRoute allowedRoles={['seller', 'fpo']}>
                <SellerMarketplace />
              </ProtectedRoute>
            }
          />

          {/* Seller auction routes */}
          <Route
            path="/auction/create"
            element={
              <ProtectedRoute allowedRoles={['seller', 'fpo']}>
                <CreateAuctionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/auction/my-lots"
            element={
              <ProtectedRoute allowedRoles={['seller', 'fpo']}>
                <MyLotsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/auction/:id"
            element={
              <ProtectedRoute allowedRoles={['seller', 'fpo', 'consumer']}>
                <AuctionDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Seller product routes */}
          <Route
            path="/products/listing-mode"
            element={
              <ProtectedRoute allowedRoles={['seller', 'fpo']}>
                <ProductListingModePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/create"
            element={
              <ProtectedRoute allowedRoles={['seller', 'fpo']}>
                <CreateProductPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bulk-products/create"
            element={
              <ProtectedRoute allowedRoles={['seller', 'fpo']}>
                <CreateBulkProductPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bulk-products/my-listings"
            element={
              <ProtectedRoute allowedRoles={['seller', 'fpo']}>
                <MyBulkProductsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/seller/contracts"
            element={
              <ProtectedRoute allowedRoles={['seller', 'fpo']}>
                <SellerContractsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/my-products"
            element={
              <ProtectedRoute allowedRoles={['seller', 'fpo']}>
                <MyProductsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/insights"
            element={
              <ProtectedRoute allowedRoles={['seller', 'fpo']}>
                <ProductInsightsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Redirect old consumer path to new dashboard path */}
          <Route 
            path="/consumer" 
            element={<Navigate to="/dashboard/consumer" replace />} 
          />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;