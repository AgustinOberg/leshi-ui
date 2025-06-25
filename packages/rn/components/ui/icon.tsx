import { Text } from "./text";

export type IconName = "checkbox" | "x";
export interface IconProps {
  name: IconName;
  color?: string;
  size?: number;
}
export const Icon = ({ name, color, size }: IconProps) => {
  if (name === "checkbox")
    return <Text style={{ color, fontSize: size }}>✓</Text>;
  if (name === "x") return <Text style={{ color, fontSize: size }}>X</Text>;
};
