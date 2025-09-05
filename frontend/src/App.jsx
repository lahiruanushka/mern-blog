import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/DashboardPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import NotFoundPage from "./pages/NotFoundPage";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import SearchPage from "./pages/SearchPage";
import ToastComponent from "./components/ToastComponent";
import FavoritesPage from "./pages/FavoritesPage";
import AutoScrollToTop from "./components/AutoScrollToTop";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import DashProfile from "./components/DashProfile";
import DashboardComp from "./components/DashboardComp";
import DashPosts from "./components/DashPosts";
import DashCreatePost from "./components/DashCreatePost";
import DashUpdatePost from "./components/DashUpdatePost";
import DashUsers from "./components/DashUsers";
import DashComments from "./components/DashComments";
import DashCategories from "./components/DashCategories";
import useRecaptchaBadgeRemoval from "./hooks/useRecaptchaBadgeRemoval";

const RecaptchaBadgeRemovalWrapper = () => {
  useRecaptchaBadgeRemoval();
  return null;
};

const App = () => {
  return (
    <Router>
      <RecaptchaBadgeRemovalWrapper />
      <Header />
      <ToastComponent />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/search" element={<SearchPage />} />

        {/* Auth routes - only accessible when NOT logged in */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
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

        {/* Protected Routes - only accessible when logged in */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            {/* Non-admin routes */}
            <Route path="profile" element={<DashProfile />} />

            {/* Admin-only routes */}
            <Route element={<AdminPrivateRoute />}>
              <Route path="dash" element={<DashboardComp />} />
              <Route path="posts" element={<DashPosts />} />
              <Route path="create-post" element={<DashCreatePost />} />
              <Route path="update-post/:postId" element={<DashUpdatePost />} />
              <Route path="users" element={<DashUsers />} />
              <Route path="comments" element={<DashComments />} />
              <Route path="categories" element={<DashCategories />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ScrollToTop />
      <AutoScrollToTop />
      <Footer />
    </Router>
  );
};

export default App;
