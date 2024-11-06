import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

const Button = ({
  onPress,
  title,
  variant = "primary",
  isLoading = false,
  disabled = false,
  className = "",
}: ButtonProps) => {
  const baseStyles = "h-12 rounded-lg justify-center items-center";
  const variantStyles = {
    primary: "bg-blue-500 active:bg-blue-600",
    secondary: "bg-gray-500 active:bg-gray-600",
    danger: "bg-red-500 active:bg-red-600",
  };
  const disabledStyles = disabled ? "opacity-50" : "";

  return (
    <TouchableOpacity
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white font-semibold text-lg">{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
