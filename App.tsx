// App.tsx
import { registerRootComponent } from 'expo';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme, navigationTheme } from './src/theme/theme';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import CalibrationScreen from './src/screens/CalibrationScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Define the navigation stack parameter list
export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Gallery: undefined;
  Results: { imageUri: string; count?: number };
  Calibration: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Crowd Counter Pro' }} 
          />
          <Stack.Screen 
            name="Camera" 
            component={CameraScreen} 
            options={{ title: 'Capture Crowd' }} 
          />
          <Stack.Screen 
            name="Gallery" 
            component={GalleryScreen} 
            options={{ title: 'Image Gallery' }} 
          />
          <Stack.Screen 
            name="Results" 
            component={ResultsScreen} 
            options={{ title: 'Crowd Analysis' }} 
          />
          <Stack.Screen 
            name="Calibration" 
            component={CalibrationScreen} 
            options={{ title: 'Calibration' }} 
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ title: 'Settings' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

// Register the main component for Expo
registerRootComponent(App);

export default App;
