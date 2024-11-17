import { ComponentRef, forwardRef } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  onPress?: () => void;
  title: string;
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

const Button = forwardRef<ComponentRef<typeof TouchableOpacity>, ButtonProps>(
  (
    {
      onPress,
      title,
      variant = "primary",
      isLoading = false,
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles = "h-12 rounded-lg justify-center items-center";
    const variantStyles = {
      primary: "bg-primary dark:bg-primary-dark active:bg-primary-light",
      secondary:
        "bg-background-secondary dark:bg-background-dark-secondary border border-primary dark:border-primary-dark",
      danger:
        "bg-red-500 dark:bg-red-600 active:bg-red-600 dark:active:bg-red-700",
    };

    const textStyles = {
      primary: "text-white dark:text-primary",
      secondary: "text-primary dark:text-primary-dark",
      danger: "text-white",
    };

    const disabledStyles = disabled ? "opacity-50" : "";

    return (
      <TouchableOpacity
        {...props}
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className} mt-2`}
        onPress={onPress}
        disabled={isLoading || disabled}
      >
        {isLoading ? (
          <ActivityIndicator
            color={variant === "secondary" ? "#1a1a1a" : "white"}
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
