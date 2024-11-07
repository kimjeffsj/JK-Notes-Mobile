import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Link, router } from "expo-router";

import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";
import { login } from "@/shared/store/slices/authSlice";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      console.log("Attempting login with frontend:", { email });
      await dispatch(login({ email, password })).unwrap();
    } catch (error: any) {
      console.log("Login error details: ", error);
      Alert.alert("Error", error.message || "Login Failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white">
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold mb-8 text-center">
          Welcome Back!
        </Text>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter your email"
          error={error}
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
        />

        <Button title="Login" onPress={handleLogin} isLoading={isLoading} />

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          className="mt-4"
        >
          <Text className="text-center text-blue-500">
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
