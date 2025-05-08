import { useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { View } from 'react-native';

export default function Home() {
  const { user } = useUser();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <View />;
}
