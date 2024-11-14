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
  const baseInput = "w-full border rounded-lg px-4 py-2 bg-background";
  const errorStyle = error ? "border-red-500" : "border-border";

  return (
    <View className={`${containerClassName}`}>
      {label && <Text className="text-text mb-2 font-medium">{label}</Text>}
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
