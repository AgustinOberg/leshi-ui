import { Text } from "./text";

export type IconName = "checkbox" | "x" | "minus";
export interface IconProps {
  name: IconName;
  color?: string;
  size?: number;
}
export const Icon = ({ name, color, size }: IconProps) => {
  if (name === "checkbox")
    return <Text style={{ color, fontSize: size }}>✓</Text>;
  if (name === "x") return <Text style={{ color, fontSize: size }}>✕</Text>;
  if (name === "minus") return <Text style={{ color, fontSize: size }}>−</Text>;
  
  // Fallback for unknown icon names
  return <Text style={{ color, fontSize: size }}>?</Text>;
};
