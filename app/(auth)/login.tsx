import { useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Pressable, SafeAreaView, View, Text, TextInput } from 'react-native';

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
    <View className="flex-1 p-4">
      <SafeAreaView className="flex-1 justify-center bg-white px-6">
        <Text className="mb-8 text-center text-3xl font-bold text-black">TripScape</Text>
        <TextInput
          className="mb-4 rounded-xl border border-gray-300 p-4 text-black"
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="mb-4 rounded-xl border border-gray-300 p-4 text-black"
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Pressable className="mb-4 rounded-xl bg-black py-4" onPress={handleEmailAuth}>
          <Text className="text-center font-semibold text-white">
            {isLogin ? 'Log In' : 'Sign Up'}
          </Text>
        </Pressable>

        <View className="my-4 flex-row items-center">
          <View className="h-px flex-1 bg-gray-300" />
          <Text className="mx-2 text-gray-400">or</Text>
          <View className="h-px flex-1 bg-gray-300" />
        </View>

        <Pressable
          className="mb-2 flex-row items-center justify-center gap-2 rounded-xl border border-gray-300 py-4"
          onPress={handleGoogleAuth}>
          <FontAwesome name="google" size={20} color="black" />
          <Text className="font-medium text-black">Continue with Google</Text>
        </Pressable>
        <Pressable
          className="flex-row items-center justify-center gap-2 rounded-xl border border-gray-300 py-4"
          onPress={handleAppleAuth}>
          <FontAwesome name="apple" size={20} color="black" />
          <Text className="font-medium text-black">Continue with Apple</Text>
        </Pressable>

        <Pressable onPress={() => setIsLogin(!isLogin)} className="mt-6">
          <Text className="text-center text-gray-500">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <Text className="font-semibold text-black">{isLogin ? 'Sign Up' : 'Log In'}</Text>
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
