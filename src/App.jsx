import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AutopilotProvider } from './context/AutopilotContext';
import { authService } from './services/api';
import { loginSuccess, logout } from './store/authSlice';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import MockInterview from './pages/MockInterview';
import ApplicationsTracker from './pages/ApplicationsTracker';
import LinkedInAnalyzer from './pages/LinkedInAnalyzer';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import OnboardingStep1 from './pages/onboarding/OnboardingStep1';
import OnboardingStep2 from './pages/onboarding/OnboardingStep2';
import OnboardingStep3 from './pages/onboarding/OnboardingStep3';
import JobSearch from './pages/JobSearch';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import CoverLetters from './pages/CoverLetters';
import SalaryNegotiation from './pages/SalaryNegotiation';
import SkillGap from './pages/SkillGap';
import AIRecommendations from './pages/AIRecommendations';
import AdminDashboard from './pages/AdminDashboard';
import PortfolioBuilder from './pages/PortfolioBuilder';
import AutoMatch from './pages/AutoMatch';
import Settings from './pages/Settings';
import Upgrade from './pages/Upgrade';
import Networking from './pages/Networking';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const profile = await authService.getProfile();
          dispatch(loginSuccess({ user: profile, token }));
        } catch (error) {
          console.error('Failed to fetch profile', error);
          dispatch(logout());
        }
      }
    };
    fetchUser();
  }, [token, user, dispatch]);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/onboarding/step-1" element={<OnboardingStep1 />} />
          <Route path="/onboarding/step-2" element={<OnboardingStep2 />} />
          <Route path="/onboarding/step-3" element={<OnboardingStep3 />} />
          
          <Route path="/dashboard" element={
            <AutopilotProvider>
              <DashboardLayout />
            </AutopilotProvider>
          }>
            <Route index element={<Dashboard />} />
            <Route path="jobs" element={<JobSearch />} />
            <Route path="recommendations" element={<AIRecommendations />} />
            <Route path="resume" element={<ResumeAnalyzer />} />
            <Route path="cover-letters" element={<CoverLetters />} />
            <Route path="salary-negotiation" element={<SalaryNegotiation />} />
            <Route path="mock-interview" element={<MockInterview />} />
            <Route path="skills" element={<SkillGap />} />
            <Route path="applications" element={<ApplicationsTracker />} />
            <Route path="linkedin" element={<LinkedInAnalyzer />} />
            <Route path="networking" element={<Networking />} />
            <Route path="settings" element={<Settings />} />
            <Route path="upgrade" element={<Upgrade />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="portfolio" element={<PortfolioBuilder />} />
            <Route path="auto-match" element={<AutoMatch />} />
            {/* We will add more routes here for Job Search, Resume Analyzer, etc. */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
