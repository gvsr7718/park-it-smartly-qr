import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MallListing from "./pages/MallListing";
import BookSlot from "./pages/BookSlot";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookingHistory from "./pages/BookingHistory";
import NotFound from "./pages/NotFound";
import { initAuth } from "./utils/auth";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize authentication from session storage
    initAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/mall-listing" element={<MallListing />} />
            <Route path="/book/:mallId" element={<BookSlot />} />
            <Route path="/booking/:bookingId" element={<BookingConfirmation />} />
            <Route path="/booking-history" element={<BookingHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
