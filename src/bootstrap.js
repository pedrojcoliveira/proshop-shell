import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MonolithFrame from "./components/MonolithFrame";
import Loader from "./components/Loader";
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";

// Lazy load mfe-auth
const LoginScreen = lazy(() => import("mfeAuth/LoginScreen"));
const RegisterScreen = lazy(() => import("mfeAuth/RegisterScreen"));
const ProfileScreen = lazy(() => import("mfeAuth/ProfileScreen"));

// Lazy load mfe-support
const HelpCenter = lazy(() => import("mfeSupport/HelpCenter"));
const ContactUs = lazy(() => import("mfeSupport/ContactUs"));

const AppContent = () => {
  const location = useLocation();
  
  // Rotas geridas por MFEs
  const mfeRoutes = ['/login', '/register', '/profile', '/help', '/contact'];
  const isMFERoute = mfeRoutes.includes(location.pathname);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <main style={{ 
        flexGrow: 1, 
        overflow: isMFERoute ? "auto" : "hidden" // Auto para MFEs, hidden para iframe
      }}>
        <Suspense fallback={<Loader />}>
          {isMFERoute ? (
            <Routes>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/contact" element={<ContactUs />} />
            </Routes>
          ) : (
            <MonolithFrame />
          )}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<StrictMode><App /></StrictMode>);
