import { ScrollView, View } from "react-native";
import { Divider, Text } from "@leshi/ui-rn";

export default function DividerScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Divider
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Thin line used to separate content.
      </Text>
      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Horizontal
      </Text>
      <Divider style={{ marginBottom: 12 }} />
      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Vertical
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", height: 40 }}>
        <Text>Item 1</Text>
        <Divider orientation="vertical" style={{ marginHorizontal: 8 }} />
        <Text>Item 2</Text>
      </View>
    </ScrollView>
  );
}
