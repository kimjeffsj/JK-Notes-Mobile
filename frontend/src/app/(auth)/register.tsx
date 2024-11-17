import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { register } from "@/shared/store/slices/authSlice";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      await dispatch(
        register({ name, email, password, confirmPassword })
      ).unwrap();
      Alert.alert("Success", "Registration successful", [
        { text: "OK", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Registration failed, try again");
    }
  };

  return (
    <ScrollView
      className="bg-background dark:bg-background-dark"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold mb-8 text-center text-primary dark:text-primary-dark">
          Create Account
        </Text>

        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          containerClassName="mb-4"
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter your email"
          error={error}
          containerClassName="mb-4"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
          containerClassName="mb-4"
        />

        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirm your password"
          containerClassName="mb-6"
        />

        <Button
          title="Register"
          onPress={handleRegister}
          isLoading={isLoading}
        />

        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className="mt-4"
        >
          <Text className="text-center text-accent dark:text-accent">
            Already have an account? Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
