import { useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, SafeAreaView, View } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const { signIn, setActive: setActiveSignIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } = useSignUp();
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });

  const handleEmailAuth = async () => {
    if (isLogin && signInLoaded) {
      try {
        const res = await signIn.create({ identifier: email, password });
        await setActiveSignIn({ session: res.createdSessionId });
        router.replace('/(tabs)');
      } catch (err: any) {
        Alert.alert('Failed to login ', err.message);
      }
    } else if (!isLogin && signUpLoaded) {
      try {
        const res = await signUp.create({ emailAddress: email, password });
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        Alert.alert('Verify Email', 'A verification code has been sent to your email.');
      } catch (err: any) {
        Alert.alert('Signup error', err.errors?.[0]?.message || 'Signup failed');
      }
    }
  };

  const handleGoogleAuth = useCallback(async () => {
    try {
      const { createdSessionId } = await googleAuth();

      if (createdSessionId) {
        if (setActiveSignIn) {
          await setActiveSignIn({ session: createdSessionId });
        }
        router.push('/(tabs)');
      } else {
        throw new Error('Google sign-in failed to create a session.');
      }
    } catch (error) {
      console.error('Error while logging in with Google', error);
      setError('Google sign-in failed. Please try again.');
    }
  }, [googleAuth, setActiveSignIn, router]);

  const handleAppleAuth = useCallback(async () => {
    try {
      const { createdSessionId } = await appleAuth();

      if (createdSessionId) {
        if (setActiveSignIn) {
          await setActiveSignIn({ session: createdSessionId });
        }
        router.push('/(tabs)');
      } else {
        throw new Error('Apple sign-in failed to create a session.');
      }
    } catch (error) {
      console.error('Error while logging in with Apple', error);
      setError('Apple sign-in failed. Please try again.');
    }
  }, [appleAuth, setActiveSignIn, router]);

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView>
        <View />
      </SafeAreaView>
    </View>
  );
}
