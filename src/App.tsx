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
import SellerMarketplace from "./pages/dashboard/seller/SellerMarketplace";
import CreateAuctionPage from "./pages/dashboard/seller/CreateAuctionPage";
import MyLotsPage from "./pages/dashboard/seller/MyLotsPage";
import AuctionDetailPage from "./pages/dashboard/seller/AuctionDetailPage";
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
              <ProtectedRoute allowedRoles={['seller', 'fpo']}>
                <AuctionDetailPage />
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