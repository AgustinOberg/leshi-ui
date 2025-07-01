import { ScrollView, View } from "react-native";
import { Toggle, type ToggleVariant, type ToggleSize, Text } from "@leshi/ui-rn";
import { useState } from "react";

const variants: ToggleVariant[] = ["default", "outline"];
const sizes: ToggleSize[] = ["sm", "default", "lg"];

export default function ToggleScreen() {
  const [pressed, setPressed] = useState(false);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Toggle
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Small button that toggles between pressed and unpressed states.
      </Text>

      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Controlled Toggle
      </Text>
      <Toggle pressed={pressed} onPressedChange={setPressed} style={{ marginBottom: 16 }}>
        {pressed ? "On" : "Off"}
      </Toggle>

      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Variants
      </Text>
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
        {variants.map((v) => (
          <Toggle key={v} variant={v}>
            {v}
          </Toggle>
        ))}
      </View>

      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Sizes
      </Text>
      <View style={{ flexDirection: "row", gap: 12 }}>
        {sizes.map((s) => (
          <Toggle key={s} size={s}>
            {s}
          </Toggle>
        ))}
      </View>
    </ScrollView>
  );
}
