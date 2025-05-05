import { useClerk } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { View } from 'react-native';

export default function Home() {
  const { isSignedIn } = useClerk();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  return <View />;
}
