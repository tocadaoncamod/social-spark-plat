import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { TikTokConnectionProvider } from "@/contexts/TikTokConnectionContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import FacebookPage from "./pages/Facebook";
import FacebookAutomation from "./pages/facebook/FacebookAutomation";
import InstagramPage from "./pages/Instagram";
import YouTubePage from "./pages/YouTube";
import TikTokPage from "./pages/TikTok";
import TelegramPage from "./pages/Telegram";
import TwitterPage from "./pages/Twitter";
import KwaiPage from "./pages/Kwai";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
// TikTok Shop pages
import TikTokDashboard from "./pages/tiktok/TikTokDashboard";
import TikTokProducts from "./pages/tiktok/TikTokProducts";
import TikTokOrders from "./pages/tiktok/TikTokOrders";
import TikTokAnalytics from "./pages/tiktok/TikTokAnalytics";
import TikTokInfluencers from "./pages/tiktok/TikTokInfluencers";
import TikTokContent from "./pages/tiktok/TikTokContent";
import TikTokFinancial from "./pages/tiktok/TikTokFinancial";
import TikTokSettings from "./pages/tiktok/TikTokSettings";
// TikTok Market Analysis pages
import TikTokMarketProducts from "./pages/tiktok/TikTokMarketProducts";
import TikTokMarketSearch from "./pages/tiktok/TikTokMarketSearch";
import TikTokMarketLives from "./pages/tiktok/TikTokMarketLives";
import TikTokMarketInfluencers from "./pages/tiktok/TikTokMarketInfluencers";
import TikTokMarketVideos from "./pages/tiktok/TikTokMarketVideos";
import TikTokMarketStores from "./pages/tiktok/TikTokMarketStores";
import TikTokMarketCategories from "./pages/tiktok/TikTokMarketCategories";
import TikTokAds from "./pages/tiktok/TikTokAds";
import TikTokAIScripts from "./pages/tiktok/TikTokAIScripts";
import TikTokAIVOC from "./pages/tiktok/TikTokAIVOC";
import TikTokAITranscription from "./pages/tiktok/TikTokAITranscription";
import TikTokCallback from "./pages/tiktok/TikTokCallback";
// WhatsApp pages (WA Sender Pro)
import WhatsAppDashboard from "./pages/whatsapp/WhatsAppDashboard";
import WhatsAppSend from "./pages/whatsapp/WhatsAppSend";
import WhatsAppContacts from "./pages/whatsapp/WhatsAppContacts";
import WhatsAppGroups from "./pages/whatsapp/WhatsAppGroups";
import WhatsAppSchedule from "./pages/whatsapp/WhatsAppSchedule";
import WhatsAppChatbot from "./pages/whatsapp/WhatsAppChatbot";
import WhatsAppLeads from "./pages/whatsapp/WhatsAppLeads";
import WhatsAppReports from "./pages/whatsapp/WhatsAppReports";
import WhatsAppInstances from "./pages/whatsapp/WhatsAppInstances";
import WhatsAppLeadScraper from "./pages/whatsapp/WhatsAppLeadScraper";
import WhatsAppContactLists from "./pages/whatsapp/WhatsAppContactLists";
// Toca da Onça pages (análise de mercado)
import TocaDaOncaDashboard from "./pages/tocadaonca/TocaDaOncaDashboard";
import ProductsRankingSales from "./pages/tocadaonca/ProductsRankingSales";
import InfluencersOutreach from "./pages/tocadaonca/InfluencersOutreach";
import VideoTranscription from "./pages/tocadaonca/VideoTranscription";
import MonitoringAlerts from "./pages/tocadaonca/MonitoringAlerts";
import TocaLivesRanking from "./pages/tocadaonca/LivesRanking";
import TocaLivesPerformance from "./pages/tocadaonca/LivesPerformance";
import TocaLivesScheduled from "./pages/tocadaonca/LivesScheduled";
// Legacy FastMoss pages (will be migrated)
import ProductSearch from "./pages/fastmoss/ProductSearch";
import ProductDetail from "./pages/fastmoss/ProductDetail";
import VOCAnalysis from "./pages/fastmoss/VOCAnalysis";
import AIScripts from "./pages/fastmoss/AIScripts";
import CategoryOverview from "./pages/fastmoss/CategoryOverview";
import StoresSearch from "./pages/fastmoss/StoresSearch";
import VideosGallery from "./pages/fastmoss/VideosGallery";
import LivesRanking from "./pages/fastmoss/LivesRanking";
import AdsEcommerce from "./pages/fastmoss/AdsEcommerce";
import InfluencersRanking from "./pages/fastmoss/InfluencersRanking";
import MonitoringRealtime from "./pages/fastmoss/MonitoringRealtime";
import PublishingHeatmap from "./pages/fastmoss/PublishingHeatmap";
import Onboarding from "./pages/Onboarding";
import Agentes from "./pages/Agentes";
import FashionPublisher from "./pages/FashionPublisher";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TikTokConnectionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/agentes" element={<ProtectedRoute><Agentes /></ProtectedRoute>} />
            <Route path="/fashion-publisher" element={<ProtectedRoute><FashionPublisher /></ProtectedRoute>} />
            
            {/* Main Dashboard - 8 Apps Hub */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            {/* Toca da Onça - Análise de Mercado Completa (App Extra) */}
            <Route path="/tocadaonca" element={<Navigate to="/tocadaonca/dashboard" replace />} />
            <Route path="/tocadaonca/dashboard" element={<ProtectedRoute><TocaDaOncaDashboard /></ProtectedRoute>} />
            <Route path="/tocadaonca/products/ranking" element={<ProtectedRoute><ProductsRankingSales /></ProtectedRoute>} />
            <Route path="/tocadaonca/lives/ranking" element={<ProtectedRoute><TocaLivesRanking /></ProtectedRoute>} />
            <Route path="/tocadaonca/lives/performance" element={<ProtectedRoute><TocaLivesPerformance /></ProtectedRoute>} />
            <Route path="/tocadaonca/lives/scheduled" element={<ProtectedRoute><TocaLivesScheduled /></ProtectedRoute>} />
            <Route path="/tocadaonca/influencers/outreach" element={<ProtectedRoute><InfluencersOutreach /></ProtectedRoute>} />
            <Route path="/tocadaonca/videos/transcription" element={<ProtectedRoute><VideoTranscription /></ProtectedRoute>} />
            <Route path="/tocadaonca/monitoring/alerts" element={<ProtectedRoute><MonitoringAlerts /></ProtectedRoute>} />
            
            {/* Social Media Pages */}
            <Route path="/facebook" element={<Navigate to="/facebook/automation" replace />} />
            <Route path="/facebook/automation" element={<ProtectedRoute><FacebookAutomation /></ProtectedRoute>} />
            <Route path="/instagram" element={<ProtectedRoute><InstagramPage /></ProtectedRoute>} />
            <Route path="/whatsapp" element={<Navigate to="/whatsapp/dashboard" replace />} />
            <Route path="/whatsapp/dashboard" element={<ProtectedRoute><WhatsAppDashboard /></ProtectedRoute>} />
            <Route path="/whatsapp/send" element={<ProtectedRoute><WhatsAppSend /></ProtectedRoute>} />
            <Route path="/whatsapp/contacts" element={<ProtectedRoute><WhatsAppContacts /></ProtectedRoute>} />
            <Route path="/whatsapp/groups" element={<ProtectedRoute><WhatsAppGroups /></ProtectedRoute>} />
            <Route path="/whatsapp/schedule" element={<ProtectedRoute><WhatsAppSchedule /></ProtectedRoute>} />
            <Route path="/whatsapp/chatbot" element={<ProtectedRoute><WhatsAppChatbot /></ProtectedRoute>} />
            <Route path="/whatsapp/leads" element={<ProtectedRoute><WhatsAppLeads /></ProtectedRoute>} />
            <Route path="/whatsapp/reports" element={<ProtectedRoute><WhatsAppReports /></ProtectedRoute>} />
            <Route path="/whatsapp/instances" element={<ProtectedRoute><WhatsAppInstances /></ProtectedRoute>} />
            <Route path="/whatsapp/lead-scraper" element={<ProtectedRoute><WhatsAppLeadScraper /></ProtectedRoute>} />
            <Route path="/whatsapp/contact-lists" element={<ProtectedRoute><WhatsAppContactLists /></ProtectedRoute>} />
            <Route path="/youtube" element={<ProtectedRoute><YouTubePage /></ProtectedRoute>} />
            <Route path="/tiktok" element={<Navigate to="/tiktok/dashboard" replace />} />
            <Route path="/telegram" element={<ProtectedRoute><TelegramPage /></ProtectedRoute>} />
            <Route path="/twitter" element={<ProtectedRoute><TwitterPage /></ProtectedRoute>} />
            <Route path="/kwai" element={<ProtectedRoute><KwaiPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            
            {/* TikTok Shop routes - Minha Loja */}
            <Route path="/tiktok/dashboard" element={<ProtectedRoute><TikTokDashboard /></ProtectedRoute>} />
            <Route path="/tiktok/products" element={<ProtectedRoute><TikTokProducts /></ProtectedRoute>} />
            <Route path="/tiktok/orders" element={<ProtectedRoute><TikTokOrders /></ProtectedRoute>} />
            <Route path="/tiktok/analytics" element={<ProtectedRoute><TikTokAnalytics /></ProtectedRoute>} />
            <Route path="/tiktok/influencers" element={<ProtectedRoute><TikTokInfluencers /></ProtectedRoute>} />
            <Route path="/tiktok/content" element={<ProtectedRoute><TikTokContent /></ProtectedRoute>} />
            <Route path="/tiktok/financial" element={<ProtectedRoute><TikTokFinancial /></ProtectedRoute>} />
            <Route path="/tiktok/settings" element={<ProtectedRoute><TikTokSettings /></ProtectedRoute>} />
            <Route path="/tiktok/callback" element={<TikTokCallback />} />
            {/* TikTok Shop routes - Análise de Mercado */}
            <Route path="/tiktok/market/products" element={<ProtectedRoute><TikTokMarketProducts /></ProtectedRoute>} />
            <Route path="/tiktok/market/search" element={<ProtectedRoute><TikTokMarketSearch /></ProtectedRoute>} />
            <Route path="/tiktok/market/lives" element={<ProtectedRoute><TikTokMarketLives /></ProtectedRoute>} />
            <Route path="/tiktok/market/influencers" element={<ProtectedRoute><TikTokMarketInfluencers /></ProtectedRoute>} />
            <Route path="/tiktok/market/videos" element={<ProtectedRoute><TikTokMarketVideos /></ProtectedRoute>} />
            <Route path="/tiktok/market/stores" element={<ProtectedRoute><TikTokMarketStores /></ProtectedRoute>} />
            <Route path="/tiktok/market/categories" element={<ProtectedRoute><TikTokMarketCategories /></ProtectedRoute>} />
            {/* TikTok Shop routes - Ads & IA */}
            <Route path="/tiktok/ads" element={<ProtectedRoute><TikTokAds /></ProtectedRoute>} />
            <Route path="/tiktok/ai/scripts" element={<ProtectedRoute><TikTokAIScripts /></ProtectedRoute>} />
            <Route path="/tiktok/ai/voc" element={<ProtectedRoute><TikTokAIVOC /></ProtectedRoute>} />
            <Route path="/tiktok/ai/transcription" element={<ProtectedRoute><TikTokAITranscription /></ProtectedRoute>} />
            
            {/* FastMoss - Products */}
            <Route path="/products/search" element={<ProtectedRoute><ProductSearch /></ProtectedRoute>} />
            <Route path="/products/detail/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
            <Route path="/products/ranking/sales" element={<ProtectedRoute><ProductsRankingSales /></ProtectedRoute>} />
            <Route path="/products/ranking/new" element={<ProtectedRoute><ProductsRankingSales /></ProtectedRoute>} />
            <Route path="/products/ranking/popular" element={<ProtectedRoute><ProductsRankingSales /></ProtectedRoute>} />
            <Route path="/products/ranking/video" element={<ProtectedRoute><ProductsRankingSales /></ProtectedRoute>} />
            
            {/* FastMoss - Category */}
            <Route path="/category/overview" element={<ProtectedRoute><CategoryOverview /></ProtectedRoute>} />
            <Route path="/category/niche" element={<ProtectedRoute><CategoryOverview /></ProtectedRoute>} />
            <Route path="/category/trends" element={<ProtectedRoute><CategoryOverview /></ProtectedRoute>} />
            
            {/* FastMoss - Publishing */}
            <Route path="/publishing/heatmap" element={<ProtectedRoute><PublishingHeatmap /></ProtectedRoute>} />
            <Route path="/publishing/ai-analysis" element={<ProtectedRoute><PublishingHeatmap /></ProtectedRoute>} />
            
            {/* FastMoss - Stores */}
            <Route path="/stores/search" element={<ProtectedRoute><StoresSearch /></ProtectedRoute>} />
            <Route path="/stores/ranking" element={<ProtectedRoute><StoresSearch /></ProtectedRoute>} />
            <Route path="/stores/competitors" element={<ProtectedRoute><StoresSearch /></ProtectedRoute>} />
            
            {/* FastMoss - Videos */}
            <Route path="/videos/gallery" element={<ProtectedRoute><VideosGallery /></ProtectedRoute>} />
            <Route path="/videos/trends" element={<ProtectedRoute><VideosGallery /></ProtectedRoute>} />
            <Route path="/videos/performance" element={<ProtectedRoute><VideosGallery /></ProtectedRoute>} />
            <Route path="/videos/transcription" element={<ProtectedRoute><VideoTranscription /></ProtectedRoute>} />
            
            {/* FastMoss - Ads */}
            <Route path="/ads/ecommerce" element={<ProtectedRoute><AdsEcommerce /></ProtectedRoute>} />
            <Route path="/ads/grass-planting" element={<ProtectedRoute><AdsEcommerce /></ProtectedRoute>} />
            <Route path="/ads/advertisers" element={<ProtectedRoute><AdsEcommerce /></ProtectedRoute>} />
            
            {/* Toca da Onça - Lives */}
            <Route path="/lives/ranking" element={<ProtectedRoute><TocaLivesRanking /></ProtectedRoute>} />
            <Route path="/lives/performance" element={<ProtectedRoute><TocaLivesPerformance /></ProtectedRoute>} />
            <Route path="/lives/scheduled" element={<ProtectedRoute><TocaLivesScheduled /></ProtectedRoute>} />
            
            {/* FastMoss - AI Tools */}
            <Route path="/ai-tools/voc" element={<ProtectedRoute><VOCAnalysis /></ProtectedRoute>} />
            <Route path="/ai-tools/scripts" element={<ProtectedRoute><AIScripts /></ProtectedRoute>} />
            <Route path="/ai-tools/content" element={<ProtectedRoute><AIScripts /></ProtectedRoute>} />
            
            {/* FastMoss - Monitoring */}
            <Route path="/monitoring/realtime" element={<ProtectedRoute><MonitoringRealtime /></ProtectedRoute>} />
            <Route path="/monitoring/alerts" element={<ProtectedRoute><MonitoringAlerts /></ProtectedRoute>} />
            <Route path="/monitoring/reports" element={<ProtectedRoute><MonitoringRealtime /></ProtectedRoute>} />
            
            {/* Influencers Outreach */}
            <Route path="/influencers/outreach" element={<ProtectedRoute><InfluencersOutreach /></ProtectedRoute>} />
            <Route path="/influencers/export" element={<ProtectedRoute><InfluencersOutreach /></ProtectedRoute>} />
            
            {/* FastMoss - Influencers */}
            <Route path="/influencers/ranking" element={<ProtectedRoute><InfluencersRanking /></ProtectedRoute>} />
            <Route path="/influencers/performance" element={<ProtectedRoute><InfluencersRanking /></ProtectedRoute>} />
            <Route path="/influencers/partnerships" element={<ProtectedRoute><InfluencersRanking /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </TikTokConnectionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
