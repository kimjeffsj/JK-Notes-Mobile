import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ImageViewerProps {
  images: Array<{ url: string }>;
  initialIndex?: number;
  visible: boolean;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  initialIndex = 0,
  visible,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const newIndex = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(newIndex);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        <View className="absolute top-12 right-4 z-10 flex-row items-center justify-between w-full px-4">
          <Text className="text-white text-lg">
            {currentIndex + 1} / {images.length}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="p-2 bg-black/50 rounded-full"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          className="flex-1"
        >
          {images.map((image, index) => (
            <View
              key={index}
              style={{ width: screenWidth, height: screenHeight }}
              className="justify-center items-center"
            >
              <Image
                source={{
                  uri: `${process.env.EXPO_PUBLIC_API_URL}/${image.url}`,
                }}
                style={{
                  width: screenWidth,
                  height: screenHeight * 0.8,
                }}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ImageViewer;
