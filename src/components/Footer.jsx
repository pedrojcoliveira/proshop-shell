import { lazy, Suspense } from "react";
import { Container, Row, Col } from "react-bootstrap";

const HelpCenterLink = lazy(() =>
  import('mfeSupport/HelpCenterLink').catch(() => ({ default: () => null }))
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p>
              ProShop &copy; {currentYear} |
              <Suspense fallback={null}>
                <HelpCenterLink />
              </Suspense>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
