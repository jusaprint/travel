import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import PackageList from './packages/PackageList';
import PackageForm from './packages/PackageForm';
import ComboPackages from './packages/ComboPackages';
import CountryList from './countries/CountryList';
import CountryForm from './countries/CountryForm';
import LocalCountries from './countries/LocalCountries';
import RegionsManager from './countries/RegionsManager';
import DestinationList from './destinations/DestinationList';
import DestinationForm from './destinations/DestinationForm';
import MediaLibrary from './media/MediaLibrary';
import MediaUpload from './media/MediaUpload';
import MediaManager from './media/MediaManager';
import OperatorLogoUpload from './media/OperatorLogoUpload';
import PageList from './pages/PageList';
import PageForm from './pages/PageForm';
import TranslationManager from './translations/TranslationManager';
import Settings from './settings/Settings';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import UserProfile from './auth/UserProfile';
import UserManagement from './users/UserManagement';
import PressManager from './press/PressManager';
import ReviewManager from './reviews/ReviewManager';
import ReviewAnalytics from './reviews/ReviewAnalytics';
import ReviewSettings from './reviews/ReviewSettings';
import VideoStoryManager from './reviews/VideoStoryManager';
import SEOManager from './seo/SEOManager';
import HeroManager from './hero/HeroManager';
import MenuManager from './menu/MenuManager';
import AppDownloadManager from './app-download/AppDownloadManager';
import PopupManager from './popup/PopupManager';
import FAQManager from './faq/FAQManager';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

export default function AdminRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="hero" element={<HeroManager />} />
          <Route path="app-download" element={<AppDownloadManager />} />
          <Route path="popup" element={<PopupManager />} />
          <Route path="packages" element={<PackageList />} />
          <Route path="packages/combo" element={<ComboPackages />} />
          <Route path="packages/:id" element={<PackageForm />} />
          <Route path="countries" element={<CountryList />} />
          <Route path="countries/local" element={<LocalCountries />} />
          <Route path="countries/regions" element={<RegionsManager />} />
          <Route path="countries/:id" element={<CountryForm />} />
          <Route path="destinations" element={<DestinationList />} />
          <Route path="destinations/:id" element={<DestinationForm />} />
          <Route path="media" element={<MediaManager />} />
          <Route path="media/library" element={<MediaLibrary />} />
          <Route path="media/upload" element={<MediaUpload />} />
          <Route path="media/operator-logos" element={<OperatorLogoUpload />} />
          <Route path="pages" element={<PageList />} />
          <Route path="pages/:id" element={<PageForm />} />
          <Route path="translations" element={<TranslationManager />} />
          <Route path="press" element={<PressManager />} />
          <Route path="reviews" element={<ReviewManager />} />
          <Route path="reviews/analytics" element={<ReviewAnalytics />} />
          <Route path="reviews/settings" element={<ReviewSettings />} />
          <Route path="reviews/video-stories" element={<VideoStoryManager />} />
          <Route path="seo" element={<SEOManager />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="menu" element={<MenuManager />} />
          <Route path="faq" element={<FAQManager />} />
          <Route path="users" element={
            <ProtectedRoute requireAdmin={true}>
              <UserManagement />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}