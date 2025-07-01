import { ScrollView, View } from 'react-native';
import {
  CircleProgress,
  AnimatedCircleProgress,
  Text,
  Button,
  useTheme,
} from '@leshi/ui-rn';
import { useState } from 'react';

export default function CircleProgressScreen() {
  const [value, setValue] = useState(30);
  const { colors } = useTheme();
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Circle Progress
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Circular indicator built with react-native-svg.
      </Text>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <AnimatedCircleProgress
          size={120}
          width={12}
          fill={value}
          tintColor={colors.primary}
          backgroundColor={colors.muted}
        >{(fill) => <Text>{Math.round(fill)}</Text>}</AnimatedCircleProgress>
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <Button text="-" size="icon" onPress={() => setValue((v) => Math.max(0, v - 10))} style={{ marginRight: 8 }} />
          <Button text="+" size="icon" onPress={() => setValue((v) => Math.min(100, v + 10))} />
        </View>
      </View>
      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Static
      </Text>
      <CircleProgress
        size={100}
        width={10}
        fill={75}
        tintColor={colors.primary}
        backgroundColor={colors.muted}
        style={{ marginBottom: 12 }}
      />
    </ScrollView>
  );
}
