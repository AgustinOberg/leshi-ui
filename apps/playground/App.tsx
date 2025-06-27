import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Checkbox,
  Progress,
  Surface,
  Switch,
  TextInput,
  Text,
  useTheme,
  AlertDialog,
  Dialog,
  ThemeProvider,
} from "@leshi/ui-rn";
import { Inter_100Thin } from "@expo-google-fonts/inter/100Thin";
import { Inter_200ExtraLight } from "@expo-google-fonts/inter/200ExtraLight";
import { Inter_300Light } from "@expo-google-fonts/inter/300Light";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
import { Inter_800ExtraBold } from "@expo-google-fonts/inter/800ExtraBold";
import { Inter_900Black } from "@expo-google-fonts/inter/900Black";
import { Inter_100Thin_Italic } from "@expo-google-fonts/inter/100Thin_Italic";
import { Inter_200ExtraLight_Italic } from "@expo-google-fonts/inter/200ExtraLight_Italic";
import { Inter_300Light_Italic } from "@expo-google-fonts/inter/300Light_Italic";
import { Inter_400Regular_Italic } from "@expo-google-fonts/inter/400Regular_Italic";
import { Inter_500Medium_Italic } from "@expo-google-fonts/inter/500Medium_Italic";
import { Inter_600SemiBold_Italic } from "@expo-google-fonts/inter/600SemiBold_Italic";
import { Inter_700Bold_Italic } from "@expo-google-fonts/inter/700Bold_Italic";
import { Inter_800ExtraBold_Italic } from "@expo-google-fonts/inter/800ExtraBold_Italic";
import { Inter_900Black_Italic } from "@expo-google-fonts/inter/900Black_Italic";

import { useFonts } from "@expo-google-fonts/inter";

function App() {
  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
    Inter_100Thin_Italic,
    Inter_200ExtraLight_Italic,
    Inter_300Light_Italic,
    Inter_400Regular_Italic,
    Inter_500Medium_Italic,
    Inter_600SemiBold_Italic,
    Inter_700Bold_Italic,
    Inter_800ExtraBold_Italic,
    Inter_900Black_Italic,
  });
  const [checked, setChecked] = useState(false);
  const { colors } = useTheme();
  if (!fontsLoaded) return null;
  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text weight="bold" size="lg">
        Buttons
      </Text>
      <View style={styles.row}>
        <Button text="Primary" variant="primary" />
        <Button text="Secondary" variant="secondary" />
        <Button text="Outline" variant="outline" />
        <Button text="Ghost" variant="ghost" />
        <Button text="Destructive" variant="destructive" />
      </View>

      <Text weight="bold" size="lg">
        Badges
      </Text>
      <View style={styles.row}>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Danger</Badge>
      </View>

      <Text weight="bold" size="lg">
        Checkbox
      </Text>
      <View style={styles.row}>
        <Checkbox size="sm" checked />
        <Checkbox size="md" checked />
        <Checkbox size="lg" checked />
      </View>

      <Text weight="bold" size="lg">
        Switch
      </Text>
      <View style={styles.row}>
        <Switch
          size="sm"
          checked={checked}
          onCheckedChange={() => setChecked(!checked)}
        />
        <Switch
          size="md"
          checked={checked}
          onCheckedChange={() => setChecked(!checked)}
        />
        <Switch
          size="lg"
          checked={checked}
          onCheckedChange={() => setChecked(!checked)}
        />
      </View>
      <Text weight="black">This is sample text</Text>
      <Text weight="bold" size="lg">
        Avatar
      </Text>
      <View style={styles.row}>
        <Avatar size="sm">
          <AvatarImage
            source={{
              uri: "https://avatars.githubusercontent.com/u/1000105?v=4",
            }}
          />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar size="md">
          <AvatarImage
            source={{
              uri: "https://avatars.githubusercontent.com/u/1000105?v=4",
            }}
          />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            source={{
              uri: "https://avatars.githubusercontent.com/u/1000105?v=4",
            }}
          />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </View>

      <Text weight="bold" size="lg">
        Progress
      </Text>
      <View style={styles.row}>
        <Progress value={25} size="sm" />
        <Progress value={50} size="md" />
        <Progress value={75} size="lg" />
        <Progress value={40} variant="secondary" />
        <Progress value={60} variant="destructive" />
      </View>

      <Text weight="bold" size="lg">
        Text Input
      </Text>
      <Surface style={{ width: "100%" }}>
        <TextInput label="Username" placeholder="Type here" />
      </Surface>

      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <Button text="Delete account" variant="destructive" />
        </AlertDialog.Trigger>

        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
            <AlertDialog.Description>
              This action cannot be undone. It will permanently delete your
              account.
            </AlertDialog.Description>
          </AlertDialog.Header>

          <AlertDialog.Footer orientation="column">
            <AlertDialog.Cancel />
            <AlertDialog.Action
              text="Yes, delete"
              onPress={() => {
                /* your logic */
              }}
            />
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Button text="Open dialog" />
        </Dialog.Trigger>

        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Edit profile</Dialog.Title>
            <Dialog.Description>Make changes and save them.</Dialog.Description>
          </Dialog.Header>

          {/* form content */}

          <Dialog.Footer orientation="row">
            <Dialog.Close asChild>
              <Button variant="outline" text="Cancel" />
            </Dialog.Close>
            <Button text="Save" />
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
});

const MainApp = () => {
  return (
    <ThemeProvider defaultTheme="spotify">
      <App />
    </ThemeProvider>
  );
};
export default MainApp;
