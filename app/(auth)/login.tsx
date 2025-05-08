import { router } from 'expo-router';
import { useState } from 'react';
import { View, Alert } from 'react-native';

import { supabase } from '../../utils/supabase';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);

    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      setLoading(false);
    }
    try {
      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }

      if (result.error) {
        Alert.alert('Error ', result.error.message);
      } else if (result.data.session) {
        router.push('/(tabs)');
      } else {
        Alert.alert('Check your email to confirm your account.');
      }
    } catch (err: any) {
      console.log('Auth error ', err);
    } finally {
      setLoading(false);
    }
  };

  return <View />;
}
