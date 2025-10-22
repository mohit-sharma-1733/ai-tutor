import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography, fontFamily } from '../theme';

type Props = {
  message?: string | null;
};

export const ErrorBanner: React.FC<Props> = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.error,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  text: {
    color: colors.textPrimary,
    fontSize: typography.body,
    fontFamily: fontFamily.medium,
    textAlign: 'center',
  },
});
