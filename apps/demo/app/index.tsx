import {
  ScrollView,
  View,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Button, Surface, Text, useThemeName } from "@leshi/ui-rn";
import { Link } from "expo-router";

const componentScreens = [
  { name: "AlertDialog", href: "/components/AlertDialog" },
  { name: "Avatar", href: "/components/Avatar" },
  { name: "Badge", href: "/components/Badge" },
  { name: "Button", href: "/components/Button" },
  { name: "Checkbox", href: "/components/Checkbox" },
  { name: "Radio", href: "/components/Radio" },
  { name: "Divider", href: "/components/Divider" },
  { name: "Dialog", href: "/components/Dialog" },
  { name: "Modal", href: "/components/Modal" },
  { name: "Progress", href: "/components/Progress" },
  { name: "Skeleton", href: "/components/Skeleton" },
  { name: "Surface", href: "/components/Surface" },
  { name: "Switch", href: "/components/Switch" },
  { name: "Toggle", href: "/components/Toggle" },
  { name: "Text", href: "/components/Text" },
  { name: "TextArea", href: "/components/TextArea" },
  { name: "TextInput", href: "/components/TextInput" },
];

const exampleScreens = [
  { name: "Music Player", href: "/examples/MusicPlayer" },
  { name: "Registration", href: "/examples/Registration" },
  { name: "User Profile", href: "/examples/UserProfile" },
  { name: "Settings", href: "/examples/Settings" },
  { name: "Login", href: "/examples/Login" },
  { name: "Gallery", href: "/examples/Gallery" },
];

export default function Index() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const columns = isWeb && width > 1024 ? 4 : isWeb && width > 768 ? 3 : isWeb && width > 480 ? 2 : 1;
  const buttonWidth = isWeb ? `${100 / columns}%` : "100%";
  const { themeName } = useThemeName();

  const renderButtons = (screens: { name: string; href: string }[]) => (
    <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4 }}>
      {screens.map((s) => (
        <View key={s.name} style={{ width: buttonWidth as any, padding: 4 }}>
          <Link href={s.href as any} asChild>
            <Button text={s.name} fullWidth />
          </Link>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
      <View style={{ alignItems: "center" }}>
        <Text weight="bold" size="4xl" style={{ marginBottom: 4 }}>
          Leshi UI
        </Text>
        <Text variant="mutedForeground" style={{ marginBottom: 8 }}>
          Cross-platform components built with React Native
        </Text>
        <Link href="/Theme" asChild>
          <Button text={`Theme: ${themeName}`} variant="secondary" />
        </Link>
      </View>
      <Surface style={{ padding: 16 }}>
        <Text weight="bold" size="xl" style={{ marginBottom: 12 }}>
          Components
        </Text>
        {renderButtons(componentScreens)}
      </Surface>
      <Surface style={{ padding: 16 }}>
        <Text weight="bold" size="xl" style={{ marginBottom: 12 }}>
          Examples
        </Text>
        {renderButtons(exampleScreens)}
      </Surface>
    </ScrollView>
  );
}
