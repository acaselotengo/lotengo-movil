import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const TextField = React.forwardRef<TextInput, TextFieldProps>(
  ({ label, error, containerClassName = "", ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <View className={`mb-3 ${containerClassName}`}>
        {label && (
          <Text
            className={`text-sm font-semibold mb-1.5 ${
              focused ? "text-primary" : "text-text-primary"
            }`}
          >
            {label}
          </Text>
        )}
        <View
          className={`rounded-xl px-4 py-3 ${
            focused ? "bg-white border-2 border-primary" : "bg-surface-tertiary border border-transparent"
          } ${error ? "border-danger border-2" : ""}`}
        >
          <TextInput
            ref={ref}
            className="text-text-primary text-base"
            placeholderTextColor="#8694b8"
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
        </View>
        {error && <Text className="text-danger text-xs mt-1 ml-1">{error}</Text>}
      </View>
    );
  }
);

export default TextField;
