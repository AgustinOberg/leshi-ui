import { ScrollView } from "react-native";
import { TextInput, Text } from "@leshi/ui-rn";
import { useState } from "react";

const sizes: any[] = ["sm", "base", "lg", "xl"];

export default function TextInputScreen() {
  const [value, setValue] = useState("");
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        TextInput
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Captures user input via the keyboard.
      </Text>
      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Sizes
      </Text>
      {sizes.map((size) => (
        <TextInput
          key={size}
          size={size}
          placeholder={`Size ${size}`}
          value={value}
          onChangeText={setValue}
          style={{ marginBottom: 12 }}
        />
      ))}
    </ScrollView>
  );
}
