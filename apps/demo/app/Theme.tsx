import { ScrollView } from "react-native";
import { Button, Text, themes, useThemeName } from "@leshi/ui-rn";

export default function ThemeScreen() {
  const { themeName, setThemeName } = useThemeName();
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 12 }}>
        Select Theme (current: {themeName})
      </Text>
      {Object.keys(themes).map((name) => (
        <Button
          key={name}
          text={name}
          variant={themeName === name ? "primary" : "secondary"}
          style={{ marginBottom: 8 }}
          onPress={() => setThemeName(name as any)}
        />
      ))}
    </ScrollView>
  );
}
