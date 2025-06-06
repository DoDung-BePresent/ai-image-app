import { Color } from "@/utils/Color";
import {
  clearImageHistory,
  deleteImageFromHistory,
  GeneratedImage,
  getImageHistory,
} from "@/utils/storage";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const imageWidth = (windowWidth - 60) / 2;

export default function History() {
  const [images, setImages] = useState<GeneratedImage[]>([]);

  const loadImages = async () => {
    const history = await getImageHistory();
    setImages(history);
  };

  useFocusEffect(
    useCallback(() => {
      loadImages();
    }, [])
  );

  const handleDeleteImage = (id: string) => {
    Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteImageFromHistory(id);
          loadImages();
        },
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All History",
      "Are you sure you want to delete all images?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearImageHistory();
            loadImages();
          },
        },
      ]
    );
  };

  const renderImageItem = ({ item }: { item: GeneratedImage }) => (
    <View style={styles.imageItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDeleteImage(item.id)}
      >
        <FontAwesome5 name="trash" size={16} color={Color.white} />
      </TouchableOpacity>
      <View style={styles.imageInfo}>
        <Text style={styles.promptText} numberOfLines={2}>
          {item.prompt}
        </Text>
        <Text style={styles.metaText}>
          {item.model.split("/").pop()} • {item.aspectRatio}
        </Text>
        <Text style={styles.dateText}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {images.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {images.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome5 name="image" size={64} color={Color.placeholder} />
          <Text style={styles.emptyText}>No images generated yet</Text>
          <Text style={styles.emptySubText}>
            Generate your first AI image to see it here
          </Text>
        </View>
      ) : (
        <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Color.text,
  },
  clearButton: {
    color: Color.accent,
    fontSize: 16,
    fontWeight: "500",
  },
  listContainer: {
    padding: 10,
  },
  imageItem: {
    flex: 1,
    margin: 10,
    backgroundColor: Color.dark,
    borderRadius: 10,
    borderColor: Color.accent,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: imageWidth,
    objectFit: "cover",
    resizeMode: "cover",
  },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  imageInfo: {
    padding: 12,
  },
  promptText: {
    color: Color.text,
    fontSize: 12,
    marginBottom: 4,
  },
  metaText: {
    color: Color.placeholder,
    fontSize: 10,
    marginBottom: 2,
  },
  dateText: {
    color: Color.placeholder,
    fontSize: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    color: Color.text,
    fontSize: 18,
    fontWeight: "500",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubText: {
    color: Color.placeholder,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
