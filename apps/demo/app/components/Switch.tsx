import { ScrollView, View } from "react-native";
import { Switch, Text, type SwitchSize } from "@leshi/ui-rn";
import { useState } from "react";

const sizes: SwitchSize[] = ["sm", "default", "lg"];

export default function SwitchScreen() {
  const [basicSwitch, setBasicSwitch] = useState(false);
  const [sizeSwitches, setSizeSwitches] = useState<Record<SwitchSize, boolean>>({
    sm: false,
    default: true,
    lg: false,
  });
  const [settingSwitches, setSettingSwitches] = useState({
    notifications: true,
    darkMode: false,
    autoSave: true,
    analytics: false,
  });

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Switch
      </Text>
      <Text style={{ marginBottom: 16 }}>
        A toggle control for switching between checked and unchecked states.
      </Text>
      
      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Basic Usage
      </Text>
      <View style={{ marginBottom: 16 }}>
        <Switch
          checked={basicSwitch}
          onCheckedChange={setBasicSwitch}
        />
      </View>

      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Sizes
      </Text>
      <View style={{ gap: 12, marginBottom: 16 }}>
        {sizes.map((size) => (
          <View key={size} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Switch
              size={size}
              checked={sizeSwitches[size]}
              onCheckedChange={(checked) => 
                setSizeSwitches(prev => ({ ...prev, [size]: checked }))
              }
            />
            <Text>Size: {size}</Text>
          </View>
        ))}
      </View>

      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Disabled State
      </Text>
      <View style={{ gap: 12, marginBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Switch checked={true} onCheckedChange={() => {}} disabled />
          <Text>Disabled (on)</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Switch checked={false} onCheckedChange={() => {}} disabled />
          <Text>Disabled (off)</Text>
        </View>
      </View>

      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Settings Example
      </Text>
      <View style={{ gap: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text weight="medium">Enable Notifications</Text>
            <Text size="sm" variant="mutedForeground">
              Receive push notifications for updates
            </Text>
          </View>
          <Switch
            checked={settingSwitches.notifications}
            onCheckedChange={(checked) => 
              setSettingSwitches(prev => ({ ...prev, notifications: checked }))
            }
          />
        </View>
        
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text weight="medium">Dark Mode</Text>
            <Text size="sm" variant="mutedForeground">
              Switch to dark theme
            </Text>
          </View>
          <Switch
            checked={settingSwitches.darkMode}
            onCheckedChange={(checked) => 
              setSettingSwitches(prev => ({ ...prev, darkMode: checked }))
            }
          />
        </View>
        
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text weight="medium">Auto Save</Text>
            <Text size="sm" variant="mutedForeground">
              Automatically save changes
            </Text>
          </View>
          <Switch
            checked={settingSwitches.autoSave}
            onCheckedChange={(checked) => 
              setSettingSwitches(prev => ({ ...prev, autoSave: checked }))
            }
          />
        </View>
        
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text weight="medium">Analytics</Text>
            <Text size="sm" variant="mutedForeground">
              Help improve the app by sharing usage data
            </Text>
          </View>
          <Switch
            checked={settingSwitches.analytics}
            onCheckedChange={(checked) => 
              setSettingSwitches(prev => ({ ...prev, analytics: checked }))
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}
