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
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Badge
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Small label used to highlight an item or status.
      </Text>
      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Variants
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
