import { ScrollView, View } from "react-native";
import { Switch, Text } from "@leshi/ui-rn";
import { useState } from "react";

const sizes: any[] = ["sm", "md", "lg"];

export default function SwitchScreen() {
  const [checked, setChecked] = useState(false);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Switch
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Used to toggle between two states.
      </Text>
      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Sizes
      </Text>
      {sizes.map((size) => (
        <View key={size} style={{ marginBottom: 12 }}>
          <Text style={{ marginBottom: 4 }}>Size {size}</Text>
          <Switch
            size={size}
            checked={checked}
            onCheckedChange={setChecked}
          />
        </View>
      ))}
    </ScrollView>
  );
}
