import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing, typography, fontFamily } from '../theme';
import { Contact } from '../types';

type Props = {
  contact: Contact;
  onPress?: (contact: Contact) => void;
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();

export const ContactListItem: React.FC<Props> = ({ contact, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress?.(contact)}
      style={styles.container}
      activeOpacity={0.85}
    >
      {contact.avatar ? (
        <Image source={{ uri: contact.avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitials}>{getInitials(contact.name)}</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.name}>{contact.name}</Text>
        {contact.lastMessage && <Text style={styles.lastMessage}>{contact.lastMessage}</Text>}
      </View>
      {contact.unreadCount ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{contact.unreadCount}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: colors.textPrimary,
    fontFamily: fontFamily.bold,
    fontSize: typography.subheading,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    color: colors.textPrimary,
    fontSize: typography.subheading,
    fontFamily: fontFamily.medium,
  },
  lastMessage: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  badgeText: {
    color: colors.textPrimary,
    fontFamily: fontFamily.medium,
  },
});
