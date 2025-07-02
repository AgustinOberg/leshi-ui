<<<<<<< HEAD
import { ScrollView, View } from "react-native";
import { Checkbox, Text } from "@leshi/ui-rn";
import { useState } from "react";

const sizes: any[] = ["sm", "md", "lg"];

export default function CheckboxScreen() {
  const [checked, setChecked] = useState(false);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Checkbox
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Allows the selection of a single option.
      </Text>
      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Sizes
      </Text>
      {sizes.map((size) => (
        <View key={size} style={{ marginBottom: 12 }}>
          <Text style={{ marginBottom: 4 }}>Size {size}</Text>
          <Checkbox
            size={size}
            checked={checked}
            onPress={() => setChecked((c) => !c)}
          />
        </View>
      ))}
    </ScrollView>
  );
}
=======
import React, { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Checkbox, Text, Surface } from "@leshi/ui-rn";

// Demo section component for better organization
interface DemoSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const DemoSection: React.FC<DemoSectionProps> = ({ title, description, children }) => (
  <Surface style={styles.section} elevation="md" radius="lg" padding="lg">
    <Text weight="bold" size="lg" style={styles.sectionTitle}>
      {title}
    </Text>
    {description && (
      <Text variant="mutedForeground" style={styles.sectionDescription}>
        {description}
      </Text>
    )}
    <View style={styles.sectionContent}>
      {children}
    </View>
  </Surface>
);

// Row component for consistent layout
interface DemoRowProps {
  label: string;
  children: React.ReactNode;
  description?: string;
}

const DemoRow: React.FC<DemoRowProps> = ({ label, children, description }) => (
  <View style={styles.demoRow}>
    <View style={styles.demoRowContent}>
      <View style={styles.demoRowInfo}>
        <Text weight="medium" style={styles.demoRowLabel}>
          {label}
        </Text>
        {description && (
          <Text variant="mutedForeground" size="sm">
            {description}
          </Text>
        )}
      </View>
      <View style={styles.demoRowControls}>
        {children}
      </View>
    </View>
  </View>
);

export default function CheckboxScreen() {
  // States for different demos
  const [basicChecked, setBasicChecked] = useState(false);
  const [controlledChecked, setControlledChecked] = useState(true);
  const [indeterminateState, setIndeterminateState] = useState<'unchecked' | 'indeterminate' | 'checked'>('indeterminate');
  const [disabledChecked, setDisabledChecked] = useState(true);
  
  // Multi-select demo
  const [selectAllState, setSelectAllState] = useState<'unchecked' | 'indeterminate' | 'checked'>('unchecked');
  const [items, setItems] = useState([
    { id: 1, label: "Download offline maps", checked: false },
    { id: 2, label: "Enable notifications", checked: false },
    { id: 3, label: "Auto-sync data", checked: false },
    { id: 4, label: "Share usage analytics", checked: false },
  ]);

  // Update select all state based on items
  React.useEffect(() => {
    const checkedCount = items.filter(item => item.checked).length;
    if (checkedCount === 0) {
      setSelectAllState('unchecked');
    } else if (checkedCount === items.length) {
      setSelectAllState('checked');
    } else {
      setSelectAllState('indeterminate');
    }
  }, [items]);

  const handleSelectAll = (checked: boolean) => {
    setItems(items.map(item => ({ ...item, checked })));
  };

  const handleItemToggle = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleIndeterminateToggle = () => {
    const nextState = 
      indeterminateState === 'unchecked' ? 'indeterminate' :
      indeterminateState === 'indeterminate' ? 'checked' : 'unchecked';
    setIndeterminateState(nextState);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text weight="bold" size="2xl" style={styles.title}>
          Checkbox
        </Text>
        <Text variant="mutedForeground" size="lg" style={styles.subtitle}>
          A control that allows users to toggle between checked and unchecked states. 
          Supports controlled/uncontrolled modes, multiple variants, and accessibility features.
        </Text>
      </View>

      {/* Basic Usage */}
      <DemoSection 
        title="Basic Usage" 
        description="Simple checkbox with controlled state management"
      >
        <DemoRow 
          label="Basic Checkbox"
          description="Click to toggle between checked and unchecked"
        >
          <Checkbox 
            checked={basicChecked}
            onCheckedChange={setBasicChecked}
            aria-label="Basic checkbox example"
          />
        </DemoRow>
        
        <DemoRow label="Current State">
          <Text weight="medium" variant={basicChecked ? "primary" : "mutedForeground"}>
            {basicChecked ? "✓ Checked" : "○ Unchecked"}
          </Text>
        </DemoRow>
      </DemoSection>

      {/* Sizes */}
      <DemoSection 
        title="Sizes" 
        description="Available size variants for different use cases"
      >
        <DemoRow label="Small (sm)" description="Compact size for dense layouts">
          <Checkbox 
            size="sm" 
            checked={controlledChecked}
            onCheckedChange={setControlledChecked}
            aria-label="Small checkbox"
          />
        </DemoRow>
        
        <DemoRow label="Base (default)" description="Standard size for most use cases">
          <Checkbox 
            size="base" 
            checked={controlledChecked}
            onCheckedChange={setControlledChecked}
            aria-label="Base size checkbox"
          />
        </DemoRow>
        
        <DemoRow label="Large (lg)" description="Larger size for emphasis or accessibility">
          <Checkbox 
            size="lg" 
            checked={controlledChecked}
            onCheckedChange={setControlledChecked}
            aria-label="Large checkbox"
          />
        </DemoRow>
      </DemoSection>

      {/* Variants */}
      <DemoSection 
        title="Variants" 
        description="Visual style variants for different contexts"
      >
        <DemoRow 
          label="Default Variant" 
          description="Uses primary theme colors"
        >
          <Checkbox 
            variant="default"
            checked={controlledChecked}
            onCheckedChange={setControlledChecked}
            aria-label="Default variant checkbox"
          />
        </DemoRow>
        
        <DemoRow 
          label="Destructive Variant" 
          description="For potentially harmful actions"
        >
          <Checkbox 
            variant="destructive"
            checked={controlledChecked}
            onCheckedChange={setControlledChecked}
            aria-label="Destructive variant checkbox"
          />
        </DemoRow>
      </DemoSection>

      {/* States */}
      <DemoSection 
        title="States" 
        description="Different checkbox states including indeterminate"
      >
        <DemoRow 
          label="Indeterminate State" 
          description="Useful for 'select all' scenarios"
        >
          <Checkbox 
            checked={indeterminateState === 'checked'}
            indeterminate={indeterminateState === 'indeterminate'}
            onCheckedChange={handleIndeterminateToggle}
            aria-label="Indeterminate state example"
          />
        </DemoRow>
        
        <DemoRow label="Current State">
          <Text weight="medium">
            {indeterminateState === 'unchecked' && "○ Unchecked"}
            {indeterminateState === 'indeterminate' && "⊟ Indeterminate"}
            {indeterminateState === 'checked' && "✓ Checked"}
          </Text>
        </DemoRow>
        
        <DemoRow 
          label="Disabled State" 
          description="Checkbox in disabled state"
        >
          <View style={styles.rowGroup}>
            <Checkbox 
              disabled 
              checked={false}
              aria-label="Disabled unchecked"
            />
            <Text style={styles.spacing}>Disabled Unchecked</Text>
          </View>
        </DemoRow>
        
        <DemoRow label="">
          <View style={styles.rowGroup}>
            <Checkbox 
              disabled 
              checked={true}
              aria-label="Disabled checked"
            />
            <Text style={styles.spacing}>Disabled Checked</Text>
          </View>
        </DemoRow>
      </DemoSection>

      {/* Real-world Example: Multi-select with Select All */}
      <DemoSection 
        title="Real-world Example" 
        description="Multi-select list with 'Select All' functionality using indeterminate state"
      >
        <DemoRow label="">
          <View style={styles.multiSelectContainer}>
            {/* Select All Checkbox */}
            <View style={styles.selectAllRow}>
              <Checkbox 
                checked={selectAllState === 'checked'}
                indeterminate={selectAllState === 'indeterminate'}
                onCheckedChange={handleSelectAll}
                aria-label="Select all items"
              />
              <Text weight="semibold" style={styles.selectAllLabel}>
                Select All Settings
              </Text>
            </View>
            
            {/* Individual Items */}
            <View style={styles.itemsList}>
              {items.map((item) => (
                <View key={item.id} style={styles.listItem}>
                  <Checkbox 
                    checked={item.checked}
                    onCheckedChange={() => handleItemToggle(item.id)}
                    aria-label={item.label}
                  />
                  <Text style={styles.itemLabel}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
            
            {/* Status Summary */}
            <View style={styles.statusSummary}>
              <Text variant="mutedForeground" size="sm">
                {items.filter(item => item.checked).length} of {items.length} items selected
              </Text>
            </View>
          </View>
        </DemoRow>
      </DemoSection>

      {/* Accessibility Features */}
      <DemoSection 
        title="Accessibility Features" 
        description="Built-in accessibility support for screen readers and assistive technologies"
      >
        <DemoRow 
          label="Screen Reader Support" 
          description="Automatic state announcements"
        >
          <Checkbox 
            checked={basicChecked}
            onCheckedChange={setBasicChecked}
            aria-label="Accessibility example checkbox"
            aria-describedby="checkbox-description"
          />
        </DemoRow>
        
        <Text variant="mutedForeground" size="sm" style={styles.accessibilityNote}>
          This checkbox includes proper ARIA labels, state descriptions, and screen reader support.
          Current state is automatically announced when changed.
        </Text>
      </DemoSection>

      {/* API Usage Examples */}
      <DemoSection 
        title="Usage Examples" 
        description="Common implementation patterns and API usage"
      >
        <View style={styles.codeSection}>
          <Text weight="medium" style={styles.codeTitle}>Controlled Checkbox:</Text>
          <Surface style={styles.codeBlock} variant="muted" padding="base" radius="md">
            <Text size="sm" style={[styles.codeText, { fontFamily: 'monospace' }]}>
{`const [checked, setChecked] = useState(false);

<Checkbox 
  checked={checked}
  onCheckedChange={setChecked}
  size="base"
  variant="default"
/>`}
            </Text>
          </Surface>
        </View>
        
        <View style={styles.codeSection}>
          <Text weight="medium" style={styles.codeTitle}>Indeterminate State:</Text>
          <Surface style={styles.codeBlock} variant="muted" padding="base" radius="md">
            <Text size="sm" style={[styles.codeText, { fontFamily: 'monospace' }]}>
{`<Checkbox 
  checked={someChecked}
  indeterminate={partiallySelected}
  onCheckedChange={handleSelectAll}
  aria-label="Select all items"
/>`}
            </Text>
          </Surface>
        </View>
      </DemoSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 20,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 24,
  },
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  sectionDescription: {
    marginBottom: 16,
    lineHeight: 20,
  },
  sectionContent: {
    gap: 12,
  },
  demoRow: {
    paddingVertical: 4,
  },
  demoRowContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44, // Accessibility minimum touch target
  },
  demoRowInfo: {
    flex: 1,
    marginRight: 16,
  },
  demoRowLabel: {
    marginBottom: 2,
  },
  demoRowControls: {
    alignItems: "center",
  },
  rowGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  spacing: {
    marginLeft: 12,
  },
  multiSelectContainer: {
    width: "100%",
  },
  selectAllRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    marginBottom: 12,
  },
  selectAllLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
  itemsList: {
    gap: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingLeft: 16, // Indent to show hierarchy
  },
  itemLabel: {
    marginLeft: 12,
    flex: 1,
  },
  statusSummary: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  accessibilityNote: {
    marginTop: 8,
    fontStyle: "italic",
  },
  codeSection: {
    marginBottom: 16,
  },
  codeTitle: {
    marginBottom: 8,
  },
  codeBlock: {
    marginBottom: 4,
  },
  codeText: {
    lineHeight: 18,
  },
});
>>>>>>> feature/import-alias
