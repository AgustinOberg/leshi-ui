<<<<<<< HEAD
import { ScrollView } from "react-native";
import { Badge, Text } from "@leshi/ui-rn";

const variants: any[] = [
  "primary",
  "secondary",
=======
import { ScrollView, View } from "react-native";
import { Badge, Text, type BadgeVariant, type BadgeSize } from "@leshi/ui-rn";

const variants: BadgeVariant[] = [
  "default",
  "secondary", 
>>>>>>> feature/import-alias
  "destructive",
  "outline",
];

<<<<<<< HEAD
=======
const sizes: BadgeSize[] = ["sm", "default", "lg"];

>>>>>>> feature/import-alias
export default function BadgeScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Badge
      </Text>
<<<<<<< HEAD
      <Text style={{ marginBottom: 12 }}>
        Small label used to highlight an item or status.
      </Text>
      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Variants
      </Text>
      {variants.map((v) => (
        <Badge
          key={v}
          variant={v}
          textOptions={{ style: { textTransform: "capitalize" } }}
          style={{ marginBottom: 8 }}
        >
          {v}
        </Badge>
      ))}
=======
      <Text style={{ marginBottom: 16 }}>
        Small label used to highlight an item or status.
      </Text>
      
      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Variants
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {variants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </View>

      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Sizes
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 16 }}>
        {sizes.map((size) => (
          <Badge key={size} size={size}>
            {size}
          </Badge>
        ))}
      </View>

      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Real World Examples
      </Text>
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Text>Status:</Text>
          <Badge variant="default" size="sm">Active</Badge>
        </View>
        
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Text>Priority:</Text>
          <Badge variant="destructive">High</Badge>
        </View>
        
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Text>Category:</Text>
          <Badge variant="secondary">Design</Badge>
        </View>
        
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Text>Count:</Text>
          <Badge variant="outline" size="sm">12</Badge>
        </View>
        
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Text>Version:</Text>
          <Badge variant="outline">v2.1.0</Badge>
        </View>
      </View>
>>>>>>> feature/import-alias
    </ScrollView>
  );
}
