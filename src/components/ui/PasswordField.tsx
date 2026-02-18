import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PasswordFieldProps extends TextInputProps {
  label?: string;
  error?: string;
}

const PasswordField = React.forwardRef<TextInput, PasswordFieldProps>(
  ({ label, error, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const [focused, setFocused] = useState(false);

    return (
      <View className="mb-3">
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
          className={`flex-row items-center rounded-xl px-4 ${
            focused ? "bg-white border-2 border-primary" : "bg-surface-tertiary border border-transparent"
          } ${error ? "border-danger border-2" : ""}`}
        >
          <TextInput
            ref={ref}
            className="flex-1 py-3 text-text-primary text-base"
            secureTextEntry={!visible}
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
          <TouchableOpacity onPress={() => setVisible(!visible)} className="p-1.5">
            <Ionicons
              name={visible ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={focused ? "#ad3020" : "#8694b8"}
            />
          </TouchableOpacity>
        </View>
        {error && <Text className="text-danger text-xs mt-1 ml-1">{error}</Text>}
      </View>
    );
  }
);

export default PasswordField;
