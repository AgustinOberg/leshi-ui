import { ScrollView } from "react-native";
import { Button, Text } from "@leshi/ui-rn";
import { Link } from "expo-router";

const componentScreens = [
  { name: "AlertDialog", href: "/components/AlertDialog" },
  { name: "Avatar", href: "/components/Avatar" },
  { name: "Badge", href: "/components/Badge" },
  { name: "Button", href: "/components/Button" },
  { name: "Checkbox", href: "/components/Checkbox" },
  { name: "Divider", href: "/components/Divider" },
  { name: "Dialog", href: "/components/Dialog" },
  { name: "Progress", href: "/components/Progress" },
  { name: "Surface", href: "/components/Surface" },
  { name: "Switch", href: "/components/Switch" },
  { name: "Text", href: "/components/Text" },
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
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 12 }}>
        Components
      </Text>
      {componentScreens.map((s) => (
        <Link key={s.name} href={s.href} asChild>
          <Button text={s.name} style={{ marginBottom: 8 }} />
        </Link>
      ))}
      <Text weight="bold" size="xl" style={{ marginVertical: 12 }}>
        Examples
      </Text>
      {exampleScreens.map((s) => (
        <Link key={s.name} href={s.href} asChild>
          <Button text={s.name} style={{ marginBottom: 8 }} />
        </Link>
      ))}
      <Link href="/Theme" asChild>
        <Button text="Theme" variant="secondary" style={{ marginTop: 12 }} />
      </Link>
    </ScrollView>
  );
}
