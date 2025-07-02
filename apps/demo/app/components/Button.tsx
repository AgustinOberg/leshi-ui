import { ScrollView, View, Alert } from "react-native";
import { Button, Text, Surface } from "@leshi/ui-rn";
import { useState } from "react";

const variants = [
  { text: "Primary", variant: "primary" as const },
  { text: "Secondary", variant: "secondary" as const },
  { text: "Destructive", variant: "destructive" as const },
  { text: "Outline", variant: "outline" as const },
  { text: "Ghost", variant: "ghost" as const },
  { text: "Link", variant: "link" as const },
];

const sizes = [
  { text: "Small", size: "sm" as const },
  { text: "Base", size: "base" as const },
  { text: "Large", size: "lg" as const },
  { text: "Icon", size: "icon" as const },
];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={{ marginBottom: 24 }}>
    <Text variant="heading" size="lg" style={{ marginBottom: 12 }}>
      {title}
    </Text>
    {children}
  </View>
);

export default function ButtonScreen() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleLoadingExample = (key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
      Alert.alert("Success", "Action completed!");
    }, 2000);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="heading" size="2xl" style={{ marginBottom: 8 }}>
        Button Component
      </Text>
      <Text variant="body" style={{ marginBottom: 24 }}>
        Versatile button component with multiple variants, sizes, and states including loading support.
      </Text>

      <Section title="Button Variants">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          {variants.map((variant) => (
            <Button
              key={variant.variant}
              text={variant.text}
              variant={variant.variant}
              style={{ marginBottom: 12 }}
              onPress={() => Alert.alert(`${variant.text} pressed`)}
            />
          ))}
        </Surface>
      </Section>

      <Section title="Button Sizes">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          {sizes.map((size) => (
            <Button
              key={size.size}
              text={size.text}
              size={size.size}
              style={{ marginBottom: 12 }}
              onPress={() => Alert.alert(`${size.text} size pressed`)}
            />
          ))}
        </Surface>
      </Section>

      <Section title="Loading States">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Buttons automatically disable during loading and show a spinner.
          </Text>
          
          <Button
            text="Primary Loading"
            variant="primary"
            loading={loadingStates.primaryLoading}
            onPress={() => handleLoadingExample('primaryLoading')}
            style={{ marginBottom: 12 }}
          />
          
          <Button
            text="Outline Loading"
            variant="outline"
            loading={loadingStates.outlineLoading}
            onPress={() => handleLoadingExample('outlineLoading')}
            style={{ marginBottom: 12 }}
          />
          
          <Button
            text="Ghost Loading"
            variant="ghost"
            loading={loadingStates.ghostLoading}
            onPress={() => handleLoadingExample('ghostLoading')}
            style={{ marginBottom: 12 }}
          />
        </Surface>
      </Section>

      <Section title="Button States">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Buttons support disabled and loading states with proper accessibility.
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <Button text="Normal" variant="primary" onPress={() => Alert.alert("Normal pressed")} />
            <Button text="Disabled" variant="primary" disabled onPress={() => Alert.alert("Should not fire")} />
          </View>
          
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <Button text="Outline Normal" variant="outline" onPress={() => Alert.alert("Outline pressed")} />
            <Button text="Outline Disabled" variant="outline" disabled />
          </View>
        </Surface>
      </Section>

      <Section title="Full Width Examples">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Button
            text="Full Width Primary"
            variant="primary"
            fullWidth
            style={{ marginBottom: 12 }}
            onPress={() => Alert.alert("Full width pressed")}
          />
          
          <Button
            text="Full Width Outline"
            variant="outline"
            fullWidth
            style={{ marginBottom: 12 }}
            onPress={() => Alert.alert("Full width outline pressed")}
          />
          
          <Button
            text="Full Width Loading"
            variant="secondary"
            fullWidth
            loading={loadingStates.fullWidthLoading}
            onPress={() => handleLoadingExample('fullWidthLoading')}
          />
        </Surface>
      </Section>

      <Section title="Icon Buttons">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Icon buttons are perfect for actions without text labels.
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
            <Button
              text="+"
              size="icon"
              variant="primary"
              onPress={() => Alert.alert("Add pressed")}
            />
            <Button
              text="✓"
              size="icon"
              variant="secondary"
              onPress={() => Alert.alert("Check pressed")}
            />
            <Button
              text="×"
              size="icon"
              variant="destructive"
              onPress={() => Alert.alert("Close pressed")}
            />
            <Button
              text="?"
              size="icon"
              variant="outline"
              onPress={() => Alert.alert("Help pressed")}
            />
            <Button
              text="⚙"
              size="icon"
              variant="ghost"
              onPress={() => Alert.alert("Settings pressed")}
            />
          </View>
        </Surface>
      </Section>

      <Section title="Practical Examples">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="subheading" style={{ marginBottom: 12 }}>
            Form Actions
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <Button text="Cancel" variant="ghost" onPress={() => Alert.alert("Cancelled")} />
            <Button text="Save Draft" variant="outline" onPress={() => Alert.alert("Draft saved")} />
            <Button text="Publish" variant="primary" onPress={() => Alert.alert("Published")} />
          </View>

          <Text variant="subheading" style={{ marginBottom: 12 }}>
            Destructive Actions
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <Button text="Cancel" variant="ghost" onPress={() => Alert.alert("Cancelled")} />
            <Button text="Delete Account" variant="destructive" onPress={() => Alert.alert("Account deleted")} />
          </View>

          <Text variant="subheading" style={{ marginBottom: 12 }}>
            Navigation Links
          </Text>
          <Button text="Go to Profile" variant="link" onPress={() => Alert.alert("Navigating to profile")} />
        </Surface>
      </Section>
    </ScrollView>
  );
}