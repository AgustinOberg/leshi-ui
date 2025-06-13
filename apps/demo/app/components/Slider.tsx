import { ScrollView, View } from "react-native";
import { Slider, Text } from "@leshi/ui-rn";
import { useState } from "react";

const variants: any[] = ["primary", "secondary", "destructive"];
const sizes: any[] = ["sm", "md", "lg"];

export default function SliderScreen() {
  const [value, setValue] = useState(40);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Slider
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Allows selection of a value by sliding the thumb.
      </Text>
      <Slider
        value={value}
        onValueChange={setValue}
        style={{ marginBottom: 12 }}
      />
      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Variants
      </Text>
      {variants.map((v) => (
        <Slider
          key={v}
          value={50}
          variant={v}
          onValueChange={() => {}}
          style={{ marginBottom: 12 }}
        />
      ))}
      <Text weight="bold" size="lg" style={{ marginVertical: 12 }}>
        Sizes
      </Text>
      {sizes.map((s) => (
        <Slider
          key={s}
          value={50}
          size={s}
          onValueChange={() => {}}
          style={{ marginBottom: 12 }}
        />
      ))}
    </ScrollView>
  );
}
