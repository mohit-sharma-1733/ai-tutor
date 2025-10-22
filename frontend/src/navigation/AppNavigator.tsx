import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadSession, logoutUser } from '../store/slices/authSlice';
import { fetchContacts } from '../store/slices/contactsSlice';
import { colors, fontFamily } from '../theme';
import { AuthScreen } from '../screens/AuthScreen';
import { ContactListScreen } from '../screens/ContactListScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    card: colors.card,
    text: colors.textPrimary,
    border: colors.border,
  },
};

const ContactsTabNavigator = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontFamily: fontFamily.bold },
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Chats"
        component={ContactListScreen}
        options={{
          headerRight: () => <LogoutButton />, 
        }}
      />
    </Tab.Navigator>
  );
};

const LogoutButton = () => {
  const dispatch = useAppDispatch();
  return (
    <TouchableOpacity onPress={() => dispatch(logoutUser())} style={{ marginRight: 16 }}>
      <Text style={{ color: colors.secondary, fontFamily: fontFamily.medium }}>Logout</Text>
    </TouchableOpacity>
  );
};

export const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadSession());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={ContactsTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
