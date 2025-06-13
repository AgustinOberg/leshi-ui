import { ScrollView, View } from "react-native";
import { Switch, Text } from "@leshi/ui-rn";
import { useState } from "react";

const sizes: any[] = ["sm", "md", "lg"];

export default function SwitchScreen() {
  const [checked, setChecked] = useState(false);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 12 }}>
        Switch Sizes
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
