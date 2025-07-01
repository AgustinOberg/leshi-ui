# Component Catalog

Complete reference for all available Leshi UI components. Each component is designed with React Native best practices, comprehensive theming support, and consistent API patterns.

## 🚀 Quick Reference

```bash
# Install any component
leshi-ui add component <name>

# Get component documentation
leshi-ui guide component <name>

# List all components
leshi-ui list component
```

## 🟦 Core UI Components

### **Button**
```bash
leshi-ui add component button
```

Interactive button component with multiple variants and sizes.

**Variants:**
- `primary` - Main action button (default)
- `secondary` - Secondary actions
- `outline` - Bordered button
- `ghost` - Minimal button
- `destructive` - Dangerous actions

**Sizes:** `sm` | `base` | `lg`

**Dependencies:** `text`, `icon`

**Usage:**
```typescript
import { Button } from './components/ui/button';

<Button variant="primary" size="base" onPress={handlePress}>
  Click me
</Button>

// With icon
<Button variant="outline" icon="plus">
  Add Item
</Button>

// Loading state
<Button variant="primary" loading disabled>
  Processing...
</Button>
```

---

### **Text**
```bash
leshi-ui add component text
```

Typography component with semantic variants and comprehensive sizing.

**Variants:**
- `heading` - Page and section headings
- `body` - Regular body text (default)
- `caption` - Small descriptive text
- `label` - Form labels

**Sizes:** `xs` | `sm` | `base` | `lg` | `xl` | `2xl` | `3xl`

**Dependencies:** None

**Usage:**
```typescript
import { Text } from './components/ui/text';

<Text variant="heading" size="2xl">
  Page Title
</Text>

<Text variant="body" size="base">
  Regular content text
</Text>

<Text variant="caption" size="sm">
  Helper text
</Text>

// With custom styling
<Text variant="body" style={{ color: theme.colors.primary }}>
  Custom styled text
</Text>
```

---

### **Modal**
```bash
leshi-ui add component modal
```

Flexible modal component with animations and portal integration.

**Features:**
- Portal-based rendering
- Smooth animations
- Backdrop handling
- Keyboard management
- Accessibility support

**Dependencies:** `text`, `button`, `modal-utils`
**External Dependencies:** `@gorhom/portal`

**Usage:**
```typescript
import { Modal } from './components/ui/modal';
import { ModalProvider } from './components/ui/modal';

// Wrap app with ModalProvider
<ModalProvider>
  <YourApp />
</ModalProvider>

// Use modal
const [visible, setVisible] = useState(false);

<Modal
  visible={visible}
  onClose={() => setVisible(false)}
  title="Modal Title"
>
  <Text>Modal content here</Text>
</Modal>
```

---

### **Input (Text Input)**
```bash
leshi-ui add component text-input
```

Text input component with validation states and helper text.

**States:**
- `default` - Normal input state
- `error` - Error validation state
- `disabled` - Disabled input state

**Features:**
- Placeholder support
- Helper text
- Error messages
- Character counting
- Secure text entry

**Dependencies:** `text`, `label`

**Usage:**
```typescript
import { TextInput } from './components/ui/text-input';

const [value, setValue] = useState('');
const [error, setError] = useState('');

<TextInput
  label="Email"
  placeholder="Enter your email"
  value={value}
  onChangeText={setValue}
  error={error}
  helperText="We'll never share your email"
  keyboardType="email-address"
/>

// Password input
<TextInput
  label="Password"
  placeholder="Enter password"
  secureTextEntry
  value={password}
  onChangeText={setPassword}
/>
```

---

### **Card**
```bash
leshi-ui add component surface
```

Surface component that serves as the foundation for cards and elevated containers.

**Variants:**
- `default` - Standard surface
- `outlined` - With border
- `elevated` - With shadow/elevation

**Features:**
- Customizable elevation
- Border radius control
- Theme-aware styling
- Composition-friendly

**Dependencies:** None

**Usage:**
```typescript
import { Surface } from './components/ui/surface';

<Surface variant="elevated" style={{ padding: 16 }}>
  <Text variant="heading">Card Title</Text>
  <Text variant="body">Card content goes here</Text>
</Surface>

// Outlined card
<Surface variant="outlined">
  <Text>Outlined content</Text>
</Surface>
```

---

### **Avatar**
```bash
leshi-ui add component avatar
```

Profile picture component with fallback support and multiple sizes.

**Sizes:** `sm` | `base` | `lg` | `xl`

**Features:**
- Image loading with fallbacks
- Initial-based fallbacks
- Customizable styling
- Circular design

**Dependencies:** `text`

**Usage:**
```typescript
import { Avatar } from './components/ui/avatar';

// With image
<Avatar
  source={{ uri: 'https://example.com/avatar.jpg' }}
  size="lg"
  fallback="JD"
/>

// Fallback only
<Avatar
  fallback="AB"
  size="base"
/>

// Custom styling
<Avatar
  source={{ uri: userImage }}
  size="xl"
  style={{ borderWidth: 2, borderColor: theme.colors.primary }}
/>
```

---

### **Badge**
```bash
leshi-ui add component badge
```

Status indicators and labels with multiple variants.

**Variants:**
- `default` - Standard badge
- `secondary` - Muted badge
- `success` - Success indicator
- `warning` - Warning indicator
- `destructive` - Error indicator

**Sizes:** `sm` | `base` | `lg`

**Dependencies:** `text`

**Usage:**
```typescript
import { Badge } from './components/ui/badge';

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Inactive</Badge>

// With custom content
<Badge variant="default" size="lg">
  Premium User
</Badge>
```

---

### **Progress**
```bash
leshi-ui add component progress
```

Progress indicator with smooth animations.

**Features:**
- Smooth animations
- Customizable colors
- Determinate and indeterminate modes
- Accessibility support

**Dependencies:** None

**Usage:**
```typescript
import { Progress } from './components/ui/progress';

const [progress, setProgress] = useState(0);

<Progress value={progress} max={100} />

// With custom styling
<Progress
  value={75}
  max={100}
  style={{ height: 8 }}
  trackColor={theme.colors.border}
  progressColor={theme.colors.primary}
/>

// Indeterminate
<Progress indeterminate />
```

---

### **Skeleton**
```bash
leshi-ui add component skeleton
```

Loading placeholder with subtle animations.

**Features:**
- Smooth shimmer animation
- Customizable dimensions
- Multiple shape support
- Performance optimized

**Dependencies:** None

**Usage:**
```typescript
import { Skeleton } from './components/ui/skeleton';

// Text skeleton
<Skeleton width={200} height={16} />

// Avatar skeleton
<Skeleton width={40} height={40} borderRadius={20} />

// Card skeleton
<View>
  <Skeleton width="100%" height={120} />
  <Skeleton width="80%" height={16} style={{ marginTop: 8 }} />
  <Skeleton width="60%" height={16} style={{ marginTop: 4 }} />
</View>
```

---

### **Switch**
```bash
leshi-ui add component switch
```

Animated toggle switch component.

**Features:**
- Smooth toggle animations
- Customizable colors
- Accessibility support
- Disabled state support

**Sizes:** `sm` | `base` | `lg`

**Dependencies:** None

**Usage:**
```typescript
import { Switch } from './components/ui/switch';

const [enabled, setEnabled] = useState(false);

<Switch
  value={enabled}
  onValueChange={setEnabled}
  size="base"
/>

// With label
<View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Text>Enable notifications</Text>
  <Switch
    value={notifications}
    onValueChange={setNotifications}
    style={{ marginLeft: 'auto' }}
  />
</View>
```

---

### **Separator (Divider)**
```bash
leshi-ui add component divider
```

Visual separator component for content organization.

**Orientations:**
- `horizontal` - Horizontal line (default)
- `vertical` - Vertical line

**Features:**
- Customizable thickness
- Theme-aware coloring
- Flexible sizing

**Dependencies:** None

**Usage:**
```typescript
import { Divider } from './components/ui/divider';

// Horizontal divider
<View>
  <Text>Content above</Text>
  <Divider />
  <Text>Content below</Text>
</View>

// Vertical divider
<View style={{ flexDirection: 'row' }}>
  <Text>Left content</Text>
  <Divider orientation="vertical" style={{ marginHorizontal: 16 }} />
  <Text>Right content</Text>
</View>
```

---

## 🟨 Form Components

### **Checkbox**
```bash
leshi-ui add component checkbox
```

Custom styled checkbox with animations.

**States:**
- `unchecked` - Default unchecked
- `checked` - Checked state
- `indeterminate` - Partial selection

**Dependencies:** `icon`

**Usage:**
```typescript
import { Checkbox } from './components/ui/checkbox';

const [checked, setChecked] = useState(false);

<Checkbox
  checked={checked}
  onCheckedChange={setChecked}
  label="Accept terms and conditions"
/>

// Indeterminate state
<Checkbox
  checked={"indeterminate"}
  onCheckedChange={handleChange}
  label="Select all items"
/>
```

---

### **Radio**
```bash
leshi-ui add component radio
```

Radio button group for single selection.

**Features:**
- Group management
- Custom styling
- Keyboard navigation
- Accessibility support

**Dependencies:** None

**Usage:**
```typescript
import { RadioGroup, RadioItem } from './components/ui/radio';

const [selected, setSelected] = useState('option1');

<RadioGroup value={selected} onValueChange={setSelected}>
  <RadioItem value="option1" label="Option 1" />
  <RadioItem value="option2" label="Option 2" />
  <RadioItem value="option3" label="Option 3" />
</RadioGroup>
```

---

### **Text Area**
```bash
leshi-ui add component text-area
```

Multi-line text input for longer content.

**Features:**
- Auto-expanding height
- Character counting
- Validation states
- Placeholder support

**Dependencies:** `text`, `label`

**Usage:**
```typescript
import { TextArea } from './components/ui/text-area';

const [message, setMessage] = useState('');

<TextArea
  label="Message"
  placeholder="Enter your message..."
  value={message}
  onChangeText={setMessage}
  maxLength={500}
  numberOfLines={4}
/>
```

---

### **Label**
```bash
leshi-ui add component label
```

Form labels with consistent styling.

**Features:**
- Required indicator
- Custom styling
- Accessibility features

**Dependencies:** `text`

**Usage:**
```typescript
import { Label } from './components/ui/label';

<Label required>Email Address</Label>
<TextInput placeholder="Enter email" />

// With custom styling
<Label style={{ color: theme.colors.primary }}>
  Custom Label
</Label>
```

---

## 🟩 Utility Components

### **Icon**
```bash
leshi-ui add component icon
```

Icon component with theming support.

**Features:**
- Lucide React Native icons
- Theme-aware coloring
- Customizable sizes
- TypeScript icon name completion

**Dependencies:** None
**External Dependencies:** `lucide-react-native`

**Usage:**
```typescript
import { Icon } from './components/ui/icon';

<Icon name="home" size={24} />
<Icon name="user" size={20} color={theme.colors.primary} />
<Icon name="settings" size={16} style={{ marginRight: 8 }} />
```

---

### **Spinner**
```bash
leshi-ui add component spinner
```

Loading spinner with animations.

**Sizes:** `sm` | `base` | `lg`

**Features:**
- Smooth rotation animation
- Customizable colors
- Multiple sizes
- Performance optimized

**Dependencies:** None

**Usage:**
```typescript
import { Spinner } from './components/ui/spinner';

<Spinner size="base" />
<Spinner size="lg" color={theme.colors.primary} />

// With text
<View style={{ alignItems: 'center' }}>
  <Spinner size="lg" />
  <Text style={{ marginTop: 8 }}>Loading...</Text>
</View>
```

---

### **Slot**
```bash
leshi-ui add component slot
```

Component composition utility for advanced patterns.

**Features:**
- Component merging
- Prop forwarding
- Flexible composition
- Type-safe usage

**Dependencies:** None

**Usage:**
```typescript
import { Slot } from './components/ui/slot';

// Advanced composition patterns
<Slot asChild>
  <Button variant="primary">
    <Text>Slotted content</Text>
  </Button>
</Slot>
```

---

## 🟧 Advanced Components

### **Dialog**
```bash
leshi-ui add component dialog
```

Dialog component built on the modal foundation.

**Features:**
- Modal-based implementation
- Predefined layouts
- Action buttons
- Accessibility features

**Dependencies:** `modal`, `button`, `text`

**Usage:**
```typescript
import { Dialog } from './components/ui/dialog';

const [open, setOpen] = useState(false);

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Confirm Action"
  description="Are you sure you want to continue?"
>
  <Dialog.Content>
    <Text>Additional dialog content</Text>
  </Dialog.Content>
  
  <Dialog.Actions>
    <Button variant="outline" onPress={() => setOpen(false)}>
      Cancel
    </Button>
    <Button variant="destructive" onPress={handleConfirm}>
      Continue
    </Button>
  </Dialog.Actions>
</Dialog>
```

---

### **Alert Dialog**
```bash
leshi-ui add component alert-dialog
```

Specialized dialog for confirmations and alerts.

**Types:**
- `info` - Information alert
- `warning` - Warning alert
- `error` - Error alert
- `success` - Success alert

**Dependencies:** `dialog`, `button`, `text`, `icon`

**Usage:**
```typescript
import { AlertDialog } from './components/ui/alert-dialog';

<AlertDialog
  open={showAlert}
  onOpenChange={setShowAlert}
  type="warning"
  title="Delete Item"
  description="This action cannot be undone. Are you sure?"
  confirmText="Delete"
  cancelText="Cancel"
  onConfirm={handleDelete}
  onCancel={() => setShowAlert(false)}
/>
```

---

## 📋 Component Dependencies

Understanding component dependencies helps you plan installations:

```
Dependency Tree:
├── button
│   ├── text
│   └── icon
├── modal
│   ├── text
│   ├── button
│   └── modal-utils
├── dialog
│   ├── modal
│   ├── button
│   └── text
├── alert-dialog
│   ├── dialog
│   ├── icon
│   └── text
└── text-input
    ├── text
    └── label
```

## 🔧 Installation Strategies

### **Essential Components**
```bash
# Core UI kit
leshi-ui add component button text

# Form essentials
leshi-ui add component text-input label checkbox

# Layout components
leshi-ui add component surface divider

# Feedback components
leshi-ui add component progress skeleton spinner
```

### **Complete Installation**
```bash
# Install all components
leshi-ui add component button text modal dialog alert-dialog surface text-input text-area checkbox switch progress skeleton avatar badge divider icon label radio slot spinner
```

### **By Use Case**

**Forms:**
```bash
leshi-ui add component text-input text-area checkbox radio switch label button
```

**Navigation:**
```bash
leshi-ui add component button text icon avatar badge
```

**Content Display:**
```bash
leshi-ui add component surface text avatar badge progress skeleton divider
```

**Overlays:**
```bash
leshi-ui add component modal dialog alert-dialog
```

## 🎨 Theming

All components respect the theme system:

```typescript
// Components automatically use theme colors
const { theme } = useTheme();

// Theme tokens available:
theme.colors.primary      // Primary brand color
theme.colors.secondary    // Secondary color
theme.colors.background   // Background color
theme.colors.card         // Card background
theme.colors.text         // Primary text
theme.colors.border       // Border color
theme.spacing.sm          // Small spacing
theme.borderRadius.base   // Default border radius
theme.fonts.regular       // Regular font family
```

## 📱 Platform Considerations

### **iOS Specific**
- Native iOS styling patterns
- Safe area handling
- iOS-specific animations
- UIKit-inspired interactions

### **Android Specific**
- Material Design adaptations
- Android-specific shadows
- Ripple effects
- Navigation patterns

### **Web Specific**
- Mouse hover states
- Keyboard navigation
- Responsive breakpoints
- Web accessibility

## 🚀 Performance Tips

### **Import Optimization**
```typescript
// ✅ Good: Direct imports
import { Button } from './components/ui/button';

// ❌ Avoid: Barrel exports
import { Button } from './components/ui';
```

### **Styling Performance**
```typescript
// ✅ Good: StyleSheet.create
const styles = StyleSheet.create({
  container: { padding: 16 }
});

// ❌ Avoid: Inline styles
<View style={{ padding: 16 }} />
```

### **Re-render Optimization**
```typescript
// ✅ Good: Memoized styles
const styles = useMemo(() => 
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background
    }
  }), [theme]
);
```

## 🔗 Next Steps

- **Theme Customization**: [Theming Guide](./theming/overview.md)
- **CLI Reference**: [CLI Usage](./cli-usage.md)
- **Development**: [Development Guide](./development.md)
- **Examples**: [Basic Examples](./examples/basic.md)

---

**Need help with a specific component?** Use `leshi-ui guide component <name>` for detailed documentation and examples.
