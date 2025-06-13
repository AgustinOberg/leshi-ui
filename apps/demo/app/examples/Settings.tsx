import { ScrollView, View } from "react-native";
import { Text, Switch } from "@leshi/ui-rn";
import { useState } from "react";

export default function SettingsExample() {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [notifications, setNotifications] = useState(true);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
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
    </ScrollView>
  );
}
