import { ScrollView, View, Image } from "react-native";
import { Text, Switch } from "@leshi/ui-rn";
import { useState } from "react";

export default function SettingsExample() {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Image
        source={{
          uri:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
        }}
        style={{ width: "100%", height: 120, borderRadius: 8, marginBottom: 12 }}
      />
      <Text weight="bold" size="xl" style={{ marginBottom: 12 }}>
        Settings
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Text style={{ flex: 1 }}>Wi-Fi</Text>
        <Switch checked={wifi} onCheckedChange={setWifi} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Text style={{ flex: 1 }}>Bluetooth</Text>
        <Switch checked={bluetooth} onCheckedChange={setBluetooth} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Text style={{ flex: 1 }}>Notifications</Text>
        <Switch checked={notifications} onCheckedChange={setNotifications} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Text style={{ flex: 1 }}>Dark Mode</Text>
        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Text style={{ flex: 1 }}>Auto-Play Videos</Text>
        <Switch checked={autoPlay} onCheckedChange={setAutoPlay} />
      </View>
    </ScrollView>
  );
}
