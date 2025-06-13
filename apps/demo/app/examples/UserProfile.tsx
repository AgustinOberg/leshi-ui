import { View } from "react-native";
import { Avatar, AvatarImage, AvatarFallback, Surface, Text, Button } from "@leshi/ui-rn";

export default function UserProfileExample() {
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Surface style={{ padding: 16, alignItems: "center" }}>
        <Avatar size="xl" style={{ marginBottom: 12 }}>
          <AvatarImage
            source={{
              uri:
                "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=100&q=80",
            }}
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <Text weight="bold" size="lg" style={{ marginBottom: 4 }}>
          Jane Doe
        </Text>
        <Text style={{ marginBottom: 4 }}>@janedoe</Text>
        <Text style={{ marginBottom: 12, textAlign: "center" }}>
          Coffee enthusiast and amateur photographer living life one day at a time.
        </Text>
        <Button text="Follow" style={{ marginBottom: 8 }} />
        <Button text="Message" variant="secondary" />
      </Surface>
    </View>
  );
}
