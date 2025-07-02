<<<<<<< HEAD
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
=======
import { ScrollView, View, Alert } from "react-native";
import { TextInput, Text, Surface, Button } from "@leshi/ui-rn";
import { useState } from "react";

const sizes = ["sm", "base", "lg", "xl"] as const;
const variants = ["default", "destructive"] as const;
const textSizes = ["sm", "base", "lg", "xl"] as const;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={{ marginBottom: 24 }}>
    <Text variant="heading" size="lg" style={{ marginBottom: 12 }}>
      {title}
    </Text>
    {children}
  </View>
);

export default function TextInputScreen() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const updateValue = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="heading" size="2xl" style={{ marginBottom: 8 }}>
        TextInput Component
      </Text>
      <Text variant="body" style={{ marginBottom: 24 }}>
        Versatile input component with multiple sizes, variants, and states including prefix/suffix support.
      </Text>

      <Section title="Basic Examples">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={values.email || ""}
            onChangeText={(value) => updateValue('email', value)}
            style={{ marginBottom: 12 }}
          />
          
          <TextInput
            label="Password"
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={values.password || ""}
            onChangeText={(value) => updateValue('password', value)}
            suffix={
              <Button
                text={showPassword ? "Hide" : "Show"}
                variant="ghost"
                size="sm"
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={{ marginBottom: 12 }}
          />
          
          <TextInput
            label="Username"
            placeholder="Enter your username"
            value={values.username || ""}
            onChangeText={(value) => updateValue('username', value)}
            description="Must be unique and 3-20 characters"
          />
        </Surface>
      </Section>

      <Section title="Sizes">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            TextInput supports multiple sizes for different use cases.
          </Text>
          {sizes.map((size) => (
            <TextInput
              key={size}
              size={size}
              label={`Size ${size}`}
              placeholder={`This is ${size} size`}
              value={values[`size_${size}`] || ""}
              onChangeText={(value) => updateValue(`size_${size}`, value)}
              style={{ marginBottom: 12 }}
            />
          ))}
        </Surface>
      </Section>

      <Section title="Variants">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Different visual variants for different contexts.
          </Text>
          {variants.map((variant) => (
            <TextInput
              key={variant}
              variant={variant}
              label={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Variant`}
              placeholder={`This is ${variant} variant`}
              value={values[`variant_${variant}`] || ""}
              onChangeText={(value) => updateValue(`variant_${variant}`, value)}
              style={{ marginBottom: 12 }}
            />
          ))}
        </Surface>
      </Section>

      <Section title="States">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            TextInput supports various states for better UX.
          </Text>
          
          <TextInput
            label="Normal State"
            placeholder="Type something..."
            value={values.normal || ""}
            onChangeText={(value) => updateValue('normal', value)}
            style={{ marginBottom: 12 }}
          />
          
          <TextInput
            label="With Error"
            placeholder="This field has an error"
            value={values.error || ""}
            onChangeText={(value) => updateValue('error', value)}
            error="This field is required"
            style={{ marginBottom: 12 }}
          />
          
          <TextInput
            label="Disabled"
            placeholder="This field is disabled"
            value="Cannot edit this"
            editable={false}
            style={{ marginBottom: 12 }}
          />
          
          <TextInput
            label="Read Only"
            placeholder="This field is read-only"
            value="Read-only value"
            readOnly
          />
        </Surface>
      </Section>

      <Section title="Prefix and Suffix">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Add icons, buttons, or text before and after the input.
          </Text>
          
          <TextInput
            label="Search"
            placeholder="Search products..."
            prefix={<Text>🔍</Text>}
            value={values.search || ""}
            onChangeText={(value) => updateValue('search', value)}
            style={{ marginBottom: 12 }}
          />
          
          <TextInput
            label="Price"
            placeholder="0.00"
            prefix={<Text>$</Text>}
            suffix={<Text variant="mutedForeground">USD</Text>}
            value={values.price || ""}
            onChangeText={(value) => updateValue('price', value)}
            keyboardType="numeric"
            style={{ marginBottom: 12 }}
          />
          
          <TextInput
            label="Website"
            placeholder="mywebsite"
            prefix={<Text variant="mutedForeground">https://</Text>}
            suffix={<Text variant="mutedForeground">.com</Text>}
            value={values.website || ""}
            onChangeText={(value) => updateValue('website', value)}
            style={{ marginBottom: 12 }}
          />
          
          <TextInput
            label="Verification Code"
            placeholder="Enter 6-digit code"
            value={values.code || ""}
            onChangeText={(value) => updateValue('code', value)}
            suffix={
              <Button
                text="Resend"
                variant="link"
                size="sm"
                onPress={() => Alert.alert("Code resent!")}
              />
            }
            keyboardType="numeric"
            maxLength={6}
          />
        </Surface>
      </Section>

      <Section title="Text Sizes">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Control the font size of the input text independently.
          </Text>
          {textSizes.map((textSize) => (
            <TextInput
              key={textSize}
              textSize={textSize}
              label={`Text Size ${textSize}`}
              placeholder={`Font size is ${textSize}`}
              value={values[`textSize_${textSize}`] || ""}
              onChangeText={(value) => updateValue(`textSize_${textSize}`, value)}
              style={{ marginBottom: 12 }}
            />
          ))}
        </Surface>
      </Section>

      <Section title="Form Examples">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="subheading" style={{ marginBottom: 12 }}>
            Contact Form
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <TextInput
              label="First Name"
              placeholder="John"
              value={values.firstName || ""}
              onChangeText={(value) => updateValue('firstName', value)}
              style={{ flex: 1 }}
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              value={values.lastName || ""}
              onChangeText={(value) => updateValue('lastName', value)}
              style={{ flex: 1 }}
            />
          </View>
          
          <TextInput
            label="Email Address"
            placeholder="john.doe@example.com"
            value={values.contactEmail || ""}
            onChangeText={(value) => updateValue('contactEmail', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ marginBottom: 12 }}
          />
          
          <TextInput
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            value={values.phone || ""}
            onChangeText={(value) => updateValue('phone', value)}
            keyboardType="phone-pad"
            prefix={<Text>📞</Text>}
            style={{ marginBottom: 12 }}
          />
          
          <TextInput
            label="Subject"
            placeholder="What is this regarding?"
            value={values.subject || ""}
            onChangeText={(value) => updateValue('subject', value)}
            description="Brief description of your inquiry"
          />
        </Surface>
      </Section>

      <Section title="Edge Cases">
        <Surface style={{ padding: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Testing various edge cases and keyboard types.
          </Text>
          
          <TextInput
            label="Numbers Only"
            placeholder="123456"
            value={values.numbers || ""}
            onChangeText={(value) => updateValue('numbers', value)}
            keyboardType="number-pad"
            style={{ marginBottom: 12 }}
          />
          
          <TextInput
            label="URL"
            placeholder="https://example.com"
            value={values.url || ""}
            onChangeText={(value) => updateValue('url', value)}
            keyboardType="url"
            autoCapitalize="none"
            style={{ marginBottom: 12 }}
          />
          
          <TextInput
            label="Single Line Only"
            placeholder="This input is for single line text only"
            value={values.singleLine || ""}
            onChangeText={(value) => updateValue('singleLine', value)}
            style={{ marginBottom: 12 }}
          />
          
          <TextInput
            label="Auto-capitalize"
            placeholder="first letter of each word"
            value={values.autoCapitalize || ""}
            onChangeText={(value) => updateValue('autoCapitalize', value)}
            autoCapitalize="words"
          />
        </Surface>
      </Section>
>>>>>>> feature/import-alias
    </ScrollView>
  );
}
