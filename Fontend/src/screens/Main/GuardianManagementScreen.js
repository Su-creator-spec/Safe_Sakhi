import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Trash2, User } from 'lucide-react-native';

export default function GuardianManagementScreen() {
  const [contacts, setContacts] = useState([
    { id: '1', name: 'Mom', phone: '+1 555-123-4567' },
    { id: '2', name: 'Dad', phone: '+1 555-987-6543' }
  ]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const addContact = () => {
    if (newName && newPhone) {
      setContacts([{ id: Date.now().toString(), name: newName, phone: newPhone }, ...contacts]);
      setNewName('');
      setNewPhone('');
    }
  };

  const removeContact = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const renderItem = ({ item }) => (
    <View className="bg-white p-4 rounded-xl mb-3 flex-row items-center justify-between shadow-sm border border-gray-100">
      <View className="flex-row items-center">
        <View className="bg-soft-white p-3 rounded-full mr-4">
          <User color="#334155" size={20} />
        </View>
        <View>
          <Text className="text-charcoal font-bold text-lg">{item.name}</Text>
          <Text className="text-charcoal opacity-70">{item.phone}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeContact(item.id)} className="p-3">
        <Trash2 color="#ef4444" size={20} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-soft-white px-6 pt-6">
      <Text className="text-3xl font-bold text-charcoal mb-2">Guardians</Text>
      <Text className="text-base text-charcoal opacity-70 mb-8">
        Manage the people who will be alerted when you trigger an SOS.
      </Text>

      <View className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 gap-y-3">
        <TextInput 
          className="w-full bg-soft-white px-4 py-4 rounded-xl border border-gray-200 text-charcoal text-base"
          placeholder="Guardian Name"
          placeholderTextColor="#94a3b8"
          value={newName}
          onChangeText={setNewName}
        />
        <TextInput 
          className="w-full bg-soft-white px-4 py-4 rounded-xl border border-gray-200 text-charcoal text-base"
          placeholder="Phone Number"
          placeholderTextColor="#94a3b8"
          keyboardType="phone-pad"
          value={newPhone}
          onChangeText={setNewPhone}
        />
        <TouchableOpacity 
          className="bg-charcoal py-4 rounded-xl items-center flex-row justify-center mt-2 shadow-sm"
          onPress={addContact}
        >
          <Plus color="white" size={20} />
          <Text className="text-white font-bold text-lg ml-2">Add Guardian</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-xl font-bold text-charcoal mb-4">Your Contacts</Text>
      <FlatList 
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
