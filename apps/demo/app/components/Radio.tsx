import { ScrollView, View } from "react-native";
import { RadioGroup, RadioGroupItem, Text } from "@leshi/ui-rn";
import { useState } from "react";

const sizes: any[] = ["sm", "md", "lg"];

export default function RadioScreen() {
  const [value, setValue] = useState("option-1");
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Radio
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Allows the selection of a single option.
      </Text>
      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Sizes
      </Text>
      {sizes.map((size) => (
        <View key={size} style={{ marginBottom: 12 }}>
          <Text style={{ marginBottom: 4 }}>Size {size}</Text>
          <RadioGroup
            value={value}
            onValueChange={setValue}
            style={{ flexDirection: "row", gap: 8 }}
          >
            <RadioGroupItem size={size} value={`option-1`} />
            <RadioGroupItem size={size} value={`option-2`} />
            <RadioGroupItem size={size} value={`option-3`} />
          </RadioGroup>
        </View>
      ))}
    </ScrollView>
  );
}


