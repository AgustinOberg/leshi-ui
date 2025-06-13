import { View, Image } from "react-native";
import { Surface, Text, Progress, Button } from "@leshi/ui-rn";

export default function MusicPlayerExample() {
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Surface style={{ padding: 16, alignItems: "center" }}>
        <Image
          source={{ uri: "https://placehold.co/200x200" }}
          style={{ width: 200, height: 200, marginBottom: 16 }}
        />
        <Text weight="bold" style={{ marginBottom: 4 }}>
          Song Title
        </Text>
        <Text style={{ marginBottom: 12 }}>Artist Name</Text>
        <Progress value={40} style={{ width: "100%", marginBottom: 12 }} />
        <Button text="Play" />
      </Surface>
    </View>
  );
}
