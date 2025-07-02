import { ScrollView, View, Image } from "react-native";
import { Button, Text, TextInput, Switch } from "@leshi/ui-rn";
import { useState } from "react";

export default function RegistrationExample() {
  const [terms, setTerms] = useState(false);
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Image
        source={{
          uri:
            "https://images.unsplash.com/photo-1521790945508-bf2a36314e85?auto=format&fit=crop&w=600&q=80",
        }}
        style={{ width: "100%", height: 150, borderRadius: 8, marginBottom: 12 }}
      />
      <Text weight="bold" size="xl" style={{ marginBottom: 12 }}>
        Registration Form
      </Text>
      <TextInput placeholder="Name" style={{ marginBottom: 12 }} />
      <TextInput placeholder="Email" style={{ marginBottom: 12 }} />
      <TextInput placeholder="Password" secureTextEntry style={{ marginBottom: 12 }} />
      <TextInput placeholder="Confirm Password" secureTextEntry style={{ marginBottom: 12 }} />
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
<<<<<<< HEAD
        <Switch size="md" checked={terms} onCheckedChange={setTerms} />
=======
        <Switch size="base" checked={terms} onCheckedChange={setTerms} />
>>>>>>> feature/import-alias
        <Text style={{ marginLeft: 8 }}>Accept Terms</Text>
      </View>
      <Button text="Register" />
    </ScrollView>
  );
}
