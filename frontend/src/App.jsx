import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Dashborad from "./pages/DashboradPage";
import Header from "./components/Header";
import Footer from "./components/FooterComponent";
import PrivateRoute from "./components/PrivateRoute";
import NotFoundPage from "./pages/NotFoundPage";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePostPage from "./pages/CreatePostPage";
import UpdatePostPage from "./pages/UpdatePostPage";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import SearchPage from "./pages/SearchPage";
import ToastComponent from "./components/ToastComponent";
import FavoritesPage from "./pages/FavoritesPage";
import AutoScrollToTop from "./components/AutoScrollToTop";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import useRecaptchaBadgeRemoval from "./hooks/useRecaptchaBadgeRemoval";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";

// Separate component to use the useRecaptchaBadgeRemoval hook
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
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route
          path="/verify-email/:token"
          element={<EmailVerificationPage />}
        />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashborad />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/update-post/:postId" element={<UpdatePostPage />} />
        </Route>

        <Route path="/post/:postSlug" element={<PostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ScrollToTop />
      <AutoScrollToTop />
      <Footer />
    </Router>
  );
};

export default App;
