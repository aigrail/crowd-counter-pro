// src/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { List, Divider, Button, Card, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  
  // Settings state
  const [saveImages, setSaveImages] = useState(true);
  const [highAccuracyMode, setHighAccuracyMode] = useState(false);
  const [autoCalibration, setAutoCalibration] = useState(true);
  const [cloudProcessing, setCloudProcessing] = useState(false);
  
  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data? This will not affect your calibration profiles.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            // In a real app, we would clear the cache here
            Alert.alert('Cache Cleared', 'All cached data has been cleared.');
          }
        },
      ]
    );
  };
  
  const handleResetCalibrations = async () => {
    Alert.alert(
      'Reset Calibrations',
      'Are you sure you want to reset all calibration profiles? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('calibration_profile');
              Alert.alert('Reset Complete', 'All calibration profiles have been reset.');
            } catch (error) {
              console.error('Error resetting calibrations:', error);
            }
          }
        },
      ]
    );
  };
  
  const handleAbout = () => {
    Alert.alert(
      'About Crowd Counter Pro',
      'Version 1.0.0\n\nA professional crowd counting application for event management, venue operations, and security personnel.\n\nDeveloped with React Native and Expo.',
      [{ text: 'OK' }]
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Detection Settings</Text>
          
          <List.Item
            title="High Accuracy Mode"
            description="Uses more processing power for better results"
            left={props => <List.Icon {...props} icon="chart-bar" />}
            right={props => (
              <Switch
                value={highAccuracyMode}
                onValueChange={setHighAccuracyMode}
                color={theme.colors.primary}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Cloud Processing"
            description="Send images to cloud for better accuracy (requires internet)"
            left={props => <List.Icon {...props} icon="cloud" />}
            right={props => (
              <Switch
                value={cloudProcessing}
                onValueChange={setCloudProcessing}
                color={theme.colors.primary}
              />
            )}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Calibration Settings</Text>
          
          <List.Item
            title="Auto Calibration Suggestions"
            description="Suggest calibration adjustments based on venue patterns"
            left={props => <List.Icon {...props} icon="tune" />}
            right={props => (
              <Switch
                value={autoCalibration}
                onValueChange={setAutoCalibration}
                color={theme.colors.primary}
              />
            )}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Storage Settings</Text>
          
          <List.Item
            title="Save Images to Gallery"
            description="Automatically save captured images"
            left={props => <List.Icon {...props} icon="image" />}
            right={props => (
              <Switch
                value={saveImages}
                onValueChange={setSaveImages}
                color={theme.colors.primary}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Clear Cache"
            description="Remove all temporary files"
            left={props => <List.Icon {...props} icon="trash-can" />}
            onPress={handleClearCache}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Advanced</Text>
          
          <List.Item
            title="Reset Calibrations"
            description="Delete all venue calibration profiles"
            left={props => <List.Icon {...props} icon="refresh" />}
            onPress={handleResetCalibrations}
          />
          
          <Divider />
          
          <List.Item
            title="About"
            description="Version information and credits"
            left={props => <List.Icon {...props} icon="information" />}
            onPress={handleAbout}
          />
        </Card.Content>
      </Card>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Crowd Counter Pro v1.0.0
        </Text>
        <Text style={styles.footerSubtext}>
          Professional crowd estimation for event management
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default SettingsScreen;
