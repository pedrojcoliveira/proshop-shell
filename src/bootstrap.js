import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
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

// Lazy load mfe-catalog
const HomeScreen = lazy(() => import("mfeCatalog/HomeScreen"));
const ProductScreen = lazy(() => import("mfeCatalog/ProductScreen"));

const AppContent = () => {
  const location = useLocation();
  
  // Rotas geridas por MFEs
  const mfeRoutes = [
    '/login', '/register', '/profile',
    '/help', '/contact',
    '/', '/product', '/search', '/page'
  ];
  
  const isMFERoute = mfeRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<Loader />}>
          {isMFERoute ? (
            <Routes>
              {/* Auth */}
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              
              {/* Support */}
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/contact" element={<ContactUs />} />
              
              {/* Catalog */}
              <Route path="/" element={<HomeScreen />} />
              <Route path="/search/:keyword" element={<HomeScreen />} />
              <Route path="/page/:pageNumber" element={<HomeScreen />} />
              <Route path="/search/:keyword/page/:pageNumber" element={<HomeScreen />} />
              <Route path="/product/:id" element={<ProductScreen />} />
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
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<StrictMode><App /></StrictMode>);
