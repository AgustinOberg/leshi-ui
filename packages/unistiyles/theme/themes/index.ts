export { fonts, shadows, sizes, radii } from "./common";
import { light } from "./light";
import { dark } from "./dark";
export { light, dark };

export const themes = { light, dark } as const;
export type ThemeName = keyof typeof themes;
