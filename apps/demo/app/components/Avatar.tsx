import { ScrollView } from "react-native";
import { Avatar, AvatarImage, AvatarFallback, Text } from "@leshi/ui-rn";

const sizes: any[] = ["sm", "md", "lg", "xl"];

export default function AvatarScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Avatar
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Displays a user image with a fallback when no picture is available.
      </Text>
      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Sizes
      </Text>
      {sizes.map((s) => (
        <Avatar key={s} size={s} style={{ marginBottom: 12 }}>
          <AvatarImage source={{ uri: "https://placehold.co/100x100" }} />
          <AvatarFallback>{s}</AvatarFallback>
        </Avatar>
      ))}
    </ScrollView>
  );
}
