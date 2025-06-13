import { ScrollView, View } from "react-native";
import { Progress, Text, Button } from "@leshi/ui-rn";
import { useState } from "react";

const variants: any[] = ["primary", "secondary", "destructive"];
const sizes: any[] = ["sm", "md", "lg"];

export default function ProgressScreen() {
  const [value, setValue] = useState(40);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Progress
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Shows completion percentage of an ongoing task.
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Button text="-" size="icon" onPress={() => setValue((v) => Math.max(0, v - 10))} style={{ marginRight: 8 }} />
        <Progress value={value} style={{ flex: 1 }} />
        <Button text="+" size="icon" onPress={() => setValue((v) => Math.min(100, v + 10))} style={{ marginLeft: 8 }} />
      </View>
      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Variants
      </Text>
      {variants.map((v) => (
        <Progress key={v} value={50} variant={v} style={{ marginBottom: 12 }} />
      ))}
      <Text weight="bold" size="lg" style={{ marginVertical: 12 }}>
        Sizes
      </Text>
      {sizes.map((s) => (
        <Progress key={s} value={50} size={s} style={{ marginBottom: 12 }} />
      ))}
    </ScrollView>
  );
}
