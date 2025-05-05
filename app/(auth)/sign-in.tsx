import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, Alert, TextInput, SafeAreaView, Pressable } from 'react-native';

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });

  const handleSignIn = async () => {
    if (!isLoaded) return;

    try {
      const result = await signIn.create({ identifier: email, password });
      await setActive({ session: result.createdSessionId });
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Login error', err.errors?.[0]?.message || 'Try again');
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    try {
      const { createdSessionId } = await googleAuth();
    } catch (err: any) {
      Alert.alert('Google login error', err.errors?.[0]?.message || 'Try again');
    }
  };

  const handleAppleSignIn = async () => {
    if (!isLoaded) return;

    try {
      const { createdSessionId } = await appleAuth();
    } catch (err: any) {
      Alert.alert('Apple login error', err.errors?.[0]?.message || 'Try again');
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center bg-white px-6">
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
        <Pressable className="mb-4 rounded-xl bg-black py-4" onPress={handleSignIn}>
          <Text className="text-center font-semibold text-white">Sign In</Text>
        </Pressable>
        <View className="my-4 flex-row items-center">
          <View className="h-px flex-1 bg-gray-300" />
          <Text className="mx-2 text-gray-400">or</Text>
          <View className="h-px flex-1 bg-gray-300" />
        </View>
        <Pressable
          className="mb-2 flex-row items-center justify-center gap-2 rounded-xl border border-gray-300 py-4"
          onPress={handleGoogleSignIn}>
          <Text className="font-medium text-black">Continue with Google</Text>
          <FontAwesome name="google" size={20} color="black" />
        </Pressable>
        <Pressable
          className="flex-row items-center justify-center gap-2 rounded-xl border border-gray-300 py-4"
          onPress={handleAppleSignIn}>
          <Text className="font-medium text-black">Continue with Apple</Text>
          <FontAwesome name="apple" size={20} color="black" />
        </Pressable>
        <Pressable onPress={() => router.push('/(auth)/sign-up')} className="mt-6">
          <Text className="text-center text-gray-500">
            Don't have an account? <Text className="font-semibold text-black">Sign Up</Text>
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
