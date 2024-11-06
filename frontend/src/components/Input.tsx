import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
}

const Input = ({
  label,
  error,
  containerClassName = "",
  inputClassName = "",
  ...props
}: InputProps) => {
  const baseContainer = "mb-4";
  const baseInput = "w-full border rounded-lg px-4 py-2";
  const errorStyle = error ? "border-red-500" : "border-gray-300";

  return (
    <View className={`${baseContainer} ${containerClassName}`}>
      {label && <Text className="text-gray-700 mb-2">{label}</Text>}
      <TextInput
        className={`${baseInput} ${errorStyle} ${inputClassName}`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};

export default Input;
