import { View, Image } from "react-native";
import { Text, TextInput, Button, Surface } from "@leshi/ui-rn";
import { useState } from "react";

export default function LoginExample() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Surface style={{ padding: 16 }}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=600&q=80" }}
          style={{ width: "100%", height: 120, borderRadius: 8, marginBottom: 12 }}
        />
        <Text weight="bold" size="xl" style={{ marginBottom: 12 }}>
          Login
        </Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{ marginBottom: 12 }}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={pass}
          onChangeText={setPass}
          style={{ marginBottom: 12 }}
        />
        <Button text="Sign In" />
      </Surface>
    </View>
  );
}
