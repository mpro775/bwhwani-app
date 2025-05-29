import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Video, ResizeMode } from "expo-av";
import COLORS from "../../../constants/colors";
import { ProductMedia } from "../../../types/product";

interface MediaPickerSectionProps {
  media: ProductMedia[];
  onPickMedia: () => Promise<void>;
}

const MediaPickerSection: React.FC<MediaPickerSectionProps> = ({ media, onPickMedia }) => {
  return (
    <View>
      <TouchableOpacity style={styles.imageButton} onPress={onPickMedia}>
        <Text style={styles.imageButtonText}>
          {media.length > 0 ? "إضافة وسائط أخرى" : "اختيار وسائط"}
        </Text>
      </TouchableOpacity>

      {media?.map((item, index) =>
        item.type === "image" ? (
          <Image
            key={index}
            source={{ uri: `http://192.168.1.102:3000${item.uri}` }} // Make sure this URI is correct for your local server
            style={styles.previewImage}
          />
        ) : (
          <Video
            key={index}
            source={{ uri: `http://192.168.1.102:3000${item.uri}` }} // Make sure this URI is correct for your local server
            style={styles.previewImage}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 8,
  },
  imageButtonText: {
    color: "white",
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
  },
  previewImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
});

export default MediaPickerSection;