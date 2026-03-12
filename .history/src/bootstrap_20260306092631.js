import { StrictMode, lazy, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import store from "./store";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MonolithFrame from "./components/MonolithFrame";
import Loader from "./components/Loader";
import PrivateRoute from "./components/PrivateRoute";
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";

// Lazy load mfe-auth
const LoginScreen = lazy(() => import("mfeAuth/LoginScreen"));
const RegisterScreen = lazy(() => import("mfeAuth/RegisterScreen"));
const ProfileScreen = lazy(() => import("mfeAuth/ProfileScreen"));

// Lazy load mfe-support
const HelpCenter = lazy(() => import("mfeSupport/HelpCenter"));

// Lazy load mfe-catalog
const HomeScreen = lazy(() => import("mfeCatalog/HomeScreen"));
const ProductScreen = lazy(() => import("mfeCatalog/ProductScreen"));

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Escutar mensagens de navegação do iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== 'http://localhost:3001') return;
      
      if (event.data.type === 'NAVIGATE') {
        console.log('?? Shell recebeu pedido de navegação:', event.data.path);
        navigate(event.data.path);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);
  
  // Rotas geridas por MFEs - verificação explícita
  const isMFERoute =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/profile' ||
    location.pathname === '/help' ||
    
    location.pathname.startsWith('/product/') ||
    location.pathname.startsWith('/search/') ||
    location.pathname.startsWith('/page/');

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<Loader />}>
          {isMFERoute ? (
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/" element={<HomeScreen />} />
              <Route path="/search/:keyword" element={<HomeScreen />} />
              <Route path="/page/:pageNumber" element={<HomeScreen />} />
              <Route path="/search/:keyword/page/:pageNumber" element={<HomeScreen />} />
              <Route path="/product/:id" element={<ProductScreen />} />
              
              {/* Private routes */}
              <Route path="" element={<PrivateRoute />}>
                <Route path="/profile" element={<ProfileScreen />} />
              </Route>
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
