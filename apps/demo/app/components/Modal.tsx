import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Button,
  Modal,
  Surface,
  Text,
  TextInput,
  Divider,
} from "@leshi/ui-rn";

export default function ModalDemo() {
  const [basicVisible, setBasicVisible] = useState(false);
  const [sizeDemoVisible, setSizeDemoVisible] = useState(false);
  const [animationDemoVisible, setAnimationDemoVisible] = useState(false);
  const [currentSize, setCurrentSize] = useState<"sm" | "base" | "lg" | "xl" | "full">("base");
  const [currentAnimation, setCurrentAnimation] = useState<"fade" | "slide" | "scale" | "none">("fade");
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text weight="bold" size="2xl">Modal</Text>
      <Text variant="mutedForeground">
        Reusable modal component with custom animations and @gorhom/portal for reliable z-index management.
      </Text>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">Basic Modal</Text>
        <Button 
          text="Open Basic Modal" 
          onPress={() => setBasicVisible(true)} 
        />
        
        <Modal
          visible={basicVisible}
          onRequestClose={() => setBasicVisible(false)}
          animationType="fade"
          size="base"
        >
          <View style={{ padding: 20, gap: 16, alignItems: "center" }}>
            <Text weight="semibold" size="lg">Modal Title</Text>
            <Text style={{ textAlign: "center" }}>
              This is a basic modal with fade animation. Click the backdrop or use the close button to dismiss.
            </Text>
            <Button 
              text="Close" 
              variant="outline"
              onPress={() => setBasicVisible(false)} 
            />
          </View>
        </Modal>
      </Surface>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">Size Variants</Text>
        <Text variant="mutedForeground">
          Available sizes: sm, base, lg, xl, full
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {(["sm", "base", "lg", "xl", "full"] as const).map((size) => (
            <Button
              key={size}
              text={size.toUpperCase()}
              variant="outline"
              onPress={() => {
                setCurrentSize(size);
                setSizeDemoVisible(true);
              }}
            />
          ))}
        </View>
        
        <Modal
          visible={sizeDemoVisible}
          onRequestClose={() => setSizeDemoVisible(false)}
          size={currentSize}
          animationType="scale"
        >
          <View style={{ padding: 20, gap: 16, alignItems: "center" }}>
            <Text weight="semibold" size="lg">Size: {currentSize.toUpperCase()}</Text>
            <Text style={{ textAlign: "center" }}>
              This modal demonstrates the {currentSize} size variant. Each size has different dimensions and responsive behavior.
            </Text>
            <Button 
              text="Close" 
              variant="outline"
              onPress={() => setSizeDemoVisible(false)} 
            />
          </View>
        </Modal>
      </Surface>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">Animation Types</Text>
        <Text variant="mutedForeground">
          Available animations: fade, slide, scale, none
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {(["fade", "slide", "scale", "none"] as const).map((animation) => (
            <Button
              key={animation}
              text={animation}
              variant="outline"
              onPress={() => {
                setCurrentAnimation(animation);
                setAnimationDemoVisible(true);
              }}
            />
          ))}
        </View>
        
        <Modal
          visible={animationDemoVisible}
          onRequestClose={() => setAnimationDemoVisible(false)}
          animationType={currentAnimation}
          size="base"
        >
          <View style={{ padding: 20, gap: 16, alignItems: "center" }}>
            <Text weight="semibold" size="lg">Animation: {currentAnimation}</Text>
            <Text style={{ textAlign: "center" }}>
              This modal uses the {currentAnimation} animation type. Each animation provides different visual feedback.
            </Text>
            <Button 
              text="Close" 
              variant="outline"
              onPress={() => setAnimationDemoVisible(false)} 
            />
          </View>
        </Modal>
      </Surface>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">Form Example</Text>
        <Text variant="mutedForeground">
          Modal with form content and controlled state
        </Text>
        <Button 
          text="Open Form Modal" 
          onPress={() => setFormVisible(true)} 
        />
        
        <Modal
          visible={formVisible}
          onRequestClose={() => setFormVisible(false)}
          animationType="slide"
          size="lg"
          closeOnBackdrop={false}
        >
          <View style={{ padding: 24, gap: 20 }}>
            <Text weight="semibold" size="lg">Contact Information</Text>
            <Divider />
            
            <View style={{ gap: 16 }}>
              <View>
                <Text weight="medium" style={{ marginBottom: 8 }}>Name</Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter your name"
                />
              </View>
              
              <View>
                <Text weight="medium" style={{ marginBottom: 8 }}>Email</Text>
                <TextInput
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
            
            <Divider />
            
            <View style={{ flexDirection: "row", gap: 12, justifyContent: "flex-end" }}>
              <Button 
                text="Cancel"
                variant="outline"
                onPress={() => {
                  setFormData({ name: "", email: "" });
                  setFormVisible(false);
                }}
              />
              <Button 
                text="Save"
                onPress={() => {
                  console.log("Form data:", formData);
                  setFormData({ name: "", email: "" });
                  setFormVisible(false);
                }}
              />
            </View>
          </View>
        </Modal>
      </Surface>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">Features</Text>
        <View style={{ gap: 8 }}>
          <Text>• @gorhom/portal for reliable z-index management</Text>
          <Text>• Custom animations with React Native Animated API</Text>
          <Text>• Responsive size variants (sm, base, lg, xl, full)</Text>
          <Text>• Configurable backdrop and back button behavior</Text>
          <Text>• StatusBar handling for immersive experience</Text>
          <Text>• Accessible with proper ARIA roles and labels</Text>
          <Text>• Performance optimized with useCallback and useMemo</Text>
          <Text>• TypeScript support with zero 'any' types</Text>
        </View>
      </Surface>
    </ScrollView>
  );
}