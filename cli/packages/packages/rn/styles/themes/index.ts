import { dark } from "./dark";
import { light } from "./light";
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
import { t3ChatLight } from "./t3-chat-light";
import { t3ChatDark } from "./t3-chat-dark";
import { twitterLight } from "./twitter-light";
import { twitterDark } from "./twitter-dark";
import { mochaMousseLight } from "./mocha-mousse-light";
import { mochaMousseDark } from "./mocha-mousse-dark";
import { amethystHazeLight } from "./amethyst-haze-light";
import { amethystHazeDark } from "./amethyst-haze-dark";
import { supabaseLight } from "./supabase-light";
import { supabaseDark } from "./supabase-dark";

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
  t3ChatLight,
  t3ChatDark,
  twitterLight,
  twitterDark,
  mochaMousseLight,
  mochaMousseDark,
  amethystHazeLight,
  amethystHazeDark,
  supabaseLight,
  supabaseDark,
};
export type ThemeName = keyof typeof themes;
