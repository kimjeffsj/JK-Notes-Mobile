import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, SafeAreaView, ScrollView, Text, View } from "react-native";

import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { updateProfile } from "@/shared/store/slices/authSlice";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 50;

export default function EditProfile() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  // States
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");

  // Form validation states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Check if form has any changes
  const hasChanges = useMemo(() => {
    return name !== user?.name || email !== user?.email;
  }, [name, email, user]);

  // Validate name
  const validateName = (value: string) => {
    if (value.trim().length < 2) {
      setNameError("Name must be at least 2 characters long");
      return false;
    }
    if (value.length > MAX_NAME_LENGTH) {
      setNameError(`Name cannot exceed ${MAX_NAME_LENGTH} characters`);
      return false;
    }
    setNameError("");
    return true;
  };

  // Validate email
  const validateEmail = (value: string) => {
    if (!EMAIL_REGEX.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    validateName(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    validateEmail(value);
  };

  const handleSubmit = async () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);

    if (!isNameValid || !isEmailValid) {
      return;
    }

    if (!currentPassword) {
      Alert.alert(
        "Error",
        "Please enter your current password to make changes"
      );
    }

    if (!hasChanges) {
      Alert.alert("No Changes", "No changes have been made to your profile");
    }

    try {
      await dispatch(
        updateProfile({
          name: name !== user?.name ? name : undefined,
          email: email !== user?.email ? email : undefined,
          currentPassword,
        })
      ).unwrap();

      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => router.push("/(app)/settings") },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to update profile");
    }
  };

  useEffect(() => {
    validateName(name);
    validateEmail(email);
  }, []);

  return (
    <View className="flex-1 bg-background">
      <Header showBack title="Edit Profile" />
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-background-secondary rounded-lg p-4 mb-4">
          <View className="w-20 h-20 bg-accent rounded-full self-center mb-4 items-center justify-center">
            <Text className="text-white text-2xl font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Input
            label="Name"
            value={name}
            onChangeText={handleNameChange}
            placeholder="Enter your name"
            autoCapitalize="words"
            containerClassName="mb-4"
            inputClassName="bg-background"
            error={nameError}
            maxLength={MAX_NAME_LENGTH}
          />

          <Input
            label="Email"
            value={email}
            onChangeText={handleEmailChange}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerClassName="mb-4"
            inputClassName="bg-background"
            error={emailError}
          />

          <Input
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter your current password"
            secureTextEntry
            containerClassName="mb-0"
            inputClassName="bg-background"
          />
        </View>

        <View className="px-4 mb-6">
          <Button
            title="Save Changes"
            onPress={handleSubmit}
            isLoading={isLoading}
            disabled={!hasChanges || !currentPassword}
            variant={hasChanges && currentPassword ? "primary" : "secondary"}
          />
        </View>
      </ScrollView>
    </View>
  );
}
