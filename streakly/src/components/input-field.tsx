import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Theme } from "../theme/theme";
import { Typography } from "./typography";

export interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Typography variant="label" style={styles.label}>
          {label}
        </Typography>
      )}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          inputStyle,
          style,
        ]}
        placeholderTextColor={Theme.colors.textSecondary}
        {...props}
      />
      {error && (
        <Typography variant="caption" color={Theme.colors.categories.workout.accent} style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Theme.spacing.sm,
    width: "100%",
  },
  label: {
    marginBottom: Theme.spacing.xs,
  },
  input: {
    height: 48,
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.radius.md,
    paddingHorizontal: Theme.spacing.lg,
    color: Theme.colors.textPrimary,
    fontSize: 15,
  },
  inputError: {
    borderColor: Theme.colors.categories.workout.accent,
  },
  errorText: {
    marginTop: Theme.spacing.xs,
  },
});
