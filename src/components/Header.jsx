import { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { FaShoppingCart, FaUser, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SearchBox from "./SearchBox";
import logo from "../assets/logo.png";

const Header = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [stockAlert, setStockAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadState = () => {
      const storedUserInfo = localStorage.getItem("userInfo");
      const storedCart = localStorage.getItem("cart");
      if (storedUserInfo) setUserInfo(JSON.parse(storedUserInfo));
      if (storedCart) setCartItems(JSON.parse(storedCart).cartItems || []);
    };

    const handleUserChanged = (e) => {
      setUserInfo(e.detail.userInfo);
    };

    const handleWishlistUpdated = (e) => {
      setWishlistCount(e.detail.count);
    };

    // Header subscreve o Event Bus para notificações de stock
    const handleStockEmpty = (e) => {
      setStockAlert(`"${e.detail.productName}" está esgotado`);
      setTimeout(() => setStockAlert(null), 5000); // desaparece após 5 segundos
    };

    loadState();
    setWishlistCount(JSON.parse(localStorage.getItem('wishlist') || '[]').length);
    window.addEventListener("userChanged", handleUserChanged);
    window.addEventListener("wishlistUpdated", handleWishlistUpdated);
    if (window.__eventBus) window.__eventBus.subscribe('stockEmpty', handleStockEmpty);
    return () => {
      window.removeEventListener("userChanged", handleUserChanged);
      window.removeEventListener("wishlistUpdated", handleWishlistUpdated);
      if (window.__eventBus) window.__eventBus.unsubscribe('stockEmpty', handleStockEmpty);
    };
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cart");
    setUserInfo(null);
    setCartItems([]);
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
                  <FaHeart /> Wishlist
                  {wishlistCount > 0 && (
                    <Badge pill bg="danger" style={{ marginLeft: "5px" }}>
                      {wishlistCount}
                    </Badge>
                  )}
                </Nav.Link>
              )}
              <Nav.Link onClick={() => navigate("/orders/cart")}>
                <FaShoppingCart /> Cart
                {cartItems.length > 0 && (
                  <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </Badge>
                )}
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
