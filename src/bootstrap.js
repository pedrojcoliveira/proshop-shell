import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";

// Lazy load mfe-auth and profile
const UserManagement = lazy(() => import("mfeAuth/UserManagementApp"));

// Lazy load mfe-support
const HelpCenter = lazy(() => import("mfeSupport/HelpCenter"));

// Lazy load mfe-catalog and product
const HomeCatalog = lazy(() => import("mfeCatalog/HomeScreen"));

// Lazy load mfe-orders
const OrdersApp = lazy(() => import("mfeOrders/OrdersApp"));

// Lazy load mfe-admin
const AdminApp = lazy(() => import("mfeAdmin/AdminApp"));

// Lazy load mfe-wishlist
const WishlistApp = lazy(() => import("mfeWishlist/WishlistApp"));

const AppContent = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <main className="py-3" style={{ flex: 1 }}>
        <Container>
          <Routes>
            <Route path="/" element={<Navigate to="/catalog" replace />} />
            <Route path="/user/*" element={<Suspense fallback={<Loader />}><UserManagement /></Suspense>} />
            <Route path="/catalog/*" element={<Suspense fallback={<Loader />}><HomeCatalog /></Suspense>} />
            <Route path="/orders/*" element={<Suspense fallback={<Loader />}><OrdersApp /></Suspense>} />
            <Route path="/admin/*" element={<Suspense fallback={<Loader />}><AdminApp /></Suspense>} />
            <Route path="/wishlist/*" element={<Suspense fallback={<Loader />}><WishlistApp /></Suspense>} />
            <Route path="/help/*" element={<Suspense fallback={<Loader />}><HelpCenter /></Suspense>} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HelmetProvider>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<StrictMode><App /></StrictMode>);
