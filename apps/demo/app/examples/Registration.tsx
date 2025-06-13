import { ScrollView, View } from "react-native";
import { Button, Text, TextInput, Switch } from "@leshi/ui-rn";
import { useState } from "react";

export default function RegistrationExample() {
  const [terms, setTerms] = useState(false);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 12 }}>
        Registration Form
      </Text>
      <TextInput placeholder="Name" style={{ marginBottom: 12 }} />
      <TextInput placeholder="Email" style={{ marginBottom: 12 }} />
      <TextInput placeholder="Password" secureTextEntry style={{ marginBottom: 12 }} />
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Switch size="md" checked={terms} onCheckedChange={setTerms} />
        <Text style={{ marginLeft: 8 }}>Accept Terms</Text>
      </View>
      <Button text="Register" />
    </ScrollView>
  );
}
