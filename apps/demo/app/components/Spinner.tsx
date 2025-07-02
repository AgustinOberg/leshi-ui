import { ScrollView, View } from "react-native";
import { Spinner, Text, Surface, Button } from "@leshi/ui-rn";
import { useState } from "react";

const sizes = [
  { label: "Extra Small", size: "xs" as const },
  { label: "Small", size: "sm" as const },
  { label: "Base", size: "base" as const },
  { label: "Large", size: "lg" as const },
  { label: "Extra Large", size: "xl" as const },
];

const variants = [
  { label: "Default", variant: "default" as const },
  { label: "Primary", variant: "primary" as const },
  { label: "Secondary", variant: "secondary" as const },
  { label: "Destructive", variant: "destructive" as const },
  { label: "Muted", variant: "muted" as const },
];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={{ marginBottom: 24 }}>
    <Text variant="heading" size="lg" style={{ marginBottom: 12 }}>
      {title}
    </Text>
    {children}
  </View>
);

const SpinnerRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
    <View style={{ flex: 1 }}>
      <Text variant="body" size="sm" weight="medium">
        {label}
      </Text>
    </View>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
      {children}
    </View>
  </View>
);

export default function SpinnerScreen() {
  const [loading, setLoading] = useState(false);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="heading" size="2xl" style={{ marginBottom: 8 }}>
        Spinner Component
      </Text>
      <Text variant="body" style={{ marginBottom: 24 }}>
        Smooth animated loading spinner built with Reanimated. Features shadcn-inspired variants, multiple sizes, and customizable animation properties.
      </Text>

      <Section title="Spinner Sizes">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          {sizes.map((size) => (
            <SpinnerRow key={size.size} label={size.label}>
              <Spinner size={size.size} />
            </SpinnerRow>
          ))}
        </Surface>
      </Section>

      <Section title="Spinner Variants">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          {variants.map((variant) => (
            <SpinnerRow key={variant.variant} label={variant.label}>
              <Spinner variant={variant.variant} size="lg" />
            </SpinnerRow>
          ))}
        </Surface>
      </Section>

      <Section title="Custom Properties">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <SpinnerRow label="Custom Color">
            <Spinner color="#ff6b6b" size="lg" />
            <Spinner color="#4ecdc4" size="lg" />
            <Spinner color="#45b7d1" size="lg" />
          </SpinnerRow>
          
          <SpinnerRow label="Custom Stroke Width">
            <Spinner strokeWidth={1} size="lg" />
            <Spinner strokeWidth={3} size="lg" />
            <Spinner strokeWidth={5} size="lg" />
          </SpinnerRow>
          
          <SpinnerRow label="Custom Duration">
            <Spinner duration={400} size="lg" variant="primary" />
            <Spinner duration={800} size="lg" variant="primary" />
            <Spinner duration={1200} size="lg" variant="primary" />
          </SpinnerRow>
        </Surface>
      </Section>

      <Section title="Real-world Usage">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Spinner integrated with button loading states and various UI patterns.
          </Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text variant="body" size="sm" weight="medium" style={{ marginBottom: 8 }}>
              Button Loading State
            </Text>
            <Button
              text={loading ? "Loading..." : "Start Loading"}
              onPress={simulateLoading}
              loading={loading}
              variant="primary"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text variant="body" size="sm" weight="medium" style={{ marginBottom: 8 }}>
              Inline Loading Indicators
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Spinner size="sm" variant="muted" />
              <Text variant="body" size="sm">Loading content...</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Spinner size="sm" variant="destructive" />
              <Text variant="body" size="sm">Processing deletion...</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Spinner size="sm" variant="primary" />
              <Text variant="body" size="sm">Saving changes...</Text>
            </View>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text variant="body" size="sm" weight="medium" style={{ marginBottom: 8 }}>
              Centered Loading States
            </Text>
            <View style={{ 
              height: 120, 
              justifyContent: "center", 
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#e5e5e5",
              borderRadius: 8,
              marginBottom: 8
            }}>
              <Spinner size="lg" variant="primary" />
              <Text variant="caption" style={{ marginTop: 8 }}>
                Loading dashboard...
              </Text>
            </View>
          </View>

          <View>
            <Text variant="body" size="sm" weight="medium" style={{ marginBottom: 8 }}>
              Different Contexts
            </Text>
            <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
              {/* Small context */}
              <View style={{ 
                backgroundColor: "#f8f9fa", 
                padding: 8, 
                borderRadius: 4,
                alignItems: "center",
                minWidth: 60
              }}>
                <Spinner size="xs" variant="muted" />
                <Text variant="caption" style={{ marginTop: 4, fontSize: 10 }}>
                  Small
                </Text>
              </View>
              
              {/* Card context */}
              <View style={{ 
                backgroundColor: "#fff", 
                padding: 16, 
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#e5e5e5",
                alignItems: "center",
                minWidth: 80
              }}>
                <Spinner size="base" variant="primary" />
                <Text variant="caption" style={{ marginTop: 8 }}>
                  Card
                </Text>
              </View>
              
              {/* Hero context */}
              <View style={{ 
                backgroundColor: "#1a1a1a", 
                padding: 20, 
                borderRadius: 12,
                alignItems: "center",
                minWidth: 100
              }}>
                <Spinner size="xl" color="#ffffff" />
                <Text variant="caption" style={{ marginTop: 12, color: "#ffffff" }}>
                  Hero
                </Text>
              </View>
            </View>
          </View>
        </Surface>
      </Section>

      <Section title="Performance Showcase">
        <Surface style={{ padding: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Multiple spinners running simultaneously to demonstrate smooth Reanimated performance.
          </Text>
          <View style={{ 
            flexDirection: "row", 
            flexWrap: "wrap", 
            gap: 16,
            justifyContent: "center",
            alignItems: "center"
          }}>
            {Array.from({ length: 12 }, (_, i) => (
              <Spinner 
                key={i}
                size={["xs", "sm", "base"][i % 3] as any}
                variant={["default", "primary", "secondary", "destructive", "muted"][i % 5] as any}
                duration={600 + (i * 100)}
              />
            ))}
          </View>
        </Surface>
      </Section>
    </ScrollView>
  );
}