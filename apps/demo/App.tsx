// ProfileScreen.tsx
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Checkbox,
  Input,
  Progress,
  Radio,
  Switch,
  Text,
  Textarea,
} from "@leshi/ui";
import React from "react";
import { ScrollView, View, SafeAreaView } from "react-native";
import { useUnistyles } from "react-native-unistyles";
import { useFonts } from "@expo-google-fonts/chathura/useFonts";
import { Chathura_100Thin } from "@expo-google-fonts/chathura/100Thin";
import { Chathura_300Light } from "@expo-google-fonts/chathura/300Light";
import { Chathura_400Regular } from "@expo-google-fonts/chathura/400Regular";
import { Chathura_700Bold } from "@expo-google-fonts/chathura/700Bold";
import { Chathura_800ExtraBold } from "@expo-google-fonts/chathura/800ExtraBold";

const ProfileScreen: React.FC = () => {
  const { theme } = useUnistyles();
  const [marketing, setMarketing] = React.useState(true);
  const [gender, setGender] = React.useState("female");
  const [terms, setTerms] = React.useState(false);
  const [progress, setProgress] = React.useState(80);
  let [fontsLoaded] = useFonts({
    Chathura_100Thin,
    Chathura_300Light,
    Chathura_400Regular,
    Chathura_700Bold,
    Chathura_800ExtraBold,
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{
          padding: theme.gap(4),
          gap: theme.gap(6),
          backgroundColor: theme.colors.background,
        }}
      >
        {/* aHeader */}
        <View style={{ alignItems: "center", gap: theme.gap(1) }}>
          <Avatar size="xl">
            <AvatarImage source={{ uri: "https://i.praevatar.cc/300" }} />
            <AvatarFallback>AG</AvatarFallback>
          </Avatar>
          <Text size="3xl" weight="bold">
            Hola, fuente
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: theme.colors.foreground,
            }}
          >
            Ana Gómez
          </Text>
          <Badge variant="secondary" style={{ marginHorizontal: "auto" }}>
            Activa
          </Badge>
        </View>

        {/* Inputs */}
        <View style={{ gap: theme.gap(2) }}>
          <Input label="Nombre" placeholder="Ana" size="md" />
          <Input label="Apellido" placeholder="Gómez" size="md" />
          <Input
            label="Email"
            placeholder="ana@email.com"
            keyboardType="email-address"
            size="md"
          />
          <Textarea label="Bio" placeholder="Algo sobre ti..." size="md" />
        </View>

        {/* Preferencias */}
        <View style={{ gap: theme.gap(1) }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>Género</Text>
          <Radio.Group value={gender} onValueChange={setGender} direction="row">
            <Radio.Item value="female" label="Femenino" />
            <Radio.Item value="male" label="Masculino" />
            <Radio.Item value="other" label="Otro" />
          </Radio.Group>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.gap(2),
              marginTop: theme.gap(4),
            }}
          >
            <Switch
              value={marketing}
              onValueChange={setMarketing}
              size="md"
              accessibilityLabel="Recibir novedades"
            />
            <Text style={{ fontSize: 14 }}>
              Recibir novedades y promociones
            </Text>
          </View>
        </View>

        {/* Seguridad */}
        <View style={{ gap: theme.gap(1) }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>Progreso</Text>
          <Progress value={progress} size="lg" />
        </View>

        {/* Términos y botón */}
        <View style={{ gap: theme.gap(2) }}>
          <Checkbox
            size="lg"
            labelPos="right"
            checked={terms}
            onCheckedChange={setTerms}
            label="Acepto los términos y condiciones"
          />
          <Button loading text="Guardar cambios" variant="ghost" fullWidth />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
