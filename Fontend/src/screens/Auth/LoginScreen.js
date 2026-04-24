import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authAPI } from '../../services/api';

export default function LoginScreen({ navigation, onLogin }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) return Alert.alert('Error', 'Please fill all fields');
    
    setLoading(true);
    try {
      // Simulate API integration delay
      setTimeout(() => {
        onLogin();
      }, 500);
    } catch (e) {
      Alert.alert('Login Failed', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-soft-white justify-center px-6">
      <View className="items-center mb-10">
        <Text className="text-5xl font-extrabold text-charcoal tracking-tight">Safe<Text className="text-emergency-red">Sakhi</Text></Text>
        <Text className="text-lg text-charcoal mt-2 opacity-70">Your Companion for Safety</Text>
      </View>

      <View className="gap-y-4">
        <TextInput 
          className="w-full bg-white px-4 py-4 rounded-xl border border-gray-200 text-charcoal text-base"
          placeholder="Phone Number"
          placeholderTextColor="#94a3b8"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        
        <TextInput 
          className="w-full bg-white px-4 py-4 rounded-xl border border-gray-200 text-charcoal text-base"
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          className="w-full bg-emergency-red py-4 rounded-2xl items-center mt-4 shadow-sm"
          onPress={handleLogin}
          disabled={loading}
        >
          <Text className="text-white font-bold text-xl">{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="items-center mt-4 p-2"
          onPress={() => navigation.navigate('Signup')}
        >
          <Text className="text-charcoal opacity-70 text-base">
            Don't have an account? <Text className="text-emergency-red font-bold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
