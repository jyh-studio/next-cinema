import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Payment from "./pages/Payment";
import WhatWeOffer from "./pages/WhatWeOffer";
import OurMission from "./pages/OurMission";
import FreeGuides from "./pages/FreeGuides";
import Membership from "./pages/Membership";
import ProfileBuilder from "./pages/ProfileBuilder";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Learn from "./pages/Learn";
import Community from "./pages/Community";
import News from "./pages/News";
import Magazines from "./pages/Magazines";
import Worksheets from "./pages/Worksheets";
import AuthGuard from "./components/AuthGuard";
import NotFound from "./pages/NotFound";
import { authUtils } from "./utils/auth";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize authentication on app startup
    authUtils.initializeAuth().catch(console.error);
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/what-we-offer" element={<WhatWeOffer />} />
          <Route path="/our-mission" element={<OurMission />} />
          <Route path="/free-guides" element={<FreeGuides />} />
          
          {/* Auth Required Routes */}
          <Route path="/membership" element={
            <AuthGuard>
              <Membership />
            </AuthGuard>
          } />
          <Route path="/profile-builder" element={
            <AuthGuard>
              <ProfileBuilder />
            </AuthGuard>
          } />
          <Route path="/profile" element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          } />
          <Route path="/profile/:userId" element={
            <AuthGuard>
              <UserProfile />
            </AuthGuard>
          } />
          
          {/* Member-Only Routes */}
          <Route path="/learn" element={
            <AuthGuard requireMembership>
              <Learn />
            </AuthGuard>
          } />
          <Route path="/community" element={
            <AuthGuard requireMembership>
              <Community />
            </AuthGuard>
          } />
          <Route path="/news" element={
            <AuthGuard requireMembership>
              <News />
            </AuthGuard>
          } />
          <Route path="/magazines" element={
            <AuthGuard requireMembership>
              <Magazines />
            </AuthGuard>
          } />
          <Route path="/worksheets" element={
            <AuthGuard requireMembership>
              <Worksheets />
            </AuthGuard>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;