import { Text, View } from "react-native";
import { Button } from "@leshi/ui-rn";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button text="Hola mundo" variant="secondary" />
    </View>
  );
}
