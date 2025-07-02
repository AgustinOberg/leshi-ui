import { ScrollView, View } from "react-native";
import { Accordion, Text, Surface, Button, Badge } from "@leshi/ui-rn";
import { useState } from "react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={{ marginBottom: 24 }}>
    <Text variant="heading" size="lg" style={{ marginBottom: 12 }}>
      {title}
    </Text>
    {children}
  </View>
);

export default function AccordionScreen() {
  const [controlledValue, setControlledValue] = useState<string>("controlled-1");
  const [multipleValue, setMultipleValue] = useState<string[]>(["multi-1", "multi-3"]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="heading" size="2xl" style={{ marginBottom: 8 }}>
        Accordion Component
      </Text>
      <Text variant="body" style={{ marginBottom: 24 }}>
        Collapsible content component with smooth Reanimated animations. Perfect for FAQs, settings panels, and content organization.
      </Text>

      <Section title="Basic Usage">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Single accordion - only one item can be open at a time
          </Text>
          <Accordion.Root type="single" defaultValue="basic-1">
            <Accordion.Item value="basic-1">
              <Accordion.Trigger>What is React Native?</Accordion.Trigger>
              <Accordion.Content>
                <Text variant="body">
                  React Native is a framework for building mobile applications using React. 
                  It allows you to build native apps for iOS and Android using JavaScript and React.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
            
            <Accordion.Item value="basic-2">
              <Accordion.Trigger>How does it work?</Accordion.Trigger>
              <Accordion.Content>
                <Text variant="body">
                  React Native uses native components instead of web components as building blocks. 
                  This means your app will have the look, feel, and performance of a native mobile app.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
            
            <Accordion.Item value="basic-3">
              <Accordion.Trigger>What are the benefits?</Accordion.Trigger>
              <Accordion.Content>
                <Text variant="body">
                  • Cross-platform development{"\n"}
                  • Native performance{"\n"}
                  • Hot reloading{"\n"}
                  • Large community support{"\n"}
                  • Code reusability
                </Text>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Surface>
      </Section>

      <Section title="Multiple Type">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Multiple accordion - several items can be open simultaneously
          </Text>
          <Accordion.Root 
            type="multiple" 
            value={multipleValue}
            onValueChange={setMultipleValue}
          >
            <Accordion.Item value="multi-1">
              <Accordion.Trigger>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text variant="body" weight="medium">Features</Text>
                  <Badge variant="secondary" text="3" />
                </View>
              </Accordion.Trigger>
              <Accordion.Content>
                <Text variant="body">
                  Our platform includes advanced analytics, real-time collaboration, 
                  and automated workflows to boost your productivity.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
            
            <Accordion.Item value="multi-2">
              <Accordion.Trigger>Pricing Plans</Accordion.Trigger>
              <Accordion.Content>
                <View style={{ gap: 12 }}>
                  <Text variant="body" weight="medium">Available Plans:</Text>
                  <Text variant="body">• Free: $0/month - Basic features</Text>
                  <Text variant="body">• Pro: $19/month - Advanced features</Text>
                  <Text variant="body">• Enterprise: $99/month - Full access</Text>
                </View>
              </Accordion.Content>
            </Accordion.Item>
            
            <Accordion.Item value="multi-3">
              <Accordion.Trigger>Support & Documentation</Accordion.Trigger>
              <Accordion.Content>
                <View style={{ gap: 8 }}>
                  <Button 
                    text="View Documentation" 
                    variant="outline" 
                    size="sm"
                  />
                  <Button 
                    text="Contact Support" 
                    variant="outline" 
                    size="sm"
                  />
                </View>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Surface>
      </Section>

      <Section title="Variants">
        <View style={{ gap: 16 }}>
          {/* Default variant */}
          <View>
            <Text variant="body" size="sm" weight="medium" style={{ marginBottom: 8 }}>
              Default Variant
            </Text>
            <Surface style={{ padding: 16 }}>
              <Accordion.Root type="single" variant="default">
                <Accordion.Item value="default-1">
                  <Accordion.Trigger>Default Style</Accordion.Trigger>
                  <Accordion.Content>
                    <Text variant="body">Clean, minimal design with bottom borders.</Text>
                  </Accordion.Content>
                </Accordion.Item>
                <Accordion.Item value="default-2">
                  <Accordion.Trigger>Simple and Clean</Accordion.Trigger>
                  <Accordion.Content>
                    <Text variant="body">Perfect for content-focused layouts.</Text>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </Surface>
          </View>

          {/* Bordered variant */}
          <View>
            <Text variant="body" size="sm" weight="medium" style={{ marginBottom: 8 }}>
              Bordered Variant
            </Text>
            <Accordion.Root type="single" variant="bordered">
              <Accordion.Item value="bordered-1">
                <Accordion.Trigger>Bordered Container</Accordion.Trigger>
                <Accordion.Content>
                  <Text variant="body">Enclosed in a bordered container for emphasis.</Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="bordered-2">
                <Accordion.Trigger>Professional Look</Accordion.Trigger>
                <Accordion.Content>
                  <Text variant="body">Great for formal documentation and FAQs.</Text>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </View>

          {/* Separated variant */}
          <View>
            <Text variant="body" size="sm" weight="medium" style={{ marginBottom: 8 }}>
              Separated Variant
            </Text>
            <Accordion.Root type="single" variant="separated">
              <Accordion.Item value="separated-1">
                <Accordion.Trigger>Card-like Items</Accordion.Trigger>
                <Accordion.Content>
                  <Text variant="body">Each item appears as a separate card.</Text>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="separated-2">
                <Accordion.Trigger>Modern Design</Accordion.Trigger>
                <Accordion.Content>
                  <Text variant="body">Perfect for modern, card-based layouts.</Text>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </View>
        </View>
      </Section>

      <Section title="Controlled State">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Programmatically control which items are open
          </Text>
          
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <Button 
              text="Open Item 1" 
              size="sm" 
              variant="outline"
              onPress={() => setControlledValue("controlled-1")}
            />
            <Button 
              text="Open Item 2" 
              size="sm" 
              variant="outline"
              onPress={() => setControlledValue("controlled-2")}
            />
            <Button 
              text="Close All" 
              size="sm" 
              variant="outline"
              onPress={() => setControlledValue("")}
            />
          </View>

          <Accordion.Root 
            type="single" 
            value={controlledValue}
            onValueChange={setControlledValue}
          >
            <Accordion.Item value="controlled-1">
              <Accordion.Trigger>Controlled Item 1</Accordion.Trigger>
              <Accordion.Content>
                <Text variant="body">
                  This accordion's state is controlled by the buttons above. 
                  Current value: {controlledValue || "none"}
                </Text>
              </Accordion.Content>
            </Accordion.Item>
            
            <Accordion.Item value="controlled-2">
              <Accordion.Trigger>Controlled Item 2</Accordion.Trigger>
              <Accordion.Content>
                <Text variant="body">
                  You can programmatically open and close accordion items 
                  by managing the state externally.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Surface>
      </Section>

      <Section title="Custom Triggers">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Customize trigger content and icon position
          </Text>
          
          <Accordion.Root type="single" variant="separated">
            <Accordion.Item value="custom-1">
              <Accordion.Trigger iconPosition="left">
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text variant="heading" size="base">📚 Documentation</Text>
                  <Badge variant="primary" text="New" />
                </View>
              </Accordion.Trigger>
              <Accordion.Content>
                <Text variant="body">
                  Complete API documentation with examples and best practices.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
            
            <Accordion.Item value="custom-2">
              <Accordion.Trigger showIcon={false}>
                <View style={{ 
                  flexDirection: "row", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  width: "100%" 
                }}>
                  <Text variant="body" weight="medium">⚙️ Settings</Text>
                  <Text variant="caption">Configure your preferences</Text>
                </View>
              </Accordion.Trigger>
              <Accordion.Content>
                <Text variant="body">
                  Customize your experience with advanced settings and preferences.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
            
            <Accordion.Item value="custom-3">
              <Accordion.Trigger>
                <View style={{ alignItems: "flex-start" }}>
                  <Text variant="body" weight="medium">🔔 Notifications</Text>
                  <Text variant="caption" style={{ marginTop: 2 }}>
                    Manage your notification preferences
                  </Text>
                </View>
              </Accordion.Trigger>
              <Accordion.Content>
                <Text variant="body">
                  Control how and when you receive notifications from our platform.
                </Text>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Surface>
      </Section>

      <Section title="Disabled States">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Disable entire accordion or individual items
          </Text>
          
          <Accordion.Root type="single" variant="bordered">
            <Accordion.Item value="enabled-1">
              <Accordion.Trigger>Available Feature</Accordion.Trigger>
              <Accordion.Content>
                <Text variant="body">This feature is available and working properly.</Text>
              </Accordion.Content>
            </Accordion.Item>
            
            <Accordion.Item value="disabled-1" disabled>
              <Accordion.Trigger>Coming Soon</Accordion.Trigger>
              <Accordion.Content>
                <Text variant="body">This feature will be available in the next update.</Text>
              </Accordion.Content>
            </Accordion.Item>
            
            <Accordion.Item value="enabled-2">
              <Accordion.Trigger>Another Available Feature</Accordion.Trigger>
              <Accordion.Content>
                <Text variant="body">This is another feature that's currently available.</Text>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Surface>
      </Section>

      <Section title="Real-world Example">
        <Surface style={{ padding: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            FAQ section with rich content
          </Text>
          
          <Accordion.Root type="single" variant="separated">
            <Accordion.Item value="faq-1">
              <Accordion.Trigger>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text variant="body" weight="medium">How do I get started?</Text>
                  <Badge variant="primary" text="Popular" />
                </View>
              </Accordion.Trigger>
              <Accordion.Content>
                <View style={{ gap: 12 }}>
                  <Text variant="body">
                    Getting started is easy! Follow these simple steps:
                  </Text>
                  <Text variant="body">
                    1. Sign up for an account{"\n"}
                    2. Complete your profile{"\n"}
                    3. Choose a plan that fits your needs{"\n"}
                    4. Start using our platform!
                  </Text>
                  <Button 
                    text="Get Started Now" 
                    variant="primary" 
                    size="sm"
                  />
                </View>
              </Accordion.Content>
            </Accordion.Item>
            
            <Accordion.Item value="faq-2">
              <Accordion.Trigger>What payment methods do you accept?</Accordion.Trigger>
              <Accordion.Content>
                <View style={{ gap: 8 }}>
                  <Text variant="body">We accept all major payment methods:</Text>
                  <Text variant="body">
                    💳 Credit Cards (Visa, MasterCard, Amex){"\n"}
                    🏦 Bank Transfers{"\n"}
                    💰 PayPal{"\n"}
                    ₿ Cryptocurrency (Bitcoin, Ethereum)
                  </Text>
                </View>
              </Accordion.Content>
            </Accordion.Item>
            
            <Accordion.Item value="faq-3">
              <Accordion.Trigger>Can I cancel my subscription anytime?</Accordion.Trigger>
              <Accordion.Content>
                <View style={{ gap: 12 }}>
                  <Text variant="body">
                    Yes! You can cancel your subscription at any time from your account settings. 
                    There are no cancellation fees or penalties.
                  </Text>
                  <Text variant="body">
                    Your access will continue until the end of your current billing period.
                  </Text>
                  <Button 
                    text="Manage Subscription" 
                    variant="outline" 
                    size="sm"
                  />
                </View>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Surface>
      </Section>
    </ScrollView>
  );
}