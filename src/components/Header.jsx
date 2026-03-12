import { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SearchBox from "./SearchBox";
import logo from "../assets/logo.png";

const Header = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadState = () => {
      const storedUserInfo = localStorage.getItem("userInfo");
      const storedCart = localStorage.getItem("cart");
      
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
      if (storedCart) {
        const cartData = JSON.parse(storedCart);
        setCartItems(cartData.cartItems || []);
      }
    };

    loadState();
    window.addEventListener("storage", loadState);
    return () => window.removeEventListener("storage", loadState);
  }, []);

  const navigateToRoute = (path) => {
    // Rotas MFE usam React Router da Shell
    if (
        ['/user/login', '/user/register', '/user/profile', '/'].includes(path) ||
        path.startsWith('/catalog/') ||
        path.startsWith('/user/') ||
        path.startsWith('/orders/') ||
        path.startsWith('/admin/')
      ) {
      navigate(path);
    } else {
      // Outras rotas v�o para o iframe
      const iframe = document.querySelector('iframe[title="ProShop Content"]');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "navigate", path }, "http://localhost:3001");
      }
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cart");
    setUserInfo(null);
    setCartItems([]);
    navigate("/user/login");
  };

  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand onClick={() => navigateToRoute("/")} style={{ cursor: "pointer" }}>
            <img src={logo} alt="ProShop" style={{ marginRight: "10px" }} />
            ProShop
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <SearchBox onSearch={(keyword) => navigateToRoute(`/catalog/search/${keyword}`)} />
              <Nav.Link onClick={() => navigateToRoute("/orders/cart")}>
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
                    <NavDropdown.Item onClick={() => navigateToRoute("/user/profile")}>
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <Nav.Link onClick={() => navigateToRoute("/user/login")}>
                  <FaUser /> Sign In
                </Nav.Link>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <NavDropdown.Item onClick={() => navigateToRoute("/admin/productlist")}>
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigateToRoute("/admin/orderlist")}>
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigateToRoute("/admin/userlist")}>
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
