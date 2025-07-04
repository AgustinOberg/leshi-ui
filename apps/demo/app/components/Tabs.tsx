import { ScrollView } from "react-native";
import { Tabs, Text, Surface } from "@leshi/ui-rn";

export default function TabsScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Tabs
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Simple tabbed navigation with animated indicator.
      </Text>
      <Surface style={{ padding: 16 }}>
        <Tabs.Root defaultValue="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab One</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab Two</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Tab Three</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">
            <Text>Content for the first tab.</Text>
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <Text>Content for the second tab.</Text>
          </Tabs.Content>
          <Tabs.Content value="tab3">
            <Text>Content for the third tab.</Text>
          </Tabs.Content>
        </Tabs.Root>
      </Surface>
    </ScrollView>
  );
}
