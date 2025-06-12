import { ActivityIndicator } from "react-native";
import { useTheme } from "../theme/native";

interface Props {
  size?: "large" | "small" | number;
  color?: string;
}
const Spinner = ({ size = "large", color }: Props) => {
  const theme = useTheme();
  return <ActivityIndicator size={size} color={color ?? theme.colors.accent} />;
};

export default Spinner;
