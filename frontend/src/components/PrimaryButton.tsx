import React from 'react';
import { ActivityIndicator, GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, fontFamily } from '../theme';

type Props = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

export const PrimaryButton: React.FC<Props> = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}) => {
  const backgroundColor = variant === 'primary' ? colors.primary : colors.secondary;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.button, { backgroundColor }, disabled && styles.disabled]}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  label: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontFamily: fontFamily.medium,
  },
  disabled: {
    opacity: 0.6,
  },
});
