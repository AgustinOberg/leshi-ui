import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Button,
  Dialog,
  Surface,
  Text,
  TextInput,
  TextArea,
  Divider,
} from "@leshi/ui-rn";

export default function DialogDemo() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [currentSize, setCurrentSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const handleFormSubmit = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Form submitted:", formData);
    setFormData({ title: "", description: "", priority: "medium" });
    setFormOpen(false);
  };

  const handleLoadingAction = async () => {
    // Simulate long operation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setLoadingOpen(false);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text weight="bold" size="2xl">Dialog</Text>
      <Text variant="mutedForeground">
        A modal dialog with shadcn-identical API. Built with @gorhom/portal for reliable layering and custom animations.
      </Text>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">Basic Dialog</Text>
        <Dialog.Root open={basicOpen} onOpenChange={setBasicOpen}>
          <Dialog.Trigger asChild>
            <Button text="Open Basic Dialog" />
          </Dialog.Trigger>
          <Dialog.Content showCloseButton={true}>
            <Dialog.Header>
              <Dialog.Title>Welcome to Leshi UI</Dialog.Title>
              <Dialog.Description>
                This is a basic dialog demonstrating the shadcn-inspired API with full TypeScript support and zero 'any' types.
              </Dialog.Description>
            </Dialog.Header>
            <Text>
              The dialog includes automatic backdrop handling, keyboard support, and smooth animations powered by React Native's Animated API.
            </Text>
            <Dialog.Footer>
              <Dialog.Close asChild>
                <Button text="Got it" variant="outline" />
              </Dialog.Close>
              <Button text="Continue" onPress={() => console.log("Continue clicked")} />
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </Surface>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">Size Variants</Text>
        <Text variant="mutedForeground">
          Available sizes: sm, base, lg, xl
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {(["sm", "base", "lg", "xl"] as const).map((size) => (
            <Button
              key={size}
              text={size.toUpperCase()}
              variant="outline"
              onPress={() => {
                setCurrentSize(size);
                setSizeOpen(true);
              }}
            />
          ))}
        </View>
        
        <Dialog.Root open={sizeOpen} onOpenChange={setSizeOpen} size={currentSize}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Size: {currentSize.toUpperCase()}</Dialog.Title>
              <Dialog.Description>
                This dialog demonstrates the {currentSize} size variant with responsive behavior.
              </Dialog.Description>
            </Dialog.Header>
            <Text>
              Each size variant provides different dimensions while maintaining consistent spacing and typography. The dialog automatically adapts to screen constraints.
            </Text>
            <Dialog.Footer>
              <Dialog.Close asChild>
                <Button text="Close" />
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </Surface>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">Form Dialog</Text>
        <Text variant="mutedForeground">
          Dialog with form content and loading states
        </Text>
        <Dialog.Root open={formOpen} onOpenChange={setFormOpen}>
          <Dialog.Trigger asChild>
            <Button text="Create Task" />
          </Dialog.Trigger>
          <Dialog.Content closeOnBackdrop={false}>
            <Dialog.Header>
              <Dialog.Title>Create New Task</Dialog.Title>
              <Dialog.Description>
                Fill out the form below to create a new task. All fields are required.
              </Dialog.Description>
            </Dialog.Header>
            
            <View style={{ gap: 16 }}>
              <View>
                <Text weight="medium" style={{ marginBottom: 8 }}>Title</Text>
                <TextInput
                  value={formData.title}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                  placeholder="Enter task title"
                />
              </View>
              
              <View>
                <Text weight="medium" style={{ marginBottom: 8 }}>Description</Text>
                <TextArea
                  value={formData.description}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                  placeholder="Enter task description"
                  rows={4}
                />
              </View>
              
              <View>
                <Text weight="medium" style={{ marginBottom: 8 }}>Priority</Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {["low", "medium", "high"].map((priority) => (
                    <Button
                      key={priority}
                      text={priority}
                      variant={formData.priority === priority ? "primary" : "outline"}
                      onPress={() => setFormData(prev => ({ ...prev, priority }))}
                    />
                  ))}
                </View>
              </View>
            </View>
            
            <Dialog.Footer orientation="horizontal">
              <Dialog.Close asChild>
                <Button text="Cancel" variant="outline" />
              </Dialog.Close>
              <Button 
                text="Create Task" 
                onPress={handleFormSubmit}
                disabled={!formData.title || !formData.description}
              />
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </Surface>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">Loading States</Text>
        <Text variant="mutedForeground">
          Dialog with built-in loading management
        </Text>
        <Dialog.Root open={loadingOpen} onOpenChange={setLoadingOpen}>
          <Dialog.Trigger asChild>
            <Button text="Start Process" />
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Long Running Process</Dialog.Title>
              <Dialog.Description>
                This dialog demonstrates loading states and async operations.
              </Dialog.Description>
            </Dialog.Header>
            <Text>
              When you click "Start Process", the dialog will show loading state and prevent interaction until the operation completes.
            </Text>
            <Dialog.Footer>
              <Dialog.Close asChild>
                <Button text="Cancel" variant="outline" />
              </Dialog.Close>
              <Button text="Start Process" onPress={handleLoadingAction} />
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </Surface>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">Features</Text>
        <View style={{ gap: 8 }}>
          <Text>• shadcn-identical API with compound components</Text>
          <Text>• Built with @gorhom/portal for reliable z-index</Text>
          <Text>• Custom animations (fade, scale, slide)</Text>
          <Text>• Loading state management with context</Text>
          <Text>• Responsive size variants (sm, base, lg, xl)</Text>
          <Text>• Configurable backdrop and close button behavior</Text>
          <Text>• Automatic focus management and keyboard handling</Text>
          <Text>• Perfect TypeScript with zero 'any' types</Text>
          <Text>• Performance optimized with useCallback/useMemo</Text>
        </View>
      </Surface>
    </ScrollView>
  );
}