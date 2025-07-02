import { ActivityIndicator } from 'react-native';
import { useTheme } from '../../styles/context';

interface SpinnerProps {
  size?: 'large' | 'small' | number;
  color?: string;
}

export const Spinner = ({ size = 'large', color }: SpinnerProps) => {
  const theme = useTheme();
  return (
    <ActivityIndicator
      size={size}
      color={color ?? theme.colors.accent}
    />
  );
};
