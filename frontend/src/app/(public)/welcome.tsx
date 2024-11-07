import Button from "@/components/Button";
import Feature from "@/components/Feature";
import { router } from "expo-router";
import { useRef } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";

export default function Welcome() {
  const scrollViewRef = useRef(null);
  const screenHeight = Dimensions.get("window").height;

  const scrollToFeatures = () => {
    scrollViewRef.current?.scrollTo({
      y: screenHeight * 0.9,
      animated: true,
    });
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
    >
      <View className="h-screen justify-center items-center px-6">
        <Text className="text-4xl font-bold mb-4">Welcome to JK Notes!</Text>

        <Text className="text-gray-600 text-center mb-8">
          Your personal not-taking companion! Organize your thoughts, ideas, and
          memories in one place.
        </Text>

        <View className="w-50 flex-row justify-between space-x-4 mx-8">
          <View className="flex-1 mx-3">
            <Button
              title="Get Started"
              onPress={() => router.push("/(auth)/login")}
            />
          </View>
          <View className="flex-1 mx-3">
            <Button title="Learn More" onPress={scrollToFeatures} />
          </View>
        </View>
      </View>

      <View className="min-h-screen px-6 pt-12">
        <Text className="text-3xl font-bold mb-4">Why JK Notes?</Text>

        <View className="space-y-4 ">
          <Feature
            title="Simple & Intuitive"
            description="Easy to use interface for quick note-taking"
          />
          <Feature
            title="Secure"
            description="Your notes are private and protected"
          />
          <Feature
            title="Organized"
            description="Keep your thoughts structured and accessible"
          />
          <Feature
            title="Free to use"
            description="All core features available at no cost"
          />
          <Feature
            title="Sync Everywhere"
            description="Access your notes across all your devices seamlessly"
          />

          <Feature
            title="Offline Access"
            description="Create and edit notes anytime, even without internet"
          />
          <Feature
            title="Quick Search"
            description="Find any note instantly with powerful search features"
          />
        </View>

        <View className="mt-12 mb-16 items-center">
          <Text className="text-2xl font-semibold mb-6 text-center">
            Ready to get started?
          </Text>
          <View className="w-full space-y-2">
            <Button
              title="Sign up for Free!"
              className="my-1"
              onPress={() => router.push("/(auth)/register")}
            />
            <Button
              title="Already have an account? Login"
              variant="secondary"
              className="my-1"
              onPress={() => router.push("/(auth)/login")}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
