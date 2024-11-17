import { Text, View } from "react-native";

interface FeatureProps {
  title: string;
  description: string;
}

function Feature({ title, description }: FeatureProps) {
  return (
    <View className="my-3 px-10">
      <Text className="font-bold text-lg mb-1 text-primary dark:text-primary-dark">
        {title}
      </Text>
      <Text className="text-text-secondary dark:text-text-dark-secondary text-center">
        {description}
      </Text>
    </View>
  );
}

export default Feature;
