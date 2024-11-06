import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { Link } from "expo-router";

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
      await dispatch(login({ email, password })).unwrap();
    } catch (error: any) {
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

        <Link href="/(auth)/register" asChild>
          <Button
            title="Create an Account"
            variant="secondary"
            onPress={() => {}}
            className="mt-4"
          />
        </Link>
      </View>
    </ScrollView>
  );
}
