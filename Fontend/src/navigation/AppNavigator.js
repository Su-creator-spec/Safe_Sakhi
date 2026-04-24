import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Map, Users, Clock } from 'lucide-react-native';

// Auth
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';

// Main
import SOSDashboardScreen from '../screens/Main/SOSDashboardScreen';
import SafetyMapScreen from '../screens/Main/SafetyMapScreen';
import GuardianManagementScreen from '../screens/Main/GuardianManagementScreen';
import SafetyLogsScreen from '../screens/Main/SafetyLogsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ef4444', // emergency-red
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: { backgroundColor: '#f8fafc', paddingBottom: 5 }, // soft-white
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={SOSDashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={SafetyMapScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Guardians" 
        component={GuardianManagementScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Logs" 
        component={SafetyLogsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Clock color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  // In a full implementation, this integrates with AuthContext
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLogin={() => setIsAuthenticated(true)} />}
          </Stack.Screen>
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
}
