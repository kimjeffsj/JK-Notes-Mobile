import { useTheme } from "@/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface ImageListProps {
  images: Array<{
    _id: string;
    url: string;
    caption?: string;
  }>;
  onDeleteImage?: (imageId: string) => void;
}

const ImageList: React.FC<ImageListProps> = ({ images, onDeleteImage }) => {
  const { isDark } = useTheme();

  if (!images || images.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-row p-2"
    >
      {images.map((image) => (
        <View key={image._id} className="mr-4 relative">
          <Image
            source={{
              uri: image.url.startsWith("data:")
                ? image.url
                : `${process.env.EXPO_PUBLIC_API_URL}${image.url}`,
            }}
            className="w-24 h-24 rounded-lg"
          />
          {onDeleteImage && (
            <TouchableOpacity
              onPress={() => onDeleteImage(image._id)}
              className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
          )}
          {image.caption && (
            <Text
              className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1"
              numberOfLines={1}
            >
              {image.caption}
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default ImageList;
