import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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
  Text,
} from "@leshi/ui-rn";
import Spinner from "@leshi/ui-rn/ui/spinner";

export default function App() {
  const [checked, setChecked] = useState(false);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text weight="bold" size="lg">Buttons</Text>
      <View style={styles.row}>
        <Button text="Primary" variant="primary" />
        <Button text="Secondary" variant="secondary" />
        <Button text="Outline" variant="outline" />
        <Button text="Ghost" variant="ghost" />
        <Button text="Destructive" variant="destructive" />
      </View>

      <Text weight="bold" size="lg">Badges</Text>
      <View style={styles.row}>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Danger</Badge>
      </View>

      <Text weight="bold" size="lg">Checkbox</Text>
      <View style={styles.row}>
        <Checkbox size="sm" checked />
        <Checkbox size="md" checked />
        <Checkbox size="lg" checked />
      </View>

      <Text weight="bold" size="lg">Switch</Text>
      <View style={styles.row}>
        <Switch size="sm" checked={checked} onCheckedChange={() => setChecked(!checked)} />
        <Switch size="md" checked={checked} onCheckedChange={() => setChecked(!checked)} />
        <Switch size="lg" checked={checked} onCheckedChange={() => setChecked(!checked)} />
      </View>

      <Text weight="bold" size="lg">Avatar</Text>
      <View style={styles.row}>
        <Avatar size="sm">
          <AvatarImage source={{uri: "https://avatars.githubusercontent.com/u/1000105?v=4"}} />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar size="md">
          <AvatarImage source={{uri: "https://avatars.githubusercontent.com/u/1000105?v=4"}} />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage source={{uri: "https://avatars.githubusercontent.com/u/1000105?v=4"}} />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </View>

      <Text weight="bold" size="lg">Progress</Text>
      <View style={styles.row}>
        <Progress value={25} size="sm" />
        <Progress value={50} size="md" />
        <Progress value={75} size="lg" />
        <Progress value={40} variant="secondary" />
        <Progress value={60} variant="destructive" />
      </View>

      <Text weight="bold" size="lg">Text Input</Text>
      <Surface style={{ width: "100%" }}>
        <TextInput label="Username" placeholder="Type here" />
      </Surface>

      <Text weight="bold" size="lg">Spinner</Text>
      <Spinner />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
});
