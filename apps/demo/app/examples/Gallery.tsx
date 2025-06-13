import { ScrollView, Image, View } from "react-native";
import { Surface } from "@leshi/ui-rn";

const images = [
  "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80",
];

export default function GalleryExample() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
      {images.map((uri) => (
        <Surface key={uri} style={{ width: "48%", marginBottom: 12 }}>
          <Image source={{ uri }} style={{ width: "100%", height: 150, borderRadius: 8 }} />
        </Surface>
      ))}
    </ScrollView>
  );
}
