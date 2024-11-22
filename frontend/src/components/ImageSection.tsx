import { useAppDispatch } from "@/shared/hooks/useRedux";
import {
  deleteNoteImage,
  uploadNoteImage,
} from "@/shared/store/slices/noteSlice";
import type { NoteImage } from "@/shared/types/note/note";
import React from "react";
import { Alert, View } from "react-native";
import ImagePickerComponent from "./ImagePicker";
import ImageList from "./ImageList";

interface ImageSectionProps {
  noteId: string;
  images: NoteImage[];
  onImagesChange: (images: NoteImage[]) => void;
  disabled?: boolean;
}

const ImageSection = ({
  noteId,
  images,
  onImagesChange,
  disabled = false,
}: ImageSectionProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const handleImageSelect = async (base64: string) => {
    if (!noteId) {
      // Temp Image ID
      const tempImage: NoteImage = {
        _id: `temp_${Date.now()}`,
        url: base64,
        createdAt: new Date().toISOString(),
      };
      onImagesChange([...images, tempImage]);
      return;
    }

    try {
      const result = await dispatch(
        uploadNoteImage({
          noteId,
          imageData: base64,
        })
      ).unwrap();

      if (result.image) {
        onImagesChange([...images, result.image]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload image. Please try again");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    // Confirm Delete
    Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (imageId.startsWith("temp_")) {
            // If Temp image, delete immediately
            onImagesChange(images.filter((img) => img._id !== imageId));
            return;
          }

          if (!noteId) return;

          try {
            await dispatch(
              deleteNoteImage({
                noteId,
                imageId,
              })
            ).unwrap();
            onImagesChange(images.filter((img) => img._id !== imageId));
          } catch (error) {
            Alert.alert("Error", "Failed to delete image. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <View>
      {!disabled && (
        <ImagePickerComponent onImageSelect={handleImageSelect} maxSize={5} />
      )}
      {images.length > 0 && (
        <View className="mt-4">
          <ImageList
            images={images}
            onDeleteImage={!disabled ? handleDeleteImage : undefined}
          />
        </View>
      )}
    </View>
  );
};

export default ImageSection;
