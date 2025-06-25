import { ScrollView, View, Alert } from "react-native";
import { Surface, Text, Button, TextInput, Avatar } from "@leshi/ui-rn";

const elevations = ["none", "xs", "md", "xl", "2xl", "3xl"] as const;
const variants = ["filled", "outlined", "default", "secondary", "muted", "accent"] as const;
const paddingOptions = ["none", "sm", "base", "lg", "xl"] as const;
const radiusOptions = ["none", "sm", "md", "lg", "xl", "2xl"] as const;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={{ marginBottom: 24 }}>
    <Text variant="heading" size="lg" style={{ marginBottom: 12 }}>
      {title}
    </Text>
    {children}
  </View>
);

export default function SurfaceScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="heading" size="2xl" style={{ marginBottom: 8 }}>
        Surface Component
      </Text>
      <Text variant="body" style={{ marginBottom: 24 }}>
        Versatile container component that provides elevation, backgrounds, and consistent spacing following shadcn design patterns.
      </Text>

      <Section title="Variants">
        <Text variant="caption" style={{ marginBottom: 16 }}>
          Different visual styles for various design contexts.
        </Text>
        <View style={{ gap: 12 }}>
          {variants.map((variant) => (
            <Surface key={variant} variant={variant} padding="base">
              <Text variant="heading" size="sm" style={{ marginBottom: 4 }}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </Text>
              <Text variant="body" size="sm">
                Surface with {variant} variant styling
              </Text>
            </Surface>
          ))}
        </View>
      </Section>

      <Section title="Elevation Levels">
        <Text variant="caption" style={{ marginBottom: 16 }}>
          Control depth with different shadow elevations.
        </Text>
        <View style={{ gap: 12 }}>
          {elevations.map((elevation) => (
            <Surface key={elevation} elevation={elevation} padding="base">
              <Text variant="heading" size="sm">
                Elevation: {elevation}
              </Text>
              <Text variant="body" size="sm">
                {elevation === "none" ? "No shadow applied" : `Shadow depth level ${elevation}`}
              </Text>
            </Surface>
          ))}
        </View>
      </Section>

      <Section title="Padding Options">
        <Text variant="caption" style={{ marginBottom: 16 }}>
          Built-in padding variants for consistent spacing.
        </Text>
        <View style={{ gap: 8 }}>
          {paddingOptions.map((padding) => (
            <Surface key={padding} variant="outlined" padding={padding}>
              <Text variant="body" size="sm">
                Padding: {padding}
              </Text>
            </Surface>
          ))}
        </View>
      </Section>

      <Section title="Border Radius">
        <Text variant="caption" style={{ marginBottom: 16 }}>
          Customize corner roundness with radius variants.
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {radiusOptions.map((radius) => (
            <Surface key={radius} variant="secondary" padding="sm" radius={radius}>
              <Text variant="body" size="sm">
                {radius}
              </Text>
            </Surface>
          ))}
        </View>
      </Section>

      <Section title="Real-World Examples">
        <View style={{ gap: 16 }}>
          <Surface variant="filled" padding="lg" elevation="md">
            <Text variant="heading" size="lg" style={{ marginBottom: 8 }}>
              Card Component
            </Text>
            <Text variant="body" style={{ marginBottom: 12 }}>
              This Surface acts as a card container with medium elevation and large padding.
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Button text="Primary" variant="primary" size="sm" onPress={() => Alert.alert("Primary pressed")} />
              <Button text="Secondary" variant="outline" size="sm" onPress={() => Alert.alert("Secondary pressed")} />
            </View>
          </Surface>

          <Surface variant="outlined" padding="base" radius="lg">
            <Text variant="heading" size="base" style={{ marginBottom: 12 }}>
              Form Container
            </Text>
            <TextInput
              label="Email"
              placeholder="Enter your email"
              style={{ marginBottom: 12 }}
            />
            <TextInput
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              style={{ marginBottom: 16 }}
            />
            <Button text="Sign In" fullWidth onPress={() => Alert.alert("Form submitted")} />
          </Surface>

          <Surface variant="muted" padding="base" radius="md">
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Avatar>
                <Text>JD</Text>
              </Avatar>
              <View style={{ flex: 1 }}>
                <Text variant="heading" size="base" style={{ marginBottom: 2 }}>
                  John Doe
                </Text>
                <Text variant="body" size="sm">
                  Software Engineer at Tech Corp
                </Text>
              </View>
              <Button text="Follow" variant="outline" size="sm" onPress={() => Alert.alert("Following user")} />
            </View>
          </Surface>

          <Surface variant="accent" padding="lg" radius="xl">
            <Text variant="heading" size="lg" style={{ marginBottom: 8, color: 'white' }}>
              Featured Content
            </Text>
            <Text variant="body" style={{ marginBottom: 12, color: 'white' }}>
              This Surface uses the accent variant to highlight important content or calls-to-action.
            </Text>
            <Button text="Learn More" variant="secondary" onPress={() => Alert.alert("Learning more...")} />
          </Surface>
        </View>
      </Section>

      <Section title="Composition Examples">
        <View style={{ gap: 16 }}>
          <Surface variant="filled" padding="none" elevation="lg" radius="xl">
            <Surface variant="secondary" padding="base" radius="xl">
              <Text variant="heading" size="base" style={{ marginBottom: 8 }}>
                Nested Surfaces
              </Text>
              <Text variant="body" size="sm">
                Surfaces can be nested to create layered designs with different variants and properties.
              </Text>
            </Surface>
          </Surface>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Surface variant="filled" padding="base" elevation="xs" style={{ flex: 1 }}>
              <Text variant="heading" size="sm" style={{ marginBottom: 4 }}>
                Stats Card
              </Text>
              <Text variant="body" size="lg" weight="bold">
                1,234
              </Text>
              <Text variant="body" size="sm">
                Total Users
              </Text>
            </Surface>
            <Surface variant="filled" padding="base" elevation="xs" style={{ flex: 1 }}>
              <Text variant="heading" size="sm" style={{ marginBottom: 4 }}>
                Revenue
              </Text>
              <Text variant="body" size="lg" weight="bold">
                $45,678
              </Text>
              <Text variant="body" size="sm">
                This Month
              </Text>
            </Surface>
          </View>

          <Surface variant="outlined" padding="base" radius="md">
            <Text variant="heading" size="base" style={{ marginBottom: 12 }}>
              Notification Panel
            </Text>
            <View style={{ gap: 8 }}>
              <Surface variant="muted" padding="sm" radius="sm">
                <Text variant="body" size="sm">
                  🎉 Welcome to the platform!
                </Text>
              </Surface>
              <Surface variant="default" padding="sm" radius="sm">
                <Text variant="body" size="sm">
                  📧 You have 3 new messages
                </Text>
              </Surface>
              <Surface variant="muted" padding="sm" radius="sm">
                <Text variant="body" size="sm">
                  ⚡ System update completed
                </Text>
              </Surface>
            </View>
          </Surface>
        </View>
      </Section>

      <Section title="Interactive Examples">
        <View style={{ gap: 12 }}>
          <Surface 
            variant="filled" 
            padding="base" 
            elevation="md"
            style={{ 
              transform: [{ scale: 1 }],
              opacity: 1
            }}
          >
            <Text variant="heading" size="base" style={{ marginBottom: 8 }}>
              Interactive Surface
            </Text>
            <Text variant="body" size="sm" style={{ marginBottom: 12 }}>
              Surfaces can be made interactive by adding touch handlers and animations.
            </Text>
            <Button 
              text="Tap to Interact" 
              variant="primary" 
              onPress={() => Alert.alert("Surface interaction!", "This Surface responded to your touch.")}
            />
          </Surface>

          <Surface variant="outlined" padding="lg" radius="2xl">
            <Text variant="heading" size="lg" style={{ marginBottom: 8 }}>
              Large Container
            </Text>
            <Text variant="body" style={{ marginBottom: 16 }}>
              Perfect for hero sections, feature highlights, or main content areas that need extra breathing room.
            </Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              <Button text="Get Started" variant="primary" onPress={() => Alert.alert("Getting started!")} />
              <Button text="Learn More" variant="outline" onPress={() => Alert.alert("Learning more...")} />
              <Button text="Contact Us" variant="ghost" onPress={() => Alert.alert("Contacting...")} />
            </View>
          </Surface>
        </View>
      </Section>

      <Section title="Edge Cases">
        <View style={{ gap: 12 }}>
          <Surface variant="filled" padding="none" radius="none">
            <Text style={{ padding: 8 }}>No padding, no radius - minimal Surface</Text>
          </Surface>
          
          <Surface variant="outlined" padding="xl" elevation="3xl" radius="2xl">
            <Text variant="heading" size="base">
              Maximum Everything
            </Text>
            <Text variant="body">
              Extra large padding, highest elevation, maximum border radius
            </Text>
          </Surface>

          <View style={{ height: 100 }}>
            <Surface 
              variant="secondary" 
              padding="base" 
              style={{ 
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text variant="heading">Absolute Positioned Surface</Text>
            </Surface>
          </View>
        </View>
      </Section>
    </ScrollView>
  );
}
