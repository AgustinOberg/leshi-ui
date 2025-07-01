import { ScrollView, View, Alert } from "react-native";
import { TextArea, Text, Surface, Button } from "@leshi/ui-rn";
import { useState } from "react";

const sizes = ["sm", "base", "lg", "xl"] as const;
const variants = ["default", "destructive"] as const;
const rowCounts = [2, 3, 4, 6, 8] as const;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={{ marginBottom: 24 }}>
    <Text variant="heading" size="lg" style={{ marginBottom: 12 }}>
      {title}
    </Text>
    {children}
  </View>
);

export default function TextAreaScreen() {
  const [values, setValues] = useState<Record<string, string>>({});

  const updateValue = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="heading" size="2xl" style={{ marginBottom: 8 }}>
        TextArea Component
      </Text>
      <Text variant="body" style={{ marginBottom: 24 }}>
        Multi-line text input component perfect for comments, descriptions, and long-form content with character counting support.
      </Text>

      <Section title="Basic Examples">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <TextArea
            label="Comment"
            placeholder="Share your thoughts..."
            value={values.comment || ""}
            onChangeText={(value) => updateValue('comment', value)}
            description="Tell us what you think about this"
            style={{ marginBottom: 12 }}
          />
          
          <TextArea
            label="Bio"
            placeholder="Tell us about yourself"
            value={values.bio || ""}
            onChangeText={(value) => updateValue('bio', value)}
            rows={6}
            maxLength={500}
            showCharacterCount
            description="Maximum 500 characters"
            style={{ marginBottom: 12 }}
          />
          
          <TextArea
            label="Feedback"
            placeholder="How can we improve?"
            value={values.feedback || ""}
            onChangeText={(value) => updateValue('feedback', value)}
            rows={4}
          />
        </Surface>
      </Section>

      <Section title="Sizes">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            TextArea supports multiple sizes for different use cases.
          </Text>
          {sizes.map((size) => (
            <TextArea
              key={size}
              size={size}
              label={`Size ${size}`}
              placeholder={`This is ${size} size TextArea`}
              value={values[`size_${size}`] || ""}
              onChangeText={(value) => updateValue(`size_${size}`, value)}
              rows={3}
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
            <TextArea
              key={variant}
              variant={variant}
              label={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Variant`}
              placeholder={`This is ${variant} variant`}
              value={values[`variant_${variant}`] || ""}
              onChangeText={(value) => updateValue(`variant_${variant}`, value)}
              rows={3}
              style={{ marginBottom: 12 }}
            />
          ))}
        </Surface>
      </Section>

      <Section title="Row Counts">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Control the initial height with different row counts.
          </Text>
          {rowCounts.map((rows) => (
            <TextArea
              key={rows}
              label={`${rows} Rows`}
              placeholder={`This TextArea has ${rows} rows initially`}
              value={values[`rows_${rows}`] || ""}
              onChangeText={(value) => updateValue(`rows_${rows}`, value)}
              rows={rows}
              style={{ marginBottom: 12 }}
            />
          ))}
        </Surface>
      </Section>

      <Section title="States">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            TextArea supports various states for better UX.
          </Text>
          
          <TextArea
            label="Normal State"
            placeholder="Type your message here..."
            value={values.normal || ""}
            onChangeText={(value) => updateValue('normal', value)}
            rows={3}
            style={{ marginBottom: 12 }}
          />
          
          <TextArea
            label="With Error"
            placeholder="This field has an error"
            value={values.error || ""}
            onChangeText={(value) => updateValue('error', value)}
            error="This field is required and must be at least 10 characters"
            rows={3}
            style={{ marginBottom: 12 }}
          />
          
          <TextArea
            label="Disabled"
            placeholder="This field is disabled"
            value="This content cannot be edited because the field is disabled"
            editable={false}
            rows={3}
            style={{ marginBottom: 12 }}
          />
          
          <TextArea
            label="Read Only"
            placeholder="This field is read-only"
            value="This is read-only content that users can see but not modify"
            readOnly
            rows={3}
          />
        </Surface>
      </Section>

      <Section title="Character Limits">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            TextArea can enforce character limits with visual feedback.
          </Text>
          
          <TextArea
            label="Tweet (280 chars)"
            placeholder="What's happening?"
            value={values.tweet || ""}
            onChangeText={(value) => updateValue('tweet', value)}
            maxLength={280}
            showCharacterCount
            rows={3}
            description="Share your thoughts in 280 characters or less"
            style={{ marginBottom: 12 }}
          />
          
          <TextArea
            label="Short Description (100 chars)"
            placeholder="Brief description..."
            value={values.shortDesc || ""}
            onChangeText={(value) => updateValue('shortDesc', value)}
            maxLength={100}
            showCharacterCount
            rows={2}
            style={{ marginBottom: 12 }}
          />
          
          <TextArea
            label="Product Review (1000 chars)"
            placeholder="Write a detailed review..."
            value={values.review || ""}
            onChangeText={(value) => updateValue('review', value)}
            maxLength={1000}
            showCharacterCount
            rows={6}
            description="Help others by sharing your experience"
          />
        </Surface>
      </Section>

      <Section title="Form Examples">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="subheading" style={{ marginBottom: 12 }}>
            Support Ticket
          </Text>
          
          <TextArea
            label="Issue Description"
            placeholder="Describe the problem you're experiencing..."
            value={values.issueDesc || ""}
            onChangeText={(value) => updateValue('issueDesc', value)}
            rows={4}
            maxLength={1000}
            showCharacterCount
            description="Please be as detailed as possible"
            style={{ marginBottom: 12 }}
          />
          
          <TextArea
            label="Steps to Reproduce"
            placeholder="1. Go to...
2. Click on...
3. See error"
            value={values.steps || ""}
            onChangeText={(value) => updateValue('steps', value)}
            rows={6}
            description="Help us understand how to recreate the issue"
            style={{ marginBottom: 12 }}
          />
          
          <TextArea
            label="Additional Information"
            placeholder="Any other details that might be helpful..."
            value={values.additional || ""}
            onChangeText={(value) => updateValue('additional', value)}
            rows={3}
          />
        </Surface>

        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="subheading" style={{ marginBottom: 12 }}>
            Blog Post Draft
          </Text>
          
          <TextArea
            label="Article Content"
            placeholder="Start writing your article..."
            value={values.article || ""}
            onChangeText={(value) => updateValue('article', value)}
            rows={10}
            maxLength={5000}
            showCharacterCount
            description="Draft your article here (max 5000 characters)"
            style={{ marginBottom: 12 }}
          />
          
          <TextArea
            label="Meta Description"
            placeholder="Brief description for search engines..."
            value={values.meta || ""}
            onChangeText={(value) => updateValue('meta', value)}
            rows={2}
            maxLength={160}
            showCharacterCount
            description="Optimal length: 150-160 characters"
          />
        </Surface>
      </Section>

      <Section title="Advanced Examples">
        <Surface style={{ padding: 16, marginBottom: 16 }}>
          <Text variant="subheading" style={{ marginBottom: 12 }}>
            Interactive Features
          </Text>
          
          <TextArea
            label="Auto-expanding Content"
            placeholder="Start typing and watch the field grow..."
            value={values.autoExpand || ""}
            onChangeText={(value) => updateValue('autoExpand', value)}
            rows={2}
            description="This field starts small but can grow as needed"
            style={{ marginBottom: 12 }}
          />
          
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
            <Button
              text="Clear All"
              variant="outline"
              size="sm"
              onPress={() => setValues({})}
            />
            <Button
              text="Fill Sample"
              variant="secondary"
              size="sm"
              onPress={() => setValues({
                autoExpand: "This is sample content that demonstrates how TextArea works with longer text. You can see how it handles multiple lines and maintains proper formatting throughout the content."
              })}
            />
          </View>
          
          <TextArea
            label="Code Snippet"
            placeholder="// Enter your code here
function example() {
  return 'Hello World';
}"
            value={values.code || ""}
            onChangeText={(value) => updateValue('code', value)}
            rows={8}
            style={{ fontFamily: 'monospace' }}
            description="Perfect for code snippets and technical content"
          />
        </Surface>
      </Section>

      <Section title="Edge Cases">
        <Surface style={{ padding: 16 }}>
          <Text variant="caption" style={{ marginBottom: 16 }}>
            Testing various edge cases and special scenarios.
          </Text>
          
          <TextArea
            label="Very Long Text"
            placeholder="Test with very long content..."
            value={values.longText || ""}
            onChangeText={(value) => updateValue('longText', value)}
            rows={4}
            maxLength={2000}
            showCharacterCount
            description="Test how the component handles very long text content"
            style={{ marginBottom: 12 }}
          />
          
          <TextArea
            label="Minimal Rows"
            placeholder="Just one line initially"
            value={values.minimal || ""}
            onChangeText={(value) => updateValue('minimal', value)}
            rows={1}
            description="Starts with just one row"
            style={{ marginBottom: 12 }}
          />
          
          <TextArea
            label="Maximum Rows"
            placeholder="Large text area for extensive content..."
            value={values.maxRows || ""}
            onChangeText={(value) => updateValue('maxRows', value)}
            rows={10}
            description="Perfect for long-form content"
          />
        </Surface>
      </Section>
    </ScrollView>
  );
}