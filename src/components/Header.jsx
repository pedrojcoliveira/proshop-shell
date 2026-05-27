import { useState, useEffect, lazy, Suspense } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SearchBox from "./SearchBox";
import logo from "../assets/logo.png";

const WishlistBadge = lazy(() =>
  import('mfeWishlist/WishlistBadge').catch(() => ({ default: () => null }))
);

const CartBadge = lazy(() =>
  import('mfeOrders/CartBadge').catch(() => ({ default: () => null }))
);

const UserMenu = lazy(() =>
  import('mfeAuth/UserMenu').catch(() => ({ default: () => null }))
);

const AdminMenu = lazy(() =>
  import('mfeAdmin/AdminMenu').catch(() => ({ default: () => null }))
);

const Header = () => {
  const [stockAlert, setStockAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Event Bus stockEmpty — mfe-catalog notifica quando produto esgota
    const handleStockEmpty = (e) => {
      setStockAlert(`"${e.detail.productName}" está esgotado`);
      setTimeout(() => setStockAlert(null), 5000);
    };
    if (window.__eventBus) window.__eventBus.subscribe('stockEmpty', handleStockEmpty);

    return () => {
      if (window.__eventBus) window.__eventBus.unsubscribe('stockEmpty', handleStockEmpty);
    };
  }, []);

  return (
    <header>
      {stockAlert && (
        <div style={{
          backgroundColor: '#fff3cd',
          borderBottom: '1px solid #ffc107',
          padding: '8px 16px',
          textAlign: 'center',
          fontSize: '0.9rem',
        }}>
          ⚠️ {stockAlert}
        </div>
      )}
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <img src={logo} alt="ProShop" style={{ marginRight: "10px" }} />
            ProShop
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <SearchBox onSearch={(keyword) => navigate(`/catalog/search/${keyword}`)} />
              <Nav.Link onClick={() => navigate("/wishlist")}>
                <Suspense fallback={null}>
                  <WishlistBadge />
                </Suspense>
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/orders/cart")}>
                <Suspense fallback={null}>
                  <CartBadge />
                </Suspense>
              </Nav.Link>
              <Suspense fallback={null}>
                <UserMenu />
              </Suspense>
              <Suspense fallback={null}>
                <AdminMenu />
              </Suspense>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
