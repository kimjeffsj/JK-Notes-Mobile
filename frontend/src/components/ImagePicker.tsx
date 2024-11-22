import { useTheme } from "@/shared/hooks/useTheme";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Alert, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ImagePickerProps {
  onImageSelect: (base64: string) => Promise<void>;
  maxSize?: number;
}

const ImagePickerComponent = ({
  onImageSelect,
  maxSize = 5, // 5MB
}: ImagePickerProps): JSX.Element => {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // Requesting Permission for photo library
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Needed",
        "Sorry, we need camera roll permissions to upload images."
      );
      return false;
    }
    return true;
  };

  const handleImagePick = async (useCamera: boolean = false): Promise<void> => {
    try {
      setIsLoading(true);

      // Check permission
      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      // Select Image options
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets[0]) {
        const image = result.assets[0];

        const fileInfo = await FileSystem.getInfoAsync(image.uri);
        if (fileInfo.exists) {
          const fileSizeMB = fileInfo.size / (1024 * 1024);
          if (fileSizeMB > maxSize) {
            Alert.alert(
              "File Too Large",
              `Image size should be less than ${maxSize}MB`
            );
            return;
          }
        }

        const base64 = await FileSystem.readAsStringAsync(image.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await onImageSelect(`data:image/jpeg;base64,${base64}`);
      }
    } catch (error) {
      console.error("Image pick error: ", error);
      Alert.alert("Error", "Failed to pick image");
    } finally {
      setIsLoading(false);
    }
  };

  // Showing Image Options
  const showImagePickerOptions = (): void => {
    Alert.alert("Add Image", "Choose image source", [
      {
        text: "Camera",
        onPress: () => handleImagePick(true),
      },
      {
        text: "Gallery",
        onPress: () => handleImagePick(false),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };
  return (
    <TouchableOpacity
      onPress={showImagePickerOptions}
      disabled={isLoading}
      className="items-center justify-center border-2 border-dashed border-border dark:border-border-dark rounded-lg p-4"
    >
      <Ionicons
        name="image-outline"
        size={24}
        color={isDark ? "#ffffff" : "#1a1a1a"}
      />
      <Text className="text-text-secondary dark:text-text-dark-secondary mt-2">
        {isLoading ? "Processing..." : "Add image"}
      </Text>
    </TouchableOpacity>
  );
};

export default ImagePickerComponent;
