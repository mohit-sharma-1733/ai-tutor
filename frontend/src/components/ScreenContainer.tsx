import React from 'react';
import { SafeAreaView, ScrollView, ScrollViewProps, StatusBar, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme';

type Props = {
  children: React.ReactNode;
  scrollable?: boolean;
} & ScrollViewProps;

export const ScreenContainer: React.FC<Props> = ({ children, scrollable = true, ...scrollProps }) => {
  const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Container
        style={styles.container}
        contentContainerStyle={scrollable ? styles.contentContainer : undefined}
        {...scrollProps}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.xl,
  },
});
