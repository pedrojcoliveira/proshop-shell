import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return <h1>ProShop Shell</h1>;
};

const root = createRoot(document.getElementById("root"));
root.render(<StrictMode><App /></StrictMode>);
