import { ScrollView, View } from "react-native";
import { Skeleton, Text } from "@leshi/ui-rn";

export default function SkeletonScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Skeleton
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Placeholder preview of content before data loads.
      </Text>
      <View style={{ gap: 8 }}>
        <Skeleton style={{ width: "100%", height: 24 }} />
        <Skeleton style={{ width: "60%", height: 24 }} />
        <Skeleton style={{ width: "40%", height: 24 }} />
      </View>
    </ScrollView>
  );
}
