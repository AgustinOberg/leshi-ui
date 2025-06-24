export { fonts, shadows, sizes, radii } from "./common";
import { light } from "./light";
import { dark } from "./dark";
import { grapeLight } from "./grape-light";
import { grapeDark } from "./grape-dark";
import { peachLight } from "./peach-light";
import { peachDark } from "./peach-dark";
import { retroLight } from "./retro-light";
import { retroDark } from "./retro-dark";
import { monoLight } from "./mono-light";
import { monoDark } from "./mono-dark";
import { lavenderLight } from "./lavender-light";
import { lavenderDark } from "./lavender-dark";
import { oceanLight } from "./ocean-light";
import { oceanDark } from "./ocean-dark";
import { bubblegumLight } from "./bubblegum-light";
import { bubblegumDark } from "./bubblegum-dark";
export {
  light,
  dark,
  grapeLight,
  grapeDark,
  peachLight,
  peachDark,
  retroLight,
  retroDark,
  monoLight,
  monoDark,
  lavenderLight,
  lavenderDark,
  oceanLight,
  oceanDark,
  bubblegumLight,
  bubblegumDark,
};

export const themes = {
  light,
  dark,
  grapeLight,
  grapeDark,
  peachLight,
  peachDark,
  retroLight,
  retroDark,
  monoLight,
  monoDark,
  lavenderLight,
  lavenderDark,
  oceanLight,
  oceanDark,
  bubblegumLight,
  bubblegumDark,
} as const;
export type ThemeName = keyof typeof themes;
