<<<<<<< HEAD
import { useInit } from "../hooks/useInit";
import { ThemeProvider, useTheme } from "@leshi/ui-rn";
import { Stack } from "expo-router";
=======
import { ThemeProvider, useTheme, ModalProvider } from "@leshi/ui-rn";
import { Stack } from "expo-router";
import { useInit } from "../hooks/useInit";
>>>>>>> feature/import-alias

const App = () => {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.foreground,
<<<<<<< HEAD
        contentStyle: {
          backgroundColor: colors.background,
          maxWidth: 600,
=======
        headerTitleStyle: {
          fontFamily: "Inter_600SemiBold",
        },
        headerTitleAlign: "center",
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
>>>>>>> feature/import-alias
          width: "100%",
          alignSelf: "center",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="Theme" options={{ title: "Theme" }} />
<<<<<<< HEAD
      <Stack.Screen name="components/AlertDialog" options={{ title: "AlertDialog" }} />
      <Stack.Screen name="components/Avatar" options={{ title: "Avatar" }} />
      <Stack.Screen name="components/Badge" options={{ title: "Badge" }} />
      <Stack.Screen name="components/Button" options={{ title: "Button" }} />
      <Stack.Screen name="components/Checkbox" options={{ title: "Checkbox" }} />
      <Stack.Screen name="components/Radio" options={{ title: "Radio" }} />
      <Stack.Screen name="components/Divider" options={{ title: "Divider" }} />
      <Stack.Screen name="components/Dialog" options={{ title: "Dialog" }} />
      <Stack.Screen name="components/Progress" options={{ title: "Progress" }} />
      <Stack.Screen name="components/Surface" options={{ title: "Surface" }} />
      <Stack.Screen name="components/Switch" options={{ title: "Switch" }} />
      <Stack.Screen name="components/Text" options={{ title: "Text" }} />
      <Stack.Screen name="components/TextInput" options={{ title: "TextInput" }} />
      <Stack.Screen name="examples/MusicPlayer" options={{ title: "Music Player" }} />
      <Stack.Screen name="examples/Registration" options={{ title: "Registration" }} />
      <Stack.Screen name="examples/UserProfile" options={{ title: "User Profile" }} />
=======
      <Stack.Screen
        name="components/AlertDialog"
        options={{ title: "AlertDialog" }}
      />
      <Stack.Screen name="components/Avatar" options={{ title: "Avatar" }} />
      <Stack.Screen name="components/Badge" options={{ title: "Badge" }} />
      <Stack.Screen name="components/Button" options={{ title: "Button" }} />
      <Stack.Screen
        name="components/Checkbox"
        options={{ title: "Checkbox" }}
      />
      <Stack.Screen name="components/Radio" options={{ title: "Radio" }} />
      <Stack.Screen name="components/Divider" options={{ title: "Divider" }} />
      <Stack.Screen name="components/Dialog" options={{ title: "Dialog" }} />
      <Stack.Screen
        name="components/Progress"
        options={{ title: "Progress" }}
      />
      <Stack.Screen
        name="components/Skeleton"
        options={{ title: "Skeleton" }}
      />
      <Stack.Screen name="components/Surface" options={{ title: "Surface" }} />
      <Stack.Screen name="components/Modal" options={{ title: "Modal" }} />
      <Stack.Screen name="components/Switch" options={{ title: "Switch" }} />
      <Stack.Screen name="components/Text" options={{ title: "Text" }} />
      <Stack.Screen
        name="components/TextArea"
        options={{ title: "TextArea" }}
      />
      <Stack.Screen
        name="components/TextInput"
        options={{ title: "TextInput" }}
      />
      <Stack.Screen
        name="examples/MusicPlayer"
        options={{ title: "Music Player" }}
      />
      <Stack.Screen
        name="examples/Registration"
        options={{ title: "Registration" }}
      />
      <Stack.Screen
        name="examples/UserProfile"
        options={{ title: "User Profile" }}
      />
>>>>>>> feature/import-alias
      <Stack.Screen name="examples/Settings" options={{ title: "Settings" }} />
      <Stack.Screen name="examples/Login" options={{ title: "Login" }} />
      <Stack.Screen name="examples/Gallery" options={{ title: "Gallery" }} />
    </Stack>
  );
};

const RootLayout = () => {
  const { isLoading } = useInit();
  if (isLoading) {
    return null;
  }
  return (
<<<<<<< HEAD
    <ThemeProvider defaultMode="manual">
      <App />
    </ThemeProvider>
=======
    <ModalProvider>
      <ThemeProvider defaultMode="manual">
        <App />
      </ThemeProvider>
    </ModalProvider>
>>>>>>> feature/import-alias
  );
};

export default RootLayout;
