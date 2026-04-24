import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Map as MapIcon } from 'lucide-react-native';

export default function SafetyMapScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.mapFallback}>
        <MapIcon color="#ef4444" size={64} style={{ marginBottom: 16 }} />
        <Text className="text-charcoal text-2xl font-bold">Safety Map</Text>
        <Text className="text-charcoal mt-2 opacity-70 text-center px-8 text-base">
          You are currently previewing on the Web platform. Map rendering relies on native iOS/Android components. 
          Please launch via an iOS Simulator or Android Emulator to view OpenStreetMap routing.
        </Text>
      </View>

      <SafeAreaView className="absolute top-0 w-full px-4 pt-4" pointerEvents="box-none">
        <View className="bg-white rounded-2xl shadow-lg border border-gray-100 flex-row items-center px-4 py-3">
          <Search color="#94a3b8" size={24} />
          <TextInput 
            placeholder="Search Destination (Safe Routing)"
            className="flex-1 ml-3 text-charcoal text-base"
            placeholderTextColor="#94a3b8"
            style={{ outlineStyle: 'none' }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  mapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
