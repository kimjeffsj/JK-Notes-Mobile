import { useTheme } from "@/shared/hooks/useTheme";
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
  const { isDark } = useTheme();

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-text dark:text-text-dark mb-2 font-medium">
          {label}
        </Text>
      )}
      <TextInput
        className={`w-full border rounded-lg px-4 py-2.5
          bg-background dark:bg-background-dark
          text-primary dark:text-primary-dark
          border-border dark:border-border-dark
          placeholder:text-text-secondary dark:placeholder:text-text-dark-secondary
          ${error ? "border-red-500" : ""}
          ${inputClassName}`}
        placeholderTextColor={isDark ? "#666666" : "#9CA3AF"}
        {...props}
      />
      {error && (
        <Text className="text-red-500 dark:text-red-400 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
