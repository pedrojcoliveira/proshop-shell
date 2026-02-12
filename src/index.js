import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <main style={{ flex: 1 }}>
        <h1>ProShop Shell</h1>
      </main>
      <Footer />
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<StrictMode><App /></StrictMode>);
