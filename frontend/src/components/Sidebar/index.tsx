import {
  LogoImage,
  NavItem,
  SidebarCategory,
  SidebarContainer,
  SidebarContent,
  SidebarFooter,
  SidebarLogo,
  Switch,
  ThemeToggleArea,
  UserCard,
  UserImage,
} from "./styled";

import { useTheme } from "../../contexts/ThemeContext";

import logo from "../../assets/logo.png";
import { useState } from "react";

function Sidebar() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();

  const userMock = {
    fullName: "Raul Cabral Caxeta",
    displayName: "Raul Cabral",
    avatar: "https://github.com/raulcabralc.png",
    email: "raulcabralc@gmail.com",
    role: "admin",
    hireDate: "2022-01-01",
  };

  return (
    <SidebarContainer>
      <SidebarLogo>
        <LogoImage src={logo} alt="Logo" />
        <span>TAB</span>
      </SidebarLogo>

      <SidebarContent>
        <SidebarCategory>Operação</SidebarCategory>
        <NavItem to="/">Dashboard</NavItem>
        <NavItem to="/orders">Pedidos</NavItem>
        <SidebarCategory>Gestão</SidebarCategory>
        <NavItem to="/team">Equipe</NavItem>
        <NavItem to="/menu">Cardápio</NavItem>
        <SidebarCategory>Estratégia</SidebarCategory>
        <NavItem to="/analysis">Análise</NavItem>
      </SidebarContent>

      <ThemeToggleArea>
        <span>Modo Escuro</span>
        <Switch>
          <input
            type="checkbox"
            onChange={toggleTheme}
            checked={theme === "dark"}
          />
          <span />
        </Switch>
      </ThemeToggleArea>

      <SidebarFooter>
        <UserCard onClick={() => setIsProfileModalOpen(true)}>
          {userMock.avatar ? (
            <UserImage src={userMock.avatar} />
          ) : (
            <UserImage alt={userMock.displayName.split("")[0].toUpperCase()} />
          )}
          <span>{userMock.displayName}</span>
        </UserCard>
      </SidebarFooter>

      {isProfileModalOpen && (
        <UserModal onClose={() => setIsProfileModalOpen(false)} />
      )}
    </SidebarContainer>
  );
}

export default Sidebar;
