import { ComponentRegistry } from '../schemas/index.js';
import { DependencyResolutionError, ComponentNotFoundError } from '../errors/index.js';

// Enhanced component registry with all dependencies mapped
const COMPONENT_REGISTRY: Record<string, Omit<ComponentRegistry, 'files'>> = {
  // Core components
  button: {
    name: 'button',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: ['text'],
    utilities: [],
    providers: [],
    setup: ['Install dependencies: leshi-ui add component text'],
    description: 'A customizable button component with variants and sizes',
    example: `import { Button } from './components/ui/button';

<Button variant="primary" size="base" text="Click me" />
<Button variant="outline" size="sm" text="Small" />
<Button variant="destructive" loading={true} text="Loading" />`
  },

  text: {
    name: 'text',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: [],
    utilities: [],
    providers: [],
    setup: [],
    description: 'Typography component with semantic variants',
    example: `import { Text } from './components/ui/text';

<Text variant="heading">Heading</Text>
<Text variant="body">Body text</Text>
<Text variant="caption" size="sm">Small caption</Text>
<Text weight="bold">Bold text</Text>`
  },

  // Modal family
  modal: {
    name: 'modal',
    type: 'registry:ui',
    dependencies: ['@gorhom/portal'],
    registryDependencies: [],
    utilities: ['lib/modal-utils.ts'],
    providers: ['components/ui/modal-provider.tsx'],
    setup: [
      'Install external dependency: bun add @gorhom/portal',
      'Wrap your app with ModalProvider in _layout.tsx'
    ],
    description: 'A flexible modal component with animations',
    example: `import { Modal } from './components/ui/modal';

<Modal.Root open={open} onOpenChange={setOpen}>
  <Modal.Trigger>
    <Button text="Open Modal" />
  </Modal.Trigger>
  <Modal.Content>
    <Text>Modal content goes here</Text>
  </Modal.Content>
</Modal.Root>`
  },

  dialog: {
    name: 'dialog',
    type: 'registry:ui',
    dependencies: ['@gorhom/portal'],
    registryDependencies: ['modal', 'text', 'icon', 'slot'],
    utilities: [],
    providers: [],
    setup: [
      'Install external dependency: bun add @gorhom/portal',
      'Install components: leshi-ui add component modal text icon slot',
      'Wrap your app with ModalProvider in _layout.tsx'
    ],
    description: 'Dialog component built on top of Modal',
    example: `import { Dialog } from './components/ui/dialog';

<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Trigger>
    <Button text="Open Dialog" />
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Dialog Title</Dialog.Title>
    </Dialog.Header>
    <Text>Dialog content...</Text>
    <Dialog.Footer>
      <Button variant="outline" text="Cancel" />
      <Button text="Confirm" />
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>`
  },

  'alert-dialog': {
    name: 'alert-dialog',
    type: 'registry:ui',
    dependencies: ['@gorhom/portal'],
    registryDependencies: ['modal', 'text', 'button', 'slot'],
    utilities: [],
    providers: [],
    setup: [
      'Install external dependency: bun add @gorhom/portal',
      'Install components: leshi-ui add component modal text button slot',
      'Wrap your app with ModalProvider in _layout.tsx'
    ],
    description: 'Alert dialog for confirmations and destructive actions',
    example: `import { AlertDialog } from './components/ui/alert-dialog';

<AlertDialog.Root open={open} onOpenChange={setOpen}>
  <AlertDialog.Trigger>
    <Button variant="destructive" text="Delete" />
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>
        <Button variant="outline" text="Cancel" />
      </AlertDialog.Cancel>
      <AlertDialog.Action>
        <Button variant="destructive" text="Delete" />
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>`
  },

  // Form components
  'text-input': {
    name: 'text-input',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: ['label', 'text'],
    utilities: [],
    providers: [],
    setup: ['Install dependencies: leshi-ui add component label text'],
    description: 'Text input with label and validation states',
    example: `import { TextInput } from './components/ui/text-input';

<TextInput
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
/>
<TextInput
  variant="outline"
  size="lg"
  state="error"
  helperText="Invalid email"
/>`
  },

  'text-area': {
    name: 'text-area',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: ['label', 'text'],
    utilities: [],
    providers: [],
    setup: ['Install dependencies: leshi-ui add component label text'],
    description: 'Multi-line text input component',
    example: `import { TextArea } from './components/ui/text-area';

<TextArea
  label="Description"
  placeholder="Enter description..."
  value={description}
  onChangeText={setDescription}
  rows={4}
/>`
  },

  // Other components
  surface: {
    name: 'surface',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: [],
    utilities: [],
    providers: [],
    setup: [],
    description: 'Surface component with elevation and variants',
    example: `import { Surface } from './components/ui/surface';

<Surface variant="default" padding="md">
  <Text>Default surface</Text>
</Surface>
<Surface variant="accent" elevation="lg" radius="lg">
  <Text>Elevated accent surface</Text>
</Surface>`
  },

  checkbox: {
    name: 'checkbox',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: ['icon'],
    utilities: [],
    providers: [],
    setup: ['Install dependencies: leshi-ui add component icon'],
    description: 'Checkbox component with custom styling',
    example: `import { Checkbox } from './components/ui/checkbox';

<Checkbox
  checked={checked}
  onCheckedChange={setChecked}
  label="Accept terms"
/>`
  },

  icon: {
    name: 'icon',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: ['text'],
    utilities: [],
    providers: [],
    setup: ['Install dependencies: leshi-ui add component text'],
    description: 'Icon component with size and color variants',
    example: `import { Icon } from './components/ui/icon';

<Icon name="check" size={20} />
<Icon name="arrow-left" color="primary" />`
  },

  avatar: {
    name: 'avatar',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: ['text'],
    utilities: [],
    providers: [],
    setup: ['Install dependencies: leshi-ui add component text'],
    description: 'Avatar component with fallback support',
    example: `import { Avatar } from './components/ui/avatar';

<Avatar source={{ uri: 'https://...' }} size="lg" />
<Avatar fallback="JD" size="sm" />`
  },

  badge: {
    name: 'badge',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: ['text'],
    utilities: [],
    providers: [],
    setup: ['Install dependencies: leshi-ui add component text'],
    description: 'Badge component for status and labels',
    example: `import { Badge } from './components/ui/badge';

<Badge variant="default">New</Badge>
<Badge variant="secondary">Beta</Badge>
<Badge variant="destructive">Error</Badge>`
  },

  label: {
    name: 'label',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: ['text'],
    utilities: [],
    providers: [],
    setup: ['Install dependencies: leshi-ui add component text'],
    description: 'Label component for form inputs',
    example: `import { Label } from './components/ui/label';

<Label>Email Address</Label>
<Label required>Password *</Label>`
  },

  skeleton: {
    name: 'skeleton',
    type: 'registry:ui',
    dependencies: ['react-native-reanimated'],
    registryDependencies: [],
    utilities: [],
    providers: [],
    setup: ['Install external dependency: bun add react-native-reanimated'],
    description: 'Skeleton loader with animation',
    example: `import { Skeleton } from './components/ui/skeleton';

<Skeleton height={20} width={200} />
<Skeleton height={40} width="100%" variant="rounded" />`
  },

  progress: {
    name: 'progress',
    type: 'registry:ui',
    dependencies: ['react-native-reanimated'],
    registryDependencies: [],
    utilities: [],
    providers: [],
    setup: ['Install external dependency: bun add react-native-reanimated'],
    description: 'Progress bar with smooth animations',
    example: `import { Progress } from './components/ui/progress';

<Progress value={60} max={100} />
<Progress value={progress} variant="success" />`
  },

  switch: {
    name: 'switch',
    type: 'registry:ui',
    dependencies: ['react-native-reanimated'],
    registryDependencies: [],
    utilities: [],
    providers: [],
    setup: ['Install external dependency: bun add react-native-reanimated'],
    description: 'Animated switch component',
    example: `import { Switch } from './components/ui/switch';

<Switch
  checked={enabled}
  onCheckedChange={setEnabled}
  label="Enable notifications"
/>`
  },

  slot: {
    name: 'slot',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: [],
    utilities: [],
    providers: [],
    setup: [],
    description: 'Slot component for component composition',
    example: `import { Slot } from './components/ui/slot';

<Slot>
  <Button text="Slotted button" />
</Slot>`
  },

  divider: {
    name: 'divider',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: [],
    utilities: [],
    providers: [],
    setup: [],
    description: 'Divider component for visual separation',
    example: `import { Divider } from './components/ui/divider';

<Divider />
<Divider orientation="vertical" />
<Divider variant="dashed" />`
  },

  radio: {
    name: 'radio',
    type: 'registry:ui',
    dependencies: [],
    registryDependencies: ['icon'],
    utilities: [],
    providers: [],
    setup: ['Install dependencies: leshi-ui add component icon'],
    description: 'Radio group and radio item components',
    example: `import { RadioGroup, RadioGroupItem } from './components/ui/radio';

<RadioGroup value={value} onValueChange={setValue}>
  <RadioGroupItem value="option1" label="Option 1" />
  <RadioGroupItem value="option2" label="Option 2" />
</RadioGroup>`
  }
};

export class DependencyResolver {
  private resolved = new Set<string>();
  private resolving = new Set<string>();

  /**
   * Resolve all dependencies for a component using multi-pass resolution
   */
  public async resolveAllDependencies(componentName: string): Promise<string[]> {
    this.resolved.clear();
    this.resolving.clear();
    
    await this.resolveDependenciesRecursive(componentName);
    
    // Return in dependency order (dependencies before dependents)
    const result = Array.from(this.resolved);
    return this.sortByDependencyOrder(result);
  }

  /**
   * Get component metadata
   */
  public getComponent(name: string): ComponentRegistry {
    const component = COMPONENT_REGISTRY[name];
    if (!component) {
      throw new ComponentNotFoundError(name, this.getAvailableComponents());
    }

    return {
      ...component,
      files: [] // Files will be discovered at runtime
    };
  }

  /**
   * Get all available components
   */
  public getAvailableComponents(): string[] {
    return Object.keys(COMPONENT_REGISTRY).sort();
  }

  /**
   * Check if component exists
   */
  public hasComponent(name: string): boolean {
    return name in COMPONENT_REGISTRY;
  }

  /**
   * Get external dependencies for a list of components
   */
  public getExternalDependencies(componentNames: string[]): string[] {
    const dependencies = new Set<string>();
    
    for (const name of componentNames) {
      const component = COMPONENT_REGISTRY[name];
      if (component) {
        component.dependencies.forEach(dep => dependencies.add(dep));
      }
    }
    
    return Array.from(dependencies);
  }

  /**
   * Recursively resolve dependencies
   */
  private async resolveDependenciesRecursive(componentName: string): Promise<void> {
    // Check for circular dependencies
    if (this.resolving.has(componentName)) {
      throw new DependencyResolutionError(
        componentName,
        [`Circular dependency detected: ${Array.from(this.resolving).join(' -> ')} -> ${componentName}`]
      );
    }

    // Skip if already resolved
    if (this.resolved.has(componentName)) {
      return;
    }

    // Check if component exists
    if (!this.hasComponent(componentName)) {
      throw new ComponentNotFoundError(componentName, this.getAvailableComponents());
    }

    // Mark as currently resolving
    this.resolving.add(componentName);

    try {
      const component = COMPONENT_REGISTRY[componentName]!;
      
      // Resolve registry dependencies first
      for (const dependency of component.registryDependencies) {
        await this.resolveDependenciesRecursive(dependency);
      }

      // Mark as resolved
      this.resolved.add(componentName);
    } finally {
      // Remove from resolving set
      this.resolving.delete(componentName);
    }
  }

  /**
   * Sort components by dependency order (dependencies before dependents)
   */
  private sortByDependencyOrder(components: string[]): string[] {
    const sorted: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (componentName: string): void => {
      if (visited.has(componentName)) return;
      if (visiting.has(componentName)) {
        throw new DependencyResolutionError(
          componentName,
          ['Circular dependency detected during sorting']
        );
      }

      visiting.add(componentName);

      const component = COMPONENT_REGISTRY[componentName];
      if (component) {
        // Visit dependencies first
        for (const dependency of component.registryDependencies) {
          if (components.includes(dependency)) {
            visit(dependency);
          }
        }
      }

      visiting.delete(componentName);
      visited.add(componentName);
      sorted.push(componentName);
    };

    for (const component of components) {
      visit(component);
    }

    return sorted;
  }

  /**
   * Get setup instructions for a list of components
   */
  public getSetupInstructions(componentNames: string[]): string[] {
    const instructions = new Set<string>();
    
    for (const name of componentNames) {
      const component = COMPONENT_REGISTRY[name];
      if (component) {
        component.setup.forEach(instruction => instructions.add(instruction));
      }
    }
    
    return Array.from(instructions);
  }

  /**
   * Get utility files needed for components
   */
  public getUtilityFiles(componentNames: string[]): string[] {
    const utilities = new Set<string>();
    
    for (const name of componentNames) {
      const component = COMPONENT_REGISTRY[name];
      if (component) {
        component.utilities.forEach(utility => utilities.add(utility));
      }
    }
    
    return Array.from(utilities);
  }

  /**
   * Get provider files needed for components
   */
  public getProviderFiles(componentNames: string[]): string[] {
    const providers = new Set<string>();
    
    for (const name of componentNames) {
      const component = COMPONENT_REGISTRY[name];
      if (component) {
        component.providers.forEach(provider => providers.add(provider));
      }
    }
    
    return Array.from(providers);
  }
}