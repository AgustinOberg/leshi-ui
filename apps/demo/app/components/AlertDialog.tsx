import { useState } from "react";
import { ScrollView } from "react-native";
import { AlertDialog, Button, Text } from "@leshi/ui-rn";

export default function AlertDialogScreen() {
  const [open, setOpen] = useState(false);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Trigger asChild>
          <Button text="Show Alert" />
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            <AlertDialog.Description>
              This action cannot be undone.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel asChild>
              <Button text="Cancel" />
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button text="Delete" variant="destructive" />
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </ScrollView>
  );
}
