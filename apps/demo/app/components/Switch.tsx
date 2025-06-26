import React, { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Switch, Text, Surface } from "@leshi/ui-rn";

// Demo section component for better organization
interface DemoSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const DemoSection: React.FC<DemoSectionProps> = ({ title, description, children }) => (
  <Surface style={styles.section} elevation="md" radius="lg" padding="lg">
    <Text weight="bold" size="lg" style={styles.sectionTitle}>
      {title}
    </Text>
    {description && (
      <Text variant="mutedForeground" style={styles.sectionDescription}>
        {description}
      </Text>
    )}
    <View style={styles.sectionContent}>
      {children}
    </View>
  </Surface>
);

// Row component for consistent layout
interface DemoRowProps {
  label: string;
  children: React.ReactNode;
  description?: string;
}

const DemoRow: React.FC<DemoRowProps> = ({ label, children, description }) => (
  <View style={styles.demoRow}>
    <View style={styles.demoRowContent}>
      <View style={styles.demoRowInfo}>
        <Text weight="medium" style={styles.demoRowLabel}>
          {label}
        </Text>
        {description && (
          <Text variant="mutedForeground" size="sm">
            {description}
          </Text>
        )}
      </View>
      <View style={styles.demoRowControls}>
        {children}
      </View>
    </View>
  </View>
);

export default function SwitchScreen() {
  // States for different demos
  const [basicChecked, setBasicChecked] = useState(false);
  const [controlledChecked, setControlledChecked] = useState(true);
  const [disabledOn, setDisabledOn] = useState(true);
  const [disabledOff, setDisabledOff] = useState(false);
  
  // Settings demo states
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoSync: true,
    locationServices: false,
    analytics: false,
    biometrics: true,
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    weeklyDigest: true,
  });

  const handleSettingChange = (key: keyof typeof settings) => (checked: boolean) => {
    setSettings(prev => ({ ...prev, [key]: checked }));
  };

  const handleNotificationChange = (key: keyof typeof notificationSettings) => (checked: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: checked }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text weight="bold" size="2xl" style={styles.title}>
          Switch
        </Text>
        <Text variant="mutedForeground" size="lg" style={styles.subtitle}>
          A control that allows users to toggle between on and off states. 
          Supports controlled/uncontrolled modes, multiple variants, and accessibility features.
        </Text>
      </View>

      {/* Basic Usage */}
      <DemoSection 
        title="Basic Usage" 
        description="Simple switch with controlled state management"
      >
        <DemoRow 
          label="Basic Switch"
          description="Click to toggle between on and off"
        >
          <Switch 
            checked={basicChecked}
            onCheckedChange={setBasicChecked}
            aria-label="Basic switch example"
          />
        </DemoRow>
        
        <DemoRow label="Current State">
          <Text weight="medium" variant={basicChecked ? "primary" : "mutedForeground"}>
            {basicChecked ? "🟢 On" : "⚪ Off"}
          </Text>
        </DemoRow>
      </DemoSection>

      {/* Sizes */}
      <DemoSection 
        title="Sizes" 
        description="Available size variants for different use cases"
      >
        <DemoRow label="Small (sm)" description="Compact size for dense layouts">
          <Switch 
            size="sm" 
            checked={controlledChecked}
            onCheckedChange={setControlledChecked}
            aria-label="Small switch"
          />
        </DemoRow>
        
        <DemoRow label="Base (default)" description="Standard size for most use cases">
          <Switch 
            size="base" 
            checked={controlledChecked}
            onCheckedChange={setControlledChecked}
            aria-label="Base size switch"
          />
        </DemoRow>
        
        <DemoRow label="Large (lg)" description="Larger size for emphasis or accessibility">
          <Switch 
            size="lg" 
            checked={controlledChecked}
            onCheckedChange={setControlledChecked}
            aria-label="Large switch"
          />
        </DemoRow>
      </DemoSection>

      {/* Variants */}
      <DemoSection 
        title="Variants" 
        description="Visual style variants for different contexts"
      >
        <DemoRow 
          label="Default Variant" 
          description="Uses primary theme colors"
        >
          <Switch 
            variant="default"
            checked={controlledChecked}
            onCheckedChange={setControlledChecked}
            aria-label="Default variant switch"
          />
        </DemoRow>
        
        <DemoRow 
          label="Destructive Variant" 
          description="For potentially harmful actions"
        >
          <Switch 
            variant="destructive"
            checked={controlledChecked}
            onCheckedChange={setControlledChecked}
            aria-label="Destructive variant switch"
          />
        </DemoRow>
      </DemoSection>

      {/* States */}
      <DemoSection 
        title="States" 
        description="Different switch states including disabled"
      >        
        <DemoRow 
          label="Disabled States" 
          description="Switches in disabled state"
        >
          <View style={styles.rowGroup}>
            <Switch 
              disabled 
              checked={false}
              aria-label="Disabled off switch"
            />
            <Text style={styles.spacing}>Disabled Off</Text>
          </View>
        </DemoRow>
        
        <DemoRow label="">
          <View style={styles.rowGroup}>
            <Switch 
              disabled 
              checked={true}
              aria-label="Disabled on switch"
            />
            <Text style={styles.spacing}>Disabled On</Text>
          </View>
        </DemoRow>

        <DemoRow 
          label="Interactive States" 
          description="Try toggling these switches"
        >
          <View style={styles.interactiveGroup}>
            <View style={styles.interactiveItem}>
              <Switch 
                checked={disabledOn}
                onCheckedChange={setDisabledOn}
                aria-label="Interactive switch 1"
              />
              <Text style={styles.spacing}>Switch 1</Text>
            </View>
            <View style={styles.interactiveItem}>
              <Switch 
                checked={disabledOff}
                onCheckedChange={setDisabledOff}
                aria-label="Interactive switch 2"
              />
              <Text style={styles.spacing}>Switch 2</Text>
            </View>
          </View>
        </DemoRow>
      </DemoSection>

      {/* Real-world Example: App Settings */}
      <DemoSection 
        title="Real-world Example" 
        description="App settings panel with multiple toggle switches"
      >
        <DemoRow label="">
          <View style={styles.settingsContainer}>
            <Text weight="semibold" style={styles.settingsTitle}>
              App Settings
            </Text>
            
            <View style={styles.settingsList}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text weight="medium">Push Notifications</Text>
                  <Text variant="mutedForeground" size="sm">
                    Receive notifications on your device
                  </Text>
                </View>
                <Switch 
                  checked={settings.notifications}
                  onCheckedChange={handleSettingChange('notifications')}
                  aria-label="Push notifications setting"
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text weight="medium">Dark Mode</Text>
                  <Text variant="mutedForeground" size="sm">
                    Use dark theme across the app
                  </Text>
                </View>
                <Switch 
                  checked={settings.darkMode}
                  onCheckedChange={handleSettingChange('darkMode')}
                  aria-label="Dark mode setting"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text weight="medium">Auto Sync</Text>
                  <Text variant="mutedForeground" size="sm">
                    Automatically sync data when online
                  </Text>
                </View>
                <Switch 
                  checked={settings.autoSync}
                  onCheckedChange={handleSettingChange('autoSync')}
                  aria-label="Auto sync setting"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text weight="medium">Location Services</Text>
                  <Text variant="mutedForeground" size="sm">
                    Allow app to use your location
                  </Text>
                </View>
                <Switch 
                  checked={settings.locationServices}
                  onCheckedChange={handleSettingChange('locationServices')}
                  aria-label="Location services setting"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text weight="medium">Share Analytics</Text>
                  <Text variant="mutedForeground" size="sm">
                    Help improve the app by sharing usage data
                  </Text>
                </View>
                <Switch 
                  variant="destructive"
                  checked={settings.analytics}
                  onCheckedChange={handleSettingChange('analytics')}
                  aria-label="Analytics sharing setting"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text weight="medium">Biometric Auth</Text>
                  <Text variant="mutedForeground" size="sm">
                    Use fingerprint or face ID to unlock
                  </Text>
                </View>
                <Switch 
                  checked={settings.biometrics}
                  onCheckedChange={handleSettingChange('biometrics')}
                  aria-label="Biometric authentication setting"
                />
              </View>
            </View>

            {/* Settings Summary */}
            <View style={styles.settingsSummary}>
              <Text variant="mutedForeground" size="sm">
                {Object.values(settings).filter(Boolean).length} of {Object.keys(settings).length} settings enabled
              </Text>
            </View>
          </View>
        </DemoRow>
      </DemoSection>

      {/* Notification Settings Example */}
      <DemoSection 
        title="Notification Settings" 
        description="Grouped settings with different switch variants"
      >
        <DemoRow label="">
          <View style={styles.settingsContainer}>
            <Text weight="semibold" style={styles.settingsTitle}>
              Notification Preferences
            </Text>
            
            <View style={styles.settingsList}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text weight="medium">Email Notifications</Text>
                  <Text variant="mutedForeground" size="sm">
                    Receive updates via email
                  </Text>
                </View>
                <Switch 
                  size="sm"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={handleNotificationChange('emailNotifications')}
                  aria-label="Email notifications"
                />
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text weight="medium">Push Notifications</Text>
                  <Text variant="mutedForeground" size="sm">
                    Instant notifications on device
                  </Text>
                </View>
                <Switch 
                  size="sm"
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={handleNotificationChange('pushNotifications')}
                  aria-label="Push notifications"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text weight="medium">SMS Notifications</Text>
                  <Text variant="mutedForeground" size="sm">
                    Text message alerts
                  </Text>
                </View>
                <Switch 
                  size="sm"
                  variant="destructive"
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={handleNotificationChange('smsNotifications')}
                  aria-label="SMS notifications"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text weight="medium">Weekly Digest</Text>
                  <Text variant="mutedForeground" size="sm">
                    Summary email every week
                  </Text>
                </View>
                <Switch 
                  size="sm"
                  checked={notificationSettings.weeklyDigest}
                  onCheckedChange={handleNotificationChange('weeklyDigest')}
                  aria-label="Weekly digest"
                />
              </View>
            </View>
          </View>
        </DemoRow>
      </DemoSection>

      {/* Accessibility Features */}
      <DemoSection 
        title="Accessibility Features" 
        description="Built-in accessibility support for screen readers and assistive technologies"
      >
        <DemoRow 
          label="Screen Reader Support" 
          description="Automatic state announcements"
        >
          <Switch 
            checked={basicChecked}
            onCheckedChange={setBasicChecked}
            aria-label="Accessibility example switch"
            aria-describedby="switch-description"
          />
        </DemoRow>
        
        <Text variant="mutedForeground" size="sm" style={styles.accessibilityNote}>
          This switch includes proper ARIA labels, state descriptions, and screen reader support.
          Current state is automatically announced when changed.
        </Text>
      </DemoSection>

      {/* API Usage Examples */}
      <DemoSection 
        title="Usage Examples" 
        description="Common implementation patterns and API usage"
      >
        <View style={styles.codeSection}>
          <Text weight="medium" style={styles.codeTitle}>Controlled Switch:</Text>
          <Surface style={styles.codeBlock} variant="muted" padding="base" radius="md">
            <Text size="sm" style={[styles.codeText, { fontFamily: 'monospace' }]}>
{`const [checked, setChecked] = useState(false);

<Switch 
  checked={checked}
  onCheckedChange={setChecked}
  size="base"
  variant="default"
/>`}
            </Text>
          </Surface>
        </View>
        
        <View style={styles.codeSection}>
          <Text weight="medium" style={styles.codeTitle}>Uncontrolled Switch:</Text>
          <Surface style={styles.codeBlock} variant="muted" padding="base" radius="md">
            <Text size="sm" style={[styles.codeText, { fontFamily: 'monospace' }]}>
{`<Switch 
  defaultChecked={true}
  onCheckedChange={(checked) => {
    console.log('Switch toggled:', checked);
  }}
  aria-label="Enable notifications"
/>`}
            </Text>
          </Surface>
        </View>

        <View style={styles.codeSection}>
          <Text weight="medium" style={styles.codeTitle}>Settings Panel Pattern:</Text>
          <Surface style={styles.codeBlock} variant="muted" padding="base" radius="md">
            <Text size="sm" style={[styles.codeText, { fontFamily: 'monospace' }]}>
{`const [settings, setSettings] = useState({
  notifications: true,
  darkMode: false,
});

const handleChange = (key) => (checked) => {
  setSettings(prev => ({ ...prev, [key]: checked }));
};

<Switch 
  checked={settings.notifications}
  onCheckedChange={handleChange('notifications')}
/>`}
            </Text>
          </Surface>
        </View>
      </DemoSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 20,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 24,
  },
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  sectionDescription: {
    marginBottom: 16,
    lineHeight: 20,
  },
  sectionContent: {
    gap: 12,
  },
  demoRow: {
    paddingVertical: 4,
  },
  demoRowContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44, // Accessibility minimum touch target
  },
  demoRowInfo: {
    flex: 1,
    marginRight: 16,
  },
  demoRowLabel: {
    marginBottom: 2,
  },
  demoRowControls: {
    alignItems: "center",
  },
  rowGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  spacing: {
    marginLeft: 12,
  },
  interactiveGroup: {
    flexDirection: "row",
    gap: 20,
  },
  interactiveItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsContainer: {
    width: "100%",
  },
  settingsTitle: {
    marginBottom: 16,
    fontSize: 16,
  },
  settingsList: {
    gap: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    minHeight: 56,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingsSummary: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  accessibilityNote: {
    marginTop: 8,
    fontStyle: "italic",
  },
  codeSection: {
    marginBottom: 16,
  },
  codeTitle: {
    marginBottom: 8,
  },
  codeBlock: {
    marginBottom: 4,
  },
  codeText: {
    lineHeight: 18,
  },
});