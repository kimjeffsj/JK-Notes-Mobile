import { ActivityIndicator, View } from "react-native";

const Loading = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default Loading;
