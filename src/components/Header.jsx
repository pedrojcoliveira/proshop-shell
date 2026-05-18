import { useState, useEffect, lazy, Suspense } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SearchBox from "./SearchBox";
import logo from "../assets/logo.png";

const WishlistBadge = lazy(() =>
  import('mfeWishlist/WishlistBadge').catch(() => ({ default: () => null }))
);

const CartBadge = lazy(() =>
  import('mfeOrders/CartBadge').catch(() => ({ default: () => null }))
);

const Header = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [stockAlert, setStockAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) setUserInfo(JSON.parse(storedUserInfo));

    // Custom Event userChanged — mfe-auth notifica após login/logout
    const handleUserChanged = (e) => setUserInfo(e.detail.userInfo);
    window.addEventListener("userChanged", handleUserChanged);

    // Event Bus stockEmpty — mfe-catalog notifica quando produto esgota
    const handleStockEmpty = (e) => {
      setStockAlert(`"${e.detail.productName}" está esgotado`);
      setTimeout(() => setStockAlert(null), 5000);
    };
    if (window.__eventBus) window.__eventBus.subscribe('stockEmpty', handleStockEmpty);

    return () => {
      window.removeEventListener("userChanged", handleUserChanged);
      if (window.__eventBus) window.__eventBus.unsubscribe('stockEmpty', handleStockEmpty);
    };
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cart");
    setUserInfo(null);
    navigate("/user/login");
  };

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
              {userInfo && (
                <Nav.Link onClick={() => navigate("/wishlist")}>
                  <Suspense fallback={null}>
                    <WishlistBadge />
                  </Suspense>
                </Nav.Link>
              )}
              <Nav.Link onClick={() => navigate("/orders/cart")}>
                <Suspense fallback={null}>
                  <CartBadge />
                </Suspense>
              </Nav.Link>
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id="username">
                    <NavDropdown.Item onClick={() => navigate("/user/profile")}>
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <Nav.Link onClick={() => navigate("/user/login")}>
                  <FaUser /> Sign In
                </Nav.Link>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <NavDropdown.Item onClick={() => navigate("/admin/productlist")}>
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate("/admin/orderlist")}>
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate("/admin/userlist")}>
                    Users
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
