import { ScrollView, View } from "react-native";
import { Skeleton, Text, Surface, Button } from "@leshi/ui-rn";
import { useState } from "react";

export default function SkeletonScreen() {
  const [animated, setAnimated] = useState(true);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text weight="bold" size="xl" style={{ marginBottom: 4 }}>
        Skeleton
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Use to show a placeholder while content is loading.
      </Text>
      
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <Text style={{ marginRight: 12 }}>Animation:</Text>
        <Button 
          text={animated ? "Enabled" : "Disabled"} 
          variant={animated ? "primary" : "secondary"}
          onPress={() => setAnimated(!animated)}
        />
      </View>

      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Basic Usage
      </Text>
      <View style={{ marginBottom: 16 }}>
        <Skeleton animated={animated} style={{ marginBottom: 8 }} />
        <Skeleton width="75%" height={16} animated={animated} style={{ marginBottom: 8 }} />
        <Skeleton width="50%" height={16} animated={animated} />
      </View>

      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Sizes
      </Text>
      <View style={{ marginBottom: 16 }}>
        <Skeleton width="100%" height={12} animated={animated} style={{ marginBottom: 8 }} />
        <Skeleton width="100%" height={20} animated={animated} style={{ marginBottom: 8 }} />
        <Skeleton width="100%" height={32} animated={animated} style={{ marginBottom: 8 }} />
        <Skeleton width="100%" height={48} animated={animated} />
      </View>

      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Shapes
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 12 }}>
        <View style={{ alignItems: "center" }}>
          <Skeleton width={50} height={50} borderRadius={25} animated={animated} />
          <Text size="sm" style={{ marginTop: 4 }}>Circle</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Skeleton width={50} height={50} borderRadius={8} animated={animated} />
          <Text size="sm" style={{ marginTop: 4 }}>Rounded</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Skeleton width={50} height={50} borderRadius={0} animated={animated} />
          <Text size="sm" style={{ marginTop: 4 }}>Square</Text>
        </View>
      </View>

      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Card Layout Example
      </Text>
      <Surface style={{ padding: 16, marginBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <Skeleton width={60} height={60} borderRadius={30} animated={animated} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Skeleton width="80%" height={16} animated={animated} style={{ marginBottom: 8 }} />
            <Skeleton width="60%" height={14} animated={animated} style={{ marginBottom: 8 }} />
            <Skeleton width="40%" height={12} animated={animated} />
          </View>
        </View>
      </Surface>

      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        List Item Example
      </Text>
      <View style={{ marginBottom: 16 }}>
        {[1, 2, 3].map((item) => (
          <Surface key={item} style={{ padding: 12, marginBottom: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Skeleton width={40} height={40} borderRadius={20} animated={animated} style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Skeleton width="70%" height={14} animated={animated} style={{ marginBottom: 6 }} />
                <Skeleton width="50%" height={12} animated={animated} />
              </View>
              <Skeleton width={60} height={24} borderRadius={12} animated={animated} />
            </View>
          </Surface>
        ))}
      </View>

      <Text weight="bold" size="lg" style={{ marginBottom: 8 }}>
        Custom Dimensions
      </Text>
      <View style={{ marginBottom: 16 }}>
        <Skeleton width={120} height={80} borderRadius={8} animated={animated} style={{ marginBottom: 8 }} />
        <Skeleton width="90%" height={6} animated={animated} style={{ marginBottom: 8 }} />
        <Skeleton width={200} height={40} borderRadius={20} animated={animated} />
      </View>
    </ScrollView>
  );
}