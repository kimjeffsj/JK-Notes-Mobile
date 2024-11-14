import { forwardRef } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  onPress?: () => void;
  title: string;
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

const Button = forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      onPress,
      title,
      variant = "primary",
      isLoading = false,
      disabled = false,
      className = "",
    },
    ref
  ) => {
    const baseStyles = "h-12 rounded-lg justify-center items-center";
    const variantStyles = {
      primary: "bg-primary active:bg-primary-light",
      secondary:
        "bg-background-secondary active:bg-background border border-primary",
      danger: "bg-red-500 active:bg-red-600",
    };

    const textStyles = {
      primary: "text-white",
      secondary: "text-primary",
      danger: "text-white",
    };

    const disabledStyles = disabled ? "opacity-50" : "";

    return (
      <TouchableOpacity
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className} mt-2`}
        onPress={onPress}
        disabled={isLoading || disabled}
      >
        {isLoading ? (
          <ActivityIndicator
            color={variant === "secondary" ? "1a1a1a" : "white"}
          />
        ) : (
          <Text className={`font-semibold text-lg ${textStyles[variant]}`}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
);

export default Button;
