import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!name || !phone || !password) return Alert.alert('Error', 'Please fill all fields');
    
    try {
      Alert.alert('Success', 'Account created! Please login.');
      navigation.navigate('Login');
    } catch (e) {
      Alert.alert('Signup Failed', 'Something went wrong');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-soft-white">
      <ScrollView className="flex-1 px-6 pt-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-8 w-12 h-12 justify-center">
          <ArrowLeft color="#334155" size={28} />
        </TouchableOpacity>

        <View className="mb-10">
          <Text className="text-4xl font-extrabold text-charcoal">Create Account</Text>
          <Text className="text-base text-charcoal mt-2 opacity-70">Register to keep yourself safe.</Text>
        </View>

        <View className="gap-y-4">
          <TextInput 
            className="w-full bg-white px-4 py-4 rounded-xl border border-gray-200 text-charcoal text-base"
            placeholder="Full Name"
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
          />
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
            className="w-full bg-charcoal py-4 rounded-2xl items-center mt-6 shadow-sm"
            onPress={handleSignup}
          >
            <Text className="text-white font-bold text-xl">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
