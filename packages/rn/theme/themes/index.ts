import { dark } from "./dark";
import { light } from "./light";
import { grapeLight, grapeDark } from "./grape";
import { peachLight, peachDark } from "./peach";
import { retroLight, retroDark } from "./retro";
import { monoLight, monoDark } from "./mono";
import { lavenderLight, lavenderDark } from "./lavender";
import { oceanLight, oceanDark } from "./ocean";
import { bubblegumLight, bubblegumDark } from "./bubblegum";

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
};
export type ThemeName = keyof typeof themes;
