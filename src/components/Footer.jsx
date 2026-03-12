import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p>
              ProShop &copy; {currentYear} |
              <span
                onClick={() => navigate("/help")}
                style={{ marginLeft: "10px", cursor: "pointer", textDecoration: "underline" }}
              >
                Help Center
              </span>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
