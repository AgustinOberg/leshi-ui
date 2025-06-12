import Text from "./text";

export type IconName = "checkbox";
export interface IconProps {
  name: IconName;
  color?: string;
}
export const Icon = ({ name, color }: IconProps) => {
  if (name === "checkbox") return <Text style={{ color }}>✓</Text>;
};
