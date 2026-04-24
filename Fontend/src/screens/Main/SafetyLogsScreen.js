import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircle, Clock } from 'lucide-react-native';

export default function SafetyLogsScreen() {
  const [logs, setLogs] = useState([
    { id: '1', date: 'Apr 08, 2026', time: '10:42 PM', location: 'Opal St, Safe Zone', type: 'sos_triggered' },
    { id: '2', date: 'Apr 02, 2026', time: '08:15 PM', location: 'Deviating from usual path...', type: 'safe_routing_alert' }
  ]);

  const renderItem = ({ item }) => (
    <View className="bg-white p-5 rounded-2xl mb-3 shadow-sm border border-gray-100 flex-row items-center">
      <View className="bg-soft-white p-3 rounded-full mr-4 justify-center items-center h-12 w-12">
        {item.type === 'sos_triggered' ? (
          <AlertCircle color="#ef4444" size={24} />
        ) : (
          <Clock color="#f59e0b" size={24} />
        )}
      </View>
      <View className="flex-1">
        <Text className="text-charcoal font-bold text-lg">
          {item.type === 'sos_triggered' ? 'SOS Triggered' : 'Route Alert'}
        </Text>
        <Text className="text-charcoal mt-1 text-base">{item.location}</Text>
        <Text className="text-gray-400 font-medium text-xs mt-2">{item.date}  •  {item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-soft-white px-6 pt-6">
      <Text className="text-3xl font-bold text-charcoal mb-2">Safety Logs</Text>
      <Text className="text-base text-charcoal opacity-70 mb-8">
        History of your alerts and activity.
      </Text>

      <FlatList 
        data={logs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
