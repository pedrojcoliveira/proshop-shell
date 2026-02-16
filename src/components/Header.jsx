import { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import SearchBox from "./SearchBox";
import logo from "../assets/logo.png";

const Header = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Ler estado do localStorage (sincronizado com monolith)
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

    // Escutar mudanças no localStorage
    window.addEventListener("storage", loadState);
    return () => window.removeEventListener("storage", loadState);
  }, []);

  const navigateMonolith = (path) => {
    const iframe = document.querySelector('iframe[title="ProShop Content"]');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: "navigate", path }, "http://localhost:3001");
    }
  };

  const logoutHandler = () => {
    // Limpar localStorage
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cart");
    setUserInfo(null);
    setCartItems([]);
    navigateMonolith("/login");
  };

  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand onClick={() => navigateMonolith("/")} style={{ cursor: "pointer" }}>
            <img src={logo} alt="ProShop" />
            ProShop
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <SearchBox onSearch={(keyword) => navigateMonolith(`/search/${keyword}`)} />
              <Nav.Link onClick={() => navigateMonolith("/cart")}>
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
                    <NavDropdown.Item onClick={() => navigateMonolith("/profile")}>
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <Nav.Link onClick={() => navigateMonolith("/login")}>
                  <FaUser /> Sign In
                </Nav.Link>
              )}

              {/* Admin Links */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <NavDropdown.Item onClick={() => navigateMonolith("/admin/productlist")}>
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigateMonolith("/admin/orderlist")}>
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigateMonolith("/admin/userlist")}>
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
