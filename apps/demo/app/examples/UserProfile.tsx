import { View } from "react-native";
import { Avatar, AvatarImage, AvatarFallback, Surface, Text, Button } from "@leshi/ui-rn";

export default function UserProfileExample() {
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Surface style={{ padding: 16, alignItems: "center" }}>
        <Avatar size="xl" style={{ marginBottom: 12 }}>
          <AvatarImage source={{ uri: "https://placehold.co/100x100" }} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <Text weight="bold" size="lg" style={{ marginBottom: 4 }}>
          Jane Doe
        </Text>
        <Text style={{ marginBottom: 12 }}>@janedoe</Text>
        <Button text="Follow" />
      </Surface>
    </View>
  );
}
