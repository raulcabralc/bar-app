import "styled-components";
import { lightTheme } from "./theme";

type CustomTheme = typeof lightTheme;

declare module "styled-components" {
  export interface DefaultTheme extends CustomTheme {}
}
