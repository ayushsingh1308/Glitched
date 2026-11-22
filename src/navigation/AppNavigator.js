import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';

import RoleSelectScreen from '../screens/RoleSelectScreen';
import HomeScreen from '../screens/HomeScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import ResourceDetailScreen from '../screens/ResourceDetailScreen';
import UploadScreen from '../screens/UploadScreen';
import GamesScreen from '../screens/GamesScreen';
import QuizGameScreen from '../screens/QuizGameScreen';
import MemoryGameScreen from '../screens/MemoryGameScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ICONS = { Home: 'home', Resources: 'library', Upload: 'cloud-upload', Games: 'game-controller', Profile: 'person' };

function Tabs() {
  const { user } = useApp();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        tabBarActiveTintColor: colors.primary,
        tabBarIcon: ({ color, size }) => <Ionicons name={ICONS[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Resources" component={ResourcesScreen} />
      {user.role === 'educator' && <Tab.Screen name="Upload" component={UploadScreen} />}
      <Tab.Screen name="Games" component={GamesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { ready, user } = useApp();

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.primary }, headerTintColor: '#fff' }}>
        {!user ? (
          <Stack.Screen name="RoleSelect" component={RoleSelectScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="ResourceDetail" component={ResourceDetailScreen} options={{ title: 'Resource' }} />
            <Stack.Screen name="QuizGame" component={QuizGameScreen} options={{ title: 'Quick Quiz' }} />
            <Stack.Screen name="MemoryGame" component={MemoryGameScreen} options={{ title: 'Memory Match' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
