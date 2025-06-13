import { ScrollView } from "react-native";
import { Surface, Text } from "@leshi/ui-rn";

const elevations: any[] = ["none", "xs", "md", "xl", "2xl", "3xl"];
const variants: any[] = ["filled", "outlined"];

export default function SurfaceScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 12 }}>
        Surface Variants
      </Text>
      {variants.map((v) => (
        <Surface key={v} variant={v} style={{ padding: 8, marginBottom: 12 }}>
          <Text>{v}</Text>
        </Surface>
      ))}
      <Text weight="bold" size="xl" style={{ marginVertical: 12 }}>
        Surface Elevation
      </Text>
      {elevations.map((e) => (
        <Surface
          key={e}
          elevation={e}
          style={{ padding: 8, marginBottom: 12 }}
        >
          <Text>{e}</Text>
        </Surface>
      ))}
    </ScrollView>
  );
}
