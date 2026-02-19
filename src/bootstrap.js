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

// Lazy load dos screens remotos do mfe-auth
const LoginScreen = lazy(() => import("mfeAuth/LoginScreen"));
const RegisterScreen = lazy(() => import("mfeAuth/RegisterScreen"));
const ProfileScreen = lazy(() => import("mfeAuth/ProfileScreen"));

const AppContent = () => {
  const location = useLocation();
  
  // Rotas que são geridas por MFEs
  const isMFERoute = ['/login', '/register', '/profile'].includes(location.pathname);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <main style={{ flexGrow: 1, overflow: "hidden" }}>
        <Suspense fallback={<Loader />}>
          {isMFERoute ? (
            <Routes>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
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
