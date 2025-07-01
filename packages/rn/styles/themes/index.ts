import { dark } from './dark';
import { light } from './light';

export const themes = {
  light,
  dark,
};
export type ThemeName = keyof typeof themes;
