import { Route, Routes } from "react-router-dom";
import { SidebarRespect } from "./styles/global";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Team from "./pages/Team";
import Menu from "./pages/Menu";
import Analysis from "./pages/Analysis";

function Router() {
  return (
    <>
      <Sidebar />
      <SidebarRespect>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Team />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/analysis" element={<Analysis />} />
        </Routes>
      </SidebarRespect>
    </>
  );
}

export default Router;
