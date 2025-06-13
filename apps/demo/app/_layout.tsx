import { useInit } from "@/hooks/useInit";
import { ThemeProvider, useTheme } from "@leshi/ui-rn";
import { Stack } from "expo-router";

const App = () => {
  const { colors } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.foreground,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home Screen" }} />
    </Stack>
  );
};

const RootLayout = () => {
  const { isLoading } = useInit();
  if (isLoading) {
    return null;
  }
  return (
    <ThemeProvider defaultMode="manual">
      <App />
    </ThemeProvider>
  );
};

export default RootLayout;
