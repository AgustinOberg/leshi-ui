import { ScrollView } from "react-native";
import { Text } from "@leshi/ui-rn";

const sizes: any[] = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"];
const variants: any[] = [
  "foreground",
  "primary",
  "primaryForeground",
  "secondary",
  "secondaryForeground",
  "destructive",
  "destructiveForeground",
  "mutedForeground",
];

export default function TextScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 12 }}>
        Text Variants
      </Text>
      {variants.map((v) => (
        <Text key={v} color={v} style={{ marginBottom: 8 }}>
          {v}
        </Text>
      ))}
      <Text weight="bold" size="xl" style={{ marginVertical: 12 }}>
        Text Sizes
      </Text>
      {sizes.map((s) => (
        <Text key={s} size={s} style={{ marginBottom: 8 }}>
          Size {s}
        </Text>
      ))}
    </ScrollView>
  );
}
