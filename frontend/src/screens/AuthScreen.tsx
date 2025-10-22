import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { TextField } from '../components/TextField';
import { PrimaryButton } from '../components/PrimaryButton';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { colors, fontFamily, spacing, typography } from '../theme';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, registerUser } from '../store/slices/authSlice';

const initialFormState = {
  name: '',
  email: '',
  password: '',
};

type AuthMode = 'login' | 'register';

const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export const AuthScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);

  const [mode, setMode] = useState<AuthMode>('login');
  const [form, setForm] = useState(initialFormState);
  const [touched, setTouched] = useState<Record<keyof typeof initialFormState, boolean>>({
    name: false,
    email: false,
    password: false,
  });

  const isLoading = status === 'loading';

  const errors = useMemo(() => {
    const validation: Partial<Record<keyof typeof form, string>> = {};

    if (mode === 'register' && !form.name.trim()) {
      validation.name = 'Please enter your name';
    }
    if (!form.email.trim()) {
      validation.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      validation.email = 'Please enter a valid email';
    }
    if (!form.password) {
      validation.password = 'Password is required';
    } else if (form.password.length < 6) {
      validation.password = 'Password must be at least 6 characters';
    }

    return validation;
  }, [form, mode]);

  const handleSubmit = () => {
    setTouched({ name: true, email: true, password: true });
    if (Object.keys(errors).length > 0) {
      return;
    }

    if (mode === 'login') {
      dispatch(loginUser({ email: form.email.trim(), password: form.password }));
    } else {
      dispatch(registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      }));
    }
  };

  const toggleMode = () => {
    setMode((current) => (current === 'login' ? 'register' : 'login'));
    setForm(initialFormState);
    setTouched({ name: false, email: false, password: false });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenContainer>
        <LoadingOverlay visible={isLoading} />
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to ChatFlow</Text>
          <Text style={styles.subtitle}>
            {mode === 'login' ? 'Sign in to continue chatting' : 'Create an account to get started'}
          </Text>
        </View>

        <ErrorBanner message={error ?? undefined} />

        {mode === 'register' && (
          <TextField
            label="Name"
            value={form.name}
            onChangeText={(name) => setForm((prev) => ({ ...prev, name }))}
            onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
            error={touched.name ? errors.name : undefined}
            autoCapitalize="words"
          />
        )}

        <TextField
          label="Email"
          value={form.email}
          onChangeText={(email) => setForm((prev) => ({ ...prev, email }))}
          onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
          keyboardType="email-address"
          autoCapitalize="none"
          error={touched.email ? errors.email : undefined}
        />

        <TextField
          label="Password"
          value={form.password}
          onChangeText={(password) => setForm((prev) => ({ ...prev, password }))}
          secureTextEntry
          onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
          error={touched.password ? errors.password : undefined}
        />

        <PrimaryButton
          label={mode === 'login' ? 'Login' : 'Register'}
          onPress={handleSubmit}
          loading={isLoading}
        />

        <TouchableOpacity onPress={toggleMode} style={styles.switchModeButton}>
          <Text style={styles.switchModeText}>
            {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: typography.heading,
    color: colors.textPrimary,
    fontFamily: fontFamily.bold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    fontFamily: fontFamily.regular,
  },
  switchModeButton: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  switchModeText: {
    color: colors.secondary,
    fontSize: typography.body,
    fontFamily: fontFamily.medium,
  },
});
