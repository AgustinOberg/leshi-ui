import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Dialog, Text } from "@leshi/ui-rn";

export default function DialogScreen() {
  const [open, setOpen] = useState(false);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Dialog
      </Text>
      <Text style={{ marginBottom: 12 }}>
        A modal container that can display any custom content.
      </Text>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button text="Open Dialog" />
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Dialog Title</Dialog.Title>
            <Dialog.Description>This is a dialog.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button text="Close" />
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </ScrollView>
  );
}
