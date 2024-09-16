import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import HomePage from './pages/HomePage'
import AboutPage from "./pages/AboutPage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import Dashborad from "./pages/Dashborad"
import Header from "./components/Header"

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/sign-in' element={<SignInPage />} />
        <Route path='/sign-up' element={<SignUpPage />} />
        <Route path='/dashborad' element={<Dashborad />} />
      </Routes>
    </Router>
  )
}

export default App