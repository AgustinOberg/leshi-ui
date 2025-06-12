import { useColorScheme } from 'react-native';
import { themes } from './tm';
import type { Theme } from './tm';

export { themes } from './tm';
export type { Theme } from './tm';

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? themes.dark : themes.light;
}
