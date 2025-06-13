export { fonts, shadows, sizes, radii } from "./common";
import { light } from "./light";
import { dark } from "./dark";
import { spotify } from "./spotify";
export { light, dark, spotify };

export const themes = { light, dark, spotify } as const;
export type ThemeName = keyof typeof themes;
