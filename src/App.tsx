import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/context/AppContext";
import Index from "./pages/Index";
import AlumniHomePage from "./pages/AlumniHomePage";
import TenantScreen from "./pages/TenantScreen";
import HomePage from "./pages/HomePage";
import SongbookPage from "./pages/SongbookPage";
import SongDetailPage from "./pages/SongDetailPage";
import LunchPage from "./pages/LunchPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import GamesPage from "./pages/GamesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const HomeRedirect = () => {
  const { role } = useApp();
  if (role === "alumni") return <AlumniHomePage />;
  return <HomePage />;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { role } = useApp();
  if (!role) return <Navigate to="/tenant" replace />;
  return <>{children}</>;
};

const StudentRoute = ({ children }: { children: React.ReactNode }) => {
  const { role } = useApp();
  if (role !== "student") return <Navigate to="/home" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tenant" element={<TenantScreen />} />
            <Route path="/home" element={<ProtectedRoute><HomeRedirect /></ProtectedRoute>} />
            <Route path="/songbook" element={<ProtectedRoute><SongbookPage /></ProtectedRoute>} />
            <Route path="/songbook/:id" element={<ProtectedRoute><SongDetailPage /></ProtectedRoute>} />
            <Route path="/lunch" element={<ProtectedRoute><StudentRoute><LunchPage /></StudentRoute></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><StudentRoute><EventsPage /></StudentRoute></ProtectedRoute>} />
            <Route path="/events/:id" element={<ProtectedRoute><StudentRoute><EventDetailPage /></StudentRoute></ProtectedRoute>} />
            <Route path="/games" element={<ProtectedRoute><StudentRoute><GamesPage /></StudentRoute></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
