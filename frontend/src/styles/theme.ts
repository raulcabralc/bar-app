import * as color from "./colors";

export const lightTheme = {
  background: color.white.default,
  surface: color.white.light,
  edge: color.white.dark,
  text: color.black.default,
  primary: color.rebound.default,

  // Sidebar

  sidebarBackground: color.white.light,
  sidebarEdge: color.white.dark,
  sidebarCategory: color.white.darker,
};

export const darkTheme = {
  background: color.black.default,
  surface: color.black.light,
  edge: color.black.dark,
  text: color.white.default,
  primary: color.rebound.default,

  // Sidebar

  sidebarBackground: color.black.dark,
  sidebarEdge: color.black.light,
  sidebarCategory: color.black.lighter,
};
