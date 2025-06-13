import { dark } from "./dark";
import { light } from "./light";
import { spotify } from "./spotify";

export const themes = {
  light,
  dark,
  spotify,
};
export type ThemeName = keyof typeof themes;
