import React from "react";
import ReactDOM from "react-dom/client";
import { GlobalStyle } from "./styles/global";
import Sidebar from "./components/Sidebar";
import { BrowserRouter } from "react-router-dom";
import { CustomThemeProvider } from "./contexts/ThemeContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomThemeProvider>
        <GlobalStyle />
        <Sidebar />
      </CustomThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
