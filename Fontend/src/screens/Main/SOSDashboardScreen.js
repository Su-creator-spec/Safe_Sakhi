import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, X } from 'lucide-react-native';

export default function SOSDashboardScreen() {
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      triggerAlert();
      setCountdown(null);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const triggerAlert = () => {
    Alert.alert('SOS Triggered', 'Emergency contacts and authorities have been notified.', [
      { text: 'OK', style: 'destructive' }
    ]);
  };

  const handleSOSPress = () => {
    if (countdown === null) {
      setCountdown(5); // 5 second cancel window
    }
  };

  const cancelSOS = () => {
    setCountdown(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-soft-white justify-center items-center px-6">
      <View className="items-center mb-16">
        <Text className="text-4xl font-extrabold text-charcoal mb-2">Emergency</Text>
        <Text className="text-base text-center text-charcoal opacity-70">
          Tap the button below to instantly alert your guardians.
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSOSPress}
        className={`w-72 h-72 rounded-full justify-center items-center border-[12px] border-white ${
          countdown !== null ? 'bg-red-700' : 'bg-emergency-red'
        }`}
        style={{ 
          elevation: 15, 
          shadowColor: '#ef4444', 
          shadowOpacity: 0.6, 
          shadowRadius: 25,
          shadowOffset: { width: 0, height: 10 }
        }}
      >
        {countdown !== null ? (
          <Text className="text-white text-8xl font-black">{countdown}</Text>
        ) : (
          <>
            <AlertTriangle color="white" size={72} strokeWidth={2.5} style={{ marginBottom: 12 }} />
            <Text className="text-white text-5xl font-black uppercase tracking-widest">SOS</Text>
          </>
        )}
      </TouchableOpacity>

      {countdown !== null && (
        <TouchableOpacity 
          onPress={cancelSOS}
          className="mt-16 flex-row items-center bg-charcoal px-8 py-4 rounded-full"
        >
          <X color="white" size={24} />
          <Text className="text-white text-xl font-bold ml-2">CANCEL ALERT</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
