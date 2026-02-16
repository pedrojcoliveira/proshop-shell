import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MonolithFrame from "./components/MonolithFrame";
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";

const App = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <main style={{ flexGrow: 1, overflow: "hidden" }}>
        <MonolithFrame />
      </main>
      <Footer />
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<StrictMode><App /></StrictMode>);
