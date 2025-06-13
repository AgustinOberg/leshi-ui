import { ScrollView } from "react-native";
import { Badge, Text } from "@leshi/ui-rn";

const variants: any[] = [
  "primary",
  "secondary",
  "destructive",
  "outline",
];

export default function BadgeScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 12 }}>
        Badge Variants
      </Text>
      {variants.map((v) => (
        <Badge
          key={v}
          variant={v}
          textOptions={{ style: { textTransform: "capitalize" } }}
          style={{ marginBottom: 8 }}
        >
          {v}
        </Badge>
      ))}
    </ScrollView>
  );
}
