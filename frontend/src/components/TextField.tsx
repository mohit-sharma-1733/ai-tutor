import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, spacing, typography, fontFamily } from '../theme';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export const TextField: React.FC<Props> = ({ label, error, style, ...textInputProps }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, style, !!error && styles.inputError]}
        {...textInputProps}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontFamily: fontFamily.medium,
    fontSize: typography.caption,
  },
  input: {
    backgroundColor: colors.card,
    color: colors.textPrimary,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fontFamily.regular,
    fontSize: typography.body,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    marginTop: spacing.xs,
    color: colors.error,
    fontSize: typography.caption,
  },
});
