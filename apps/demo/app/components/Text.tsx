<<<<<<< HEAD
import { ScrollView } from "react-native";
import { Text } from "@leshi/ui-rn";

const sizes: any[] = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"];
const variants: any[] = [
  "foreground",
  "primary",
  "primaryForeground",
  "secondary",
  "secondaryForeground",
=======
import { ScrollView, View } from "react-native";
import { Text, Surface } from "@leshi/ui-rn";

const semanticVariants = ["heading", "subheading", "body", "caption", "overline"];
const colorVariants = [
  "foreground",
  "primary", 
  "primaryForeground",
  "secondary",
  "secondaryForeground", 
>>>>>>> feature/import-alias
  "destructive",
  "destructiveForeground",
  "mutedForeground",
];
<<<<<<< HEAD
=======
const displaySizes = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"];
const largeSizes = ["4xl", "5xl", "6xl"];
const extremeSizes = ["7xl", "8xl", "9xl"];
const weights = ["light", "regular", "medium", "semibold", "bold"];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={{ marginBottom: 24 }}>
    <Text variant="heading" size="lg" style={{ marginBottom: 12 }}>
      {title}
    </Text>
    {children}
  </View>
);
>>>>>>> feature/import-alias

export default function TextScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
<<<<<<< HEAD
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Text
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Typography component for displaying text.
      </Text>
      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Variants
      </Text>
      {variants.map((v) => (
        <Text key={v} variant={v} style={{ marginBottom: 8 }}>
          {v}
        </Text>
      ))}
      <Text weight="bold" size="lg" style={{ marginVertical: 12 }}>
        Sizes
      </Text>
      {sizes.map((s) => (
        <Text key={s} size={s} style={{ marginBottom: 8 }}>
          Size {s}
        </Text>
      ))}
=======
      <Text variant="heading" size="2xl" style={{ marginBottom: 8 }}>
        Text Component
      </Text>
      <Text variant="body" style={{ marginBottom: 24 }}>
        Comprehensive typography component with semantic variants, multiple sizes, and weights.
      </Text>

      <Section title="Semantic Variants">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="heading" style={{ marginBottom: 8 }}>
            This is a heading variant
          </Text>
          <Text variant="subheading" style={{ marginBottom: 8 }}>
            This is a subheading variant
          </Text>
          <Text variant="body" style={{ marginBottom: 8 }}>
            This is body text for regular content and paragraphs.
          </Text>
          <Text variant="caption" style={{ marginBottom: 8 }}>
            This is caption text for small details
          </Text>
          <Text variant="overline">
            THIS IS OVERLINE TEXT
          </Text>
        </Surface>
      </Section>

      <Section title="Color Variants">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {colorVariants.map((variant) => (
            <Surface key={variant} style={{ padding: 12, minWidth: 140 }}>
              <Text variant={variant as any} size="sm">
                {variant}
              </Text>
            </Surface>
          ))}
        </View>
      </Section>

      <Section title="Font Sizes">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="subheading" style={{ marginBottom: 8 }}>
            Regular Sizes
          </Text>
          {displaySizes.map((size) => (
            <Text key={size} size={size as any} style={{ marginBottom: 4 }}>
              Size {size} - The quick brown fox
            </Text>
          ))}
        </Surface>

        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="subheading" style={{ marginBottom: 8 }}>
            Large Sizes
          </Text>
          <View style={{ alignItems: 'flex-start' }}>
            {largeSizes.map((size) => (
              <Text key={size} size={size as any} style={{ marginBottom: 8 }}>
                {size}
              </Text>
            ))}
          </View>
        </Surface>

        <Surface style={{ padding: 16 }}>
          <Text variant="subheading" style={{ marginBottom: 8 }}>
            Display Sizes
          </Text>
          <View style={{ alignItems: 'flex-start' }}>
            {extremeSizes.map((size) => (
              <Text key={size} size={size as any} style={{ marginBottom: 12 }}>
                {size}
              </Text>
            ))}
          </View>
        </Surface>
      </Section>

      <Section title="Font Weights">
        <Surface style={{ padding: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Font weights use fontFamily on mobile and both fontFamily + fontWeight on web for optimal platform compatibility.
          </Text>
          {weights.map((weight) => (
            <View key={weight} style={{ marginBottom: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
              <Text weight={weight as any} size="xl" style={{ marginBottom: 4 }}>
                {weight}: The quick brown fox
              </Text>
              <Text variant="caption" style={{ fontFamily: 'monospace' }}>
                fontWeight: {weight === 'light' ? '300' : weight === 'regular' ? '400' : weight === 'medium' ? '500' : weight === 'semibold' ? '600' : '700'}
              </Text>
            </View>
          ))}
        </Surface>
      </Section>

      <Section title="Composition Examples">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="heading" size="xl" style={{ marginBottom: 8 }}>
            Article Title
          </Text>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Published on June 25, 2025 by Author Name
          </Text>
          <Text variant="body" style={{ marginBottom: 12 }}>
            This is the main body text of an article. It demonstrates how different text variants work together to create a hierarchy and improve readability.
          </Text>
          <Text variant="subheading" size="lg" style={{ marginBottom: 8 }}>
            Section Heading
          </Text>
          <Text variant="body" style={{ marginBottom: 8 }}>
            More body content continues here with proper spacing and typography.
          </Text>
        </Surface>

        <Surface style={{ padding: 16 }}>
          <Text variant="overline" style={{ marginBottom: 4 }}>
            NOTIFICATION
          </Text>
          <Text variant="heading" size="lg" style={{ marginBottom: 8 }}>
            Your profile has been updated
          </Text>
          <Text variant="body" style={{ marginBottom: 12 }}>
            We've successfully updated your profile information. All changes have been saved.
          </Text>
          <Text variant="caption">
            This action was completed at 14:32 PM
          </Text>
        </Surface>
      </Section>

      <Section title="Edge Cases">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="heading" style={{ marginBottom: 8 }}>
            Long Text Handling
          </Text>
          <Text variant="body" style={{ marginBottom: 8 }}>
            This is a very long piece of text that demonstrates how the Text component handles wrapping and line breaks when content exceeds the available width. It should wrap naturally and maintain proper spacing and readability across multiple lines.
          </Text>
        </Surface>

        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="heading" style={{ marginBottom: 8 }}>
            Empty and Special Cases
          </Text>
          <Text variant="body" style={{ marginBottom: 8 }}>
            Empty text: &quot;&quot;
          </Text>
          <Text variant="body" style={{ marginBottom: 8 }}>
            Numbers: 1234567890
          </Text>
          <Text variant="body" style={{ marginBottom: 8 }}>
            Special characters: !@#$%^&amp;*()_+-=[]&#123;&#125;|;:,.&lt;&gt;?
          </Text>
          <Text variant="body">
            Mixed content: Hello World 123 !@# 你好 🌟
          </Text>
        </Surface>
      </Section>

      <Section title="Practical Examples">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="heading" size="lg" style={{ marginBottom: 12 }}>
            Card Header Example
          </Text>
          <Text variant="heading" weight="semibold" style={{ marginBottom: 4 }}>
            Product Title
          </Text>
          <Text variant="caption" style={{ marginBottom: 8 }}>
            Category • Brand Name
          </Text>
          <Text variant="primary" size="lg" weight="bold" style={{ marginBottom: 8 }}>
            $299.99
          </Text>
          <Text variant="body" style={{ marginBottom: 12 }}>
            This is a description of the product with all the important details that users need to know.
          </Text>
        </Surface>

        <Surface style={{ padding: 16 }}>
          <Text variant="heading" size="lg" style={{ marginBottom: 12 }}>
            Responsive Text Combinations
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            <View style={{ flex: 1, minWidth: 200 }}>
              <Text variant="overline" style={{ marginBottom: 4 }}>
                BUTTON TEXT
              </Text>
              <Text variant="body" weight="medium">
                Call to Action
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: 200 }}>
              <Text variant="caption" style={{ marginBottom: 4 }}>
                Status message
              </Text>
              <Text variant="destructive" weight="medium">
                Error occurred
              </Text>
            </View>
          </View>
        </Surface>
      </Section>
>>>>>>> feature/import-alias
    </ScrollView>
  );
}
