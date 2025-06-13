import { ScrollView, View } from "react-native";
import { Checkbox, Text } from "@leshi/ui-rn";
import { useState } from "react";

const sizes: any[] = ["sm", "md", "lg"];

export default function CheckboxScreen() {
  const [checked, setChecked] = useState(false);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 12 }}>
        Checkbox Sizes
      </Text>
      {sizes.map((size) => (
        <View key={size} style={{ marginBottom: 12 }}>
          <Text style={{ marginBottom: 4 }}>Size {size}</Text>
          <Checkbox
            size={size}
            checked={checked}
            onPress={() => setChecked((c) => !c)}
          />
        </View>
      ))}
    </ScrollView>
  );
}
