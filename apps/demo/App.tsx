import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Checkbox,
  Progress,
  Surface,
  Switch,
  TextInput,
} from "@leshi/ui";

const App = () => {
  const [checked, setChecked] = useState(false);
  return (
    <View style={styles.container}>
      <Button variant="primary" size="lg" text="Hola mundo" />
      <Surface style={{ width: "100%" }}>
        <TextInput
          description="This is your public display name."
          label="Input"
          placeholder="Type here..."
        />
      </Surface>
      <Badge variant="destructive">Hola mundo</Badge>
      <Checkbox checked size="lg" />
      <Switch
        size="sm"
        checked={checked}
        onCheckedChange={() => setChecked(!checked)}
      />
      <Switch
        size="md"
        checked={checked}
        onCheckedChange={() => setChecked(!checked)}
      />
      <Switch
        size="lg"
        checked={checked}
        onCheckedChange={() => setChecked(!checked)}
      />
      <Avatar size="lg">
        <AvatarImage
          source={{
            uri: "https://avatars.githubusercontent.com/u/1000105?v=4",
          }}
        />
        <AvatarFallback>{"Agustin"}</AvatarFallback>
      </Avatar>
      <Progress value={44} />
      <Progress value={75} size="lg" />
      <Progress value={90} variant="secondary" />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 32,
  },
});
