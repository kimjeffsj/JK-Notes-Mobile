import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/shared/hooks/useTheme";
import Loading from "../Loading";
import api from "@/utils/api";
import { UploadedImage } from "@/shared/types/note/note";

interface ImageUploadProps {
  onImagesUploaded: (images: UploadedImage[]) => void;
  existingImages?: UploadedImage[];
  noteId?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesUploaded,
  existingImages = [],
  noteId,
}) => {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>(existingImages);

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || libraryStatus !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera and media library permissions to use this feature."
      );
      return false;
    }
    return true;
  };

  const uploadImages = async (
    selectedImages: ImagePicker.ImagePickerAsset[]
  ) => {
    try {
      const formData = new FormData();
      selectedImages.forEach((image, index) => {
        const fileExtension = image.uri.split(".").pop() || "jpg";
        const filename = `image-${Date.now()}-${index}.${fileExtension}`;

        // @ts-ignore
        formData.append("images", {
          uri:
            Platform.OS === "ios"
              ? image.uri.replace("file://", "")
              : image.uri,
          name: filename,
          type: `image/${fileExtension}`,
        });
      });

      console.log("Uploading images with formData:", formData);

      const response = await api.post("/notes/upload-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: [(data) => data],
      });

      console.log("Upload response:", response.data);

      if (response.data.images) {
        const newImages: UploadedImage[] = response.data.images;
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onImagesUploaded(updatedImages);
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to upload images");
    }
  };

  const handleImageSelection = async (mode: "camera" | "gallery") => {
    try {
      if (!(await requestPermissions())) return;

      setIsLoading(true);

      if (mode === "camera") {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

        if (!result.canceled && result.assets.length > 0) {
          await uploadImages(result.assets);
        }
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsMultipleSelection: true,
          selectionLimit: 10,
          quality: 0.8,
        });

        if (!result.canceled && result.assets.length > 0) {
          await uploadImages(result.assets);
        }
      }
    } catch (error) {
      console.error("Selection error:", error); // debug
      Alert.alert("Error", "Failed to select images");
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = async (index: number) => {
    try {
      const image = images[index];
      if (image._id && noteId) {
        console.log("Removing image:", { noteId, imageId: image._id });

        await api.delete(`/notes/${noteId}/images/${image._id}`);
        console.log("Image deleted from server");
      }

      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      onImagesUploaded(newImages);
    } catch (error) {
      console.error("Remove image error:", error);
      Alert.alert("Error", "Failed to remove image. Please try again.");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        <View className="flex-row p-2">
          <TouchableOpacity
            onPress={() => handleImageSelection("camera")}
            className="w-20 h-20 bg-background-secondary dark:bg-background-dark-secondary rounded-lg mr-2 items-center justify-center"
          >
            <Ionicons
              name="camera-outline"
              size={24}
              color={isDark ? "#ffffff" : "#1a1a1a"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleImageSelection("gallery")}
            className="w-20 h-20 bg-background-secondary dark:bg-background-dark-secondary rounded-lg mr-2 items-center justify-center"
          >
            <Ionicons
              name="images-outline"
              size={24}
              color={isDark ? "#ffffff" : "#1a1a1a"}
            />
          </TouchableOpacity>

          {images.map((image, index) => (
            <View key={index} className="relative mr-2">
              <Image
                source={{
                  uri: `${process.env.EXPO_PUBLIC_API_URL}/${image.thumbnail}`,
                }}
                className="w-20 h-20 rounded-lg"
                resizeMode="cover"
                onError={(error) => {
                  console.error(
                    "Image loading error:",
                    error.nativeEvent.error
                  );
                }}
              />
              <TouchableOpacity
                onPress={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
              >
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
export default ImageUpload;
