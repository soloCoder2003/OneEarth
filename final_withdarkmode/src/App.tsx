import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { Layout } from '@/components/layout/Layout';

// Pages
import LandingPage from './pages/home/LandingPage';
import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';
import ChallengesPage from './pages/challenges/ChallengesPage';
import LeaderboardPage from './pages/leaderboard/LeaderboardPage';
import RewardsPage from './pages/rewards/RewardsPage';
import ProfilePage from './pages/user/ProfilePage';
import HostDashboard from './pages/host/HostDashboard';
import CreateChallenge from './pages/host/CreateChallenge';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/host/dashboard" element={<HostDashboard />} />
              <Route path="/host/create-challenge" element={<CreateChallenge />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;