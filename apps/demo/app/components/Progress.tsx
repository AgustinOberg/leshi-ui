import { ScrollView } from "react-native";
import { Progress, Text } from "@leshi/ui-rn";

const variants: any[] = ["primary", "secondary", "destructive"];
const sizes: any[] = ["sm", "md", "lg"];

export default function ProgressScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 12 }}>
        Progress Variants
      </Text>
      {variants.map((v) => (
        <Progress key={v} value={50} variant={v} style={{ marginBottom: 12 }} />
      ))}
      <Text weight="bold" size="xl" style={{ marginVertical: 12 }}>
        Progress Sizes
      </Text>
      {sizes.map((s) => (
        <Progress key={s} value={50} size={s} style={{ marginBottom: 12 }} />
      ))}
    </ScrollView>
  );
}
