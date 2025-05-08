import { useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { SafeAreaView, View } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const { signIn, setActive: setActiveSignIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } = useSignUp();
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });

  const handleEmailAuth = async () => {};

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
