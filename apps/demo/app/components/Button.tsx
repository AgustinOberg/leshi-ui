import { ScrollView, View } from "react-native";
import { Button, Text } from "@leshi/ui-rn";

const variants: any[] = [
  { text: "Primary", variant: "primary" },
  { text: "Secondary", variant: "secondary" },
  { text: "Destructive", variant: "destructive" },
  { text: "Outline", variant: "outline" },
  { text: "Ghost", variant: "ghost" },
];

const sizes: any[] = [
  { text: "Small", size: "sm" },
  { text: "Base", size: "base" },
  { text: "Large", size: "lg" },
  { text: "Icon", size: "icon" },
];

export default function ButtonScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 12 }}>
        Button Variants
      </Text>
      {variants.map((v) => (
        <Button
          key={v.variant}
          text={v.text}
          variant={v.variant}
          style={{ marginBottom: 8 }}
        />
      ))}
      <Text weight="bold" size="xl" style={{ marginVertical: 12 }}>
        Button Sizes
      </Text>
      {sizes.map((s) => (
        <Button
          key={s.size}
          text={s.text}
          size={s.size}
          style={{ marginBottom: 8 }}
        />
      ))}
    </ScrollView>
  );
}
