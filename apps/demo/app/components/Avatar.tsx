import { ScrollView } from "react-native";
import { Avatar, AvatarImage, AvatarFallback, Text } from "@leshi/ui-rn";

const sizes: any[] = ["sm", "md", "lg", "xl"];

export default function AvatarScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 12 }}>
        Avatar Sizes
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
