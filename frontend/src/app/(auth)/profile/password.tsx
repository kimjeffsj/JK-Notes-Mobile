import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { useTheme } from "@/shared/hooks/useTheme";
import { updateProfile } from "@/shared/store/slices/authSlice";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

export default function ChangePassword() {
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  // Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Error states
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Validate password
  const validateNewPassword = (password: string) => {
    if (!password) {
      setNewPasswordError("New password is required");
      return false;
    }

    if (password === currentPassword) {
      setNewPasswordError(
        "New password must be different from current password"
      );
      return false;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setNewPasswordError(
        "Password must contain at least 6 characters, including uppercase, lowercase, and numbers"
      );
      return false;
    }
    setNewPasswordError("");
    return true;
  };

  const validateConfirmPassword = (confirm: string) => {
    if (!confirm) {
      setConfirmPasswordError("Please confirm your new password");
      return false;
    }
    if (confirm !== newPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const validateCurrentPassword = (password: string) => {
    if (!password) {
      setCurrentPasswordError("Current password is required");
      return false;
    }
    setCurrentPasswordError("");
    return true;
  };

  // Validate form
  const isFormValid = () => {
    const isCurrentValid = validateCurrentPassword(currentPassword);
    const isNewValid = validateNewPassword(newPassword);
    const isConfirmValid = validateConfirmPassword(confirmNewPassword);

    return isCurrentValid && isNewValid && isConfirmValid;
  };

  // Handle input changes
  const handleCurrentPasswordChange = (text: string) => {
    setCurrentPassword(text);
    if (currentPasswordError) validateCurrentPassword(text);
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
    if (newPasswordError) validateNewPassword(text);
    if (confirmNewPassword && confirmPasswordError) {
      validateConfirmPassword(confirmNewPassword);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmNewPassword(text);
    if (confirmPasswordError) validateConfirmPassword(text);
  };

  // Submit
  const handleSubmit = async () => {
    if (!isFormValid()) {
      return;
    }

    try {
      await dispatch(
        updateProfile({
          currentPassword,
          newPassword,
          confirmNewPassword,
        })
      ).unwrap();

      Alert.alert("Success", "Password has been changed. Please login again.", [
        {
          text: "OK",
          onPress: () => router.push("/(auth)/login"),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to change password");
    }
  };

  useEffect(() => {
    if (currentPassword) validateCurrentPassword(currentPassword);
    if (newPassword) validateNewPassword(newPassword);
    if (confirmNewPassword) validateConfirmPassword(confirmNewPassword);
  }, []);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header
        showBack
        title="Change Password"
        onBackPress={() => router.push("/(app)/settings")}
      />
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-background-secondary dark:bg-background-dark-secondary rounded-lg p-4 mb-4">
          <Input
            label="Current Password"
            value={currentPassword}
            onChangeText={handleCurrentPasswordChange}
            placeholder="Enter your current password"
            secureTextEntry
            containerClassName="mb-4"
            inputClassName="bg-background dark:bg-background-dark"
            error={currentPasswordError}
            autoCapitalize="none"
          />

          <Input
            label="New Password"
            value={newPassword}
            onChangeText={handleNewPasswordChange}
            placeholder="Enter your new password"
            secureTextEntry
            containerClassName="mb-4"
            inputClassName="bg-background dark:bg-background-dark"
            error={newPasswordError}
            autoCapitalize="none"
          />

          <Input
            label="Confirm New Password"
            value={confirmNewPassword}
            onChangeText={handleConfirmPasswordChange}
            placeholder="Confirm your new password"
            secureTextEntry
            containerClassName="mb-0"
            inputClassName="bg-background dark:bg-background-dark"
            error={confirmPasswordError}
            autoCapitalize="none"
          />
        </View>

        <View className="px-4 mb-6">
          <Button
            title="Change Password"
            onPress={handleSubmit}
            isLoading={isLoading}
            disabled={!currentPassword || !newPassword || !confirmNewPassword}
            variant={
              currentPassword && newPassword && confirmNewPassword
                ? "primary"
                : "secondary"
            }
          />
        </View>
        {/* Password Requirements Guide */}
        <View className="px-4 pb-6">
          <View className="bg-background-secondary dark:bg-background-dark-secondary rounded-lg p-4">
            <Text className="text-sm font-medium text-primary dark:text-primary-dark mb-2">
              Password Requirements:
            </Text>
            <View className="space-y-1">
              {[
                "At least 6 characters long",
                "Include at least one uppercase letter",
                "Include at least one lowercase letter",
                "Include at least one number",
              ].map((requirement, index) => (
                <Text
                  key={index}
                  className="text-sm text-text-secondary dark:text-text-dark-secondary"
                >
                  • {requirement}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
