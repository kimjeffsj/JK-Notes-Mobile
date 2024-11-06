import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const Input = ({ label, error, ...props }: InputProps) => {
  return (
    <View className="mb-4">
      {label && <Text className="text-gray-700 mb-2">{label}</Text>}

      <TextInput
        className={`w-full h-12 border rounded-lg px4 ${
          error ? "border-e-red-500" : "border-gray-300"
        }`}
        {...props}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};

export default Input;
