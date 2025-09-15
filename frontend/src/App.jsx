import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AuthInitializer from "./components/AuthInitializer";
import SearchPage from "./pages/SearchPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import PostPage from "./pages/PostPage";
import FavoritesPage from "./pages/FavoritesPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardComp from "./components/dashboard/DashboardComp";
import DashPosts from "./components/dashboard/DashPosts";
import CreatePostPage from "./pages/CreatePostPage";
import DashUsers from "./components/dashboard/DashUsers";
import DashCategories from "./components/dashboard/DashCategories";
import useRecaptchaBadgeRemoval from "./hooks/useRecaptchaBadgeRemoval";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import SettingsPage from "./pages/SettingsPage";
import DashSettings from "./components/dashboard/DashSettings";
import PostsPage from "./pages/PostsPage";
import SupportPage from "./pages/SupportPage";
import ServiceMaintenance from "./pages/ServiceMaintenancePage";
import UpdatePostPage from "./pages/UpdatePostPage";
import ExplorePage from "./pages/ExplorePage";
import LegalPages from "./pages/LegalPages";

const RecaptchaBadgeRemovalWrapper = () => {
  useRecaptchaBadgeRemoval();
  return null;
};

const App = () => {
  return (
    <Router>
      <RecaptchaBadgeRemovalWrapper />
      <AuthInitializer />
      <Routes>
        {/* Public and user routes with UserLayout */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/posts/:postSlug" element={<PostPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/users/:username" element={<ProfilePage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route
            path="/maintenance"
            element={
              <ServiceMaintenance
                message="We're upgrading our systems for better performance!"
                showSocialLinks={true}
              />
            }
          />
          <Route path="/legal" element={<LegalPages />} />

          {/* Protected Routes - Only accessible to logged-in users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/update-post/:postSlug" element={<UpdatePostPage />} />
          </Route>

          {/* Auth routes - only accessible when NOT logged in */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route
              path="/verify-email/:token"
              element={<EmailVerificationPage />}
            />
          </Route>
        </Route>

        {/* Dashboard routes with AdminLayout */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<AdminLayout />}>
            {/* Admin-only routes */}
            <Route element={<AdminPrivateRoute />}>
              <Route index element={<DashboardComp />} />
              <Route path="posts" element={<DashPosts />} />
              <Route path="users" element={<DashUsers />} />
              <Route path="categories" element={<DashCategories />} />
              <Route path="settings" element={<DashSettings />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
