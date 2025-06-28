import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AuthProvider } from '@/context/AuthContext';
import { VehicleProvider } from '@/context/VehicleContext.jsx';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HomePage from '@/pages/HomePage';
import AboutUsPage from '@/pages/AboutUsPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfUsePage from '@/pages/TermsOfUsePage';
import PrivacyRemovalPolicyPage from '@/pages/PrivacyRemovalPolicyPage';
import ReportPage from '@/pages/ReportPage';
import EditReportPage from '@/pages/EditReportPage';
import ListPage from '@/pages/ListPage';
import VehicleDetailsPage from '@/pages/VehicleDetailsPage';
import LoginPage from '@/pages/LoginPage';
import ProfilePage from '@/pages/ProfilePage';
import EditProfilePage from '@/pages/EditProfilePage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import PricingPage from '@/pages/PricingPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import PrivateRoute from '@/components/PrivateRoute';
import AdminRoute from '@/components/AdminRoute';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <VehicleProvider>
        <Router>
          <Helmet>
            <title>FindMyLostCar - แจ้งรถหาย</title>
            <meta name="description" content="แอปพลิเคชันสำหรับแจ้งและค้นหารถหาย ช่วยกันเป็นหูเป็นตาเพื่อสังคม" />
          </Helmet>
          <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfUsePage />} />
                <Route path="/delete-data" element={<PrivacyRemovalPolicyPage />} />
                <Route path="/vehicles" element={<ListPage />} />
                <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/report" element={<PrivateRoute><ReportPage /></PrivateRoute>} />
                <Route path="/lost-car/:id/edit" element={<PrivateRoute><EditReportPage /></PrivateRoute>} />

                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/profile/edit" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />     
                <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                <Route path="/admin/login" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                <Route path="/admin/vehicles" element={<AdminRoute><ListPage isAdmin={true} /></AdminRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
          </div>
        </Router>
      </VehicleProvider>
    </AuthProvider>
  );
}

export default App;