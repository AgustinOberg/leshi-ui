import React, { useState } from "react";
import { ScrollView, View, Alert } from "react-native";
import { AlertDialog, Button, Surface, Text, Divider } from "@leshi/ui-rn";

export default function AlertDialogDemo() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [destructiveOpen, setDestructiveOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [asyncOpen, setAsyncOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [smOpen, setSmOpen] = useState(false);
  const [baseOpen, setBaseOpen] = useState(false);
  const [lgOpen, setLgOpen] = useState(false);

  const handleDeleteUser = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    Alert.alert("Success", "User has been deleted successfully");
  };

  const handleAsyncOperation = async () => {
    // Simulate long async operation
    await new Promise((resolve) => setTimeout(resolve, 3000));
    Alert.alert("Success", "Operation completed successfully");
  };

  const handleSaveChanges = async () => {
    // Simulate save operation that might fail
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (Math.random() > 0.5) {
      throw new Error("Network error occurred");
    }
    Alert.alert("Success", "Changes saved successfully");
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text weight="bold" size="2xl">
        AlertDialog
      </Text>
      <Text variant="mutedForeground">
        A modal dialog for important confirmations with variants and async
        support. Built with @gorhom/portal for reliable layering.
      </Text>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">
          Basic AlertDialog
        </Text>
        <AlertDialog.Root open={basicOpen} onOpenChange={setBasicOpen}>
          <AlertDialog.Trigger asChild>
            <Button text="Show Confirmation" />
          </AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>Confirm Action</AlertDialog.Title>
              <AlertDialog.Description>
                Are you sure you want to proceed? This is a basic confirmation
                dialog.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Cancel text="Cancel" />
              <AlertDialog.Action
                text="Continue"
                onPress={() => Alert.alert("Success", "Action confirmed")}
              />
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </Surface>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">
          Destructive Variant
        </Text>
        <Text variant="mutedForeground">
          Red border and destructive button styling for dangerous actions
        </Text>
        <AlertDialog.Root
          open={destructiveOpen}
          onOpenChange={setDestructiveOpen}
          variant="destructive"
        >
          <AlertDialog.Trigger asChild>
            <Button text="Delete User" variant="destructive" />
          </AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>Delete User Account</AlertDialog.Title>
              <AlertDialog.Description>
                This action cannot be undone. The users data will be permanently
                removed from our servers.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Cancel text="Cancel" />
              <AlertDialog.Action
                text="Delete Account"
                onPress={handleDeleteUser}
              />
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </Surface>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">
          Warning Variant
        </Text>
        <Text variant="mutedForeground">
          Orange border for warning actions that need attention
        </Text>
        <AlertDialog.Root
          open={warningOpen}
          onOpenChange={setWarningOpen}
          variant="warning"
        >
          <AlertDialog.Trigger asChild>
            <Button text="Discard Changes" variant="outline" />
          </AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>Unsaved Changes</AlertDialog.Title>
              <AlertDialog.Description>
                You have unsaved changes that will be lost if you continue. Are
                you sure you want to discard them?
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Cancel text="Keep Editing" />
              <AlertDialog.Action
                text="Discard Changes"
                onPress={() => Alert.alert("Info", "Changes discarded")}
              />
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </Surface>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">
          Async Operations
        </Text>
        <Text variant="mutedForeground">
          Actions with loading states and error handling
        </Text>
        <AlertDialog.Root open={asyncOpen} onOpenChange={setAsyncOpen}>
          <AlertDialog.Trigger asChild>
            <Button text="Start Process" />
          </AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>Start Background Process</AlertDialog.Title>
              <AlertDialog.Description>
                This will start a long-running process that might take a few
                seconds to complete.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Cancel text="Cancel" />
              <AlertDialog.Action
                text="Start Process"
                onPress={handleAsyncOperation}
              />
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </Surface>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">
          Error Handling
        </Text>
        <Text variant="mutedForeground">
          Async operations with potential error scenarios
        </Text>
        <AlertDialog.Root open={customOpen} onOpenChange={setCustomOpen}>
          <AlertDialog.Trigger asChild>
            <Button text="Save Changes" />
          </AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>Save Changes</AlertDialog.Title>
              <AlertDialog.Description>
                Your changes will be saved to the server. This operation might
                fail due to network issues.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer orientation="vertical">
              <AlertDialog.Action
                text="Save Changes"
                onPress={handleSaveChanges}
                closeOnPress={false}
              />
              <AlertDialog.Cancel text="Cancel" />
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </Surface>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">
          Size Variants
        </Text>
        <Text variant="mutedForeground">
          Different sizes for various use cases
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <AlertDialog.Root open={smOpen} onOpenChange={setSmOpen}>
            <AlertDialog.Trigger asChild>
              <Button text="SM" variant="outline" />
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title>Size: SM</AlertDialog.Title>
                <AlertDialog.Description>
                  This AlertDialog uses the sm size variant. Each size provides
                  different dimensions while maintaining usability.
                </AlertDialog.Description>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <AlertDialog.Cancel text="Cancel" />
                <AlertDialog.Action text="OK" />
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Root>

          <AlertDialog.Root open={baseOpen} onOpenChange={setBaseOpen}>
            <AlertDialog.Trigger asChild>
              <Button text="BASE" variant="outline" />
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title>Size: BASE</AlertDialog.Title>
                <AlertDialog.Description>
                  This AlertDialog uses the base size variant. Each size
                  provides different dimensions while maintaining usability.
                </AlertDialog.Description>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <AlertDialog.Cancel text="Cancel" />
                <AlertDialog.Action text="OK" />
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Root>

          <AlertDialog.Root open={lgOpen} onOpenChange={setLgOpen}>
            <AlertDialog.Trigger asChild>
              <Button text="LG" variant="outline" />
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Header>
                <AlertDialog.Title>Size: LG</AlertDialog.Title>
                <AlertDialog.Description>
                  This AlertDialog uses the lg size variant. Each size provides
                  different dimensions while maintaining usability.
                </AlertDialog.Description>
              </AlertDialog.Header>
              <AlertDialog.Footer>
                <AlertDialog.Cancel text="Cancel" />
                <AlertDialog.Action text="OK" />
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Root>
        </View>
      </Surface>

      <Surface style={{ padding: 16, gap: 12 }}>
        <Text weight="semibold" size="lg">
          Features
        </Text>
        <View style={{ gap: 8 }}>
          <Text>• shadcn-identical API with compound components</Text>
          <Text>• Variant support (default, destructive, warning)</Text>
          <Text>• Async action support with Promise handling</Text>
          <Text>• Built-in loading states and error boundaries</Text>
          <Text>• Auto-variant selection based on dialog type</Text>
          <Text>• Size variants (sm, base, lg)</Text>
          <Text>• Footer orientation (horizontal, vertical)</Text>
          <Text>• Built with @gorhom/portal for reliable z-index</Text>
          <Text>• Custom animations with scale effect</Text>
          <Text>• Perfect TypeScript with zero any types</Text>
          <Text>• No automatic backdrop/back button close (by design)</Text>
        </View>
      </Surface>
    </ScrollView>
  );
}
