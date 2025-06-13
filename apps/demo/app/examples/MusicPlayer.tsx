import { View, Image } from "react-native";
import { Surface, Text, Progress, Button } from "@leshi/ui-rn";
import { useState } from "react";

export default function MusicPlayerExample() {
  const [progress, setProgress] = useState(30);
  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Surface style={{ padding: 16, alignItems: "center" }}>
        <Image
          source={{
            uri:
              "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=200&q=80",
          }}
          style={{ width: 200, height: 200, marginBottom: 16, borderRadius: 8 }}
        />
        <Text weight="bold" style={{ marginBottom: 4 }}>
          Song Title
        </Text>
        <Text style={{ marginBottom: 12 }}>Artist Name</Text>
        <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 12 }}>
          <Button
            text="-"
            size="icon"
            onPress={() => setProgress((p) => Math.max(0, p - 10))}
            style={{ marginRight: 8 }}
          />
          <Progress value={progress} style={{ flex: 1 }} />
          <Button
            text="+"
            size="icon"
            onPress={() => setProgress((p) => Math.min(100, p + 10))}
            style={{ marginLeft: 8 }}
          />
        </View>
        <Button text="Play" />
      </Surface>
    </View>
  );
}
