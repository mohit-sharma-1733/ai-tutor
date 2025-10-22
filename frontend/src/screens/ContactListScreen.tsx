import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { ContactListItem } from '../components/ContactListItem';
import { colors, fontFamily, spacing, typography } from '../theme';
import { Contact } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchContacts } from '../store/slices/contactsSlice';

export const ContactListScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status, error, nextCursor, refreshing } = useAppSelector((state) => state.contacts);
  const isLoadingMore = status === 'loading' && !refreshing;

  const renderItem: ListRenderItem<Contact> = useCallback(({ item }) => {
    return <ContactListItem contact={item} />;
  }, []);

  const keyExtractor = useCallback((item: Contact) => item.id, []);

  const onRefresh = useCallback(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const onEndReached = useCallback(() => {
    if (nextCursor && !isLoadingMore) {
      dispatch(fetchContacts(nextCursor));
    }
  }, [dispatch, nextCursor, isLoadingMore]);

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={items.length === 0 ? styles.emptyContainer : undefined}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />} 
        onEndReachedThreshold={0.2}
        onEndReached={onEndReached}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No chats yet</Text>
            <Text style={styles.emptySubtitle}>Start a conversation to see it appear here.</Text>
          </View>
        )}
        ListFooterComponent={() =>
          isLoadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  errorContainer: {
    padding: spacing.md,
    backgroundColor: colors.error,
    borderRadius: 12,
    marginVertical: spacing.sm,
  },
  errorText: {
    color: colors.textPrimary,
    fontFamily: fontFamily.medium,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: typography.subheading,
    fontFamily: fontFamily.medium,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
