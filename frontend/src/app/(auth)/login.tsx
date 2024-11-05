import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router } from "expo-router";

import { login } from "@/shared/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useRedux";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    try {
      await dispatch(login({ email, password })).unwrap();
      router.replace("/(app)/dashboard");
    } catch (error) {}
  };

  return (
    <View className="flex-1 justify-center px-4 bg-white">
      <Text className="text-3xl font-bold mb-8 text-center">Welcome Back!</Text>
      {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}
      <TextInput
        className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-6"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className={`w-full h-12 rounded-lg justify-center items-center ${
          isLoading ? "bg-gray-400" : "bg-blue-500"
        }`}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text className="text-white font-semibold">
          {isLoading ? "Logging in ..." : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-4"
        onPress={() => router.push("/(auth)/register")}
      >
        <Text className="text-center text-blue-500">
          Don't have an account? Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
}
