// src/screens/HomeScreen.tsx
import React from 'react';
import { StyleSheet, View, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card, useTheme, Divider } from 'react-native-paper';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View 
          style={[styles.logo, {backgroundColor: theme.colors.primary}]}
        >
          <Text style={styles.logoText}>C</Text>
        </View>
        <Text style={styles.title}>Crowd Counter Pro</Text>
        <Text style={styles.subtitle}>Professional Crowd Estimation</Text>
      </View>

      <Card style={styles.actionCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Count a Crowd</Text>
          <Text style={styles.cardDescription}>
            Capture a new image or select from your gallery to count people in a crowd.
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button 
              mode="contained" 
              icon="camera"
              onPress={() => navigation.navigate('Camera')}
              style={[styles.button, {backgroundColor: theme.colors.primary}]}
            >
              Camera
            </Button>
            
            <Button 
              mode="contained" 
              icon="image"
              onPress={() => navigation.navigate('Gallery')}
              style={[styles.button, {backgroundColor: theme.colors.secondary}]}
            >
              Gallery
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.featuresCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Features</Text>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, {backgroundColor: theme.colors.primary}]}>
              <Text style={styles.featureIconText}>1</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Accurate Counting</Text>
              <Text style={styles.featureDescription}>
                Advanced algorithms provide precise crowd size estimation.
              </Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, {backgroundColor: theme.colors.primary}]}>
              <Text style={styles.featureIconText}>2</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Venue Calibration</Text>
              <Text style={styles.featureDescription}>
                Customize for specific venues to improve accuracy over time.
              </Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, {backgroundColor: theme.colors.primary}]}>
              <Text style={styles.featureIconText}>3</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Density Heatmaps</Text>
              <Text style={styles.featureDescription}>
                Visualize crowd distribution with intuitive heatmaps.
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Tools & Settings</Text>
          
          <View style={styles.settingsButtons}>
            <TouchableOpacity 
              style={styles.settingButton}
              onPress={() => navigation.navigate('Calibration')}
            >
              <View style={[styles.settingIcon, {backgroundColor: theme.colors.primary}]}>
                <Text style={styles.settingIconText}>C</Text>
              </View>
              <Text style={styles.settingText}>Calibration</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <View style={[styles.settingIcon, {backgroundColor: theme.colors.primary}]}>
                <Text style={styles.settingIconText}>S</Text>
              </View>
              <Text style={styles.settingText}>Settings</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#F5F5F7', // Apple-inspired background
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  actionCard: {
    marginBottom: 16,
  },
  featuresCard: {
    marginBottom: 16,
  },
  settingsCard: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureIconText: {
    color: 'white',
    fontWeight: 'bold',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    marginVertical: 8,
  },
  settingsButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  settingButton: {
    alignItems: 'center',
    padding: 8,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingIconText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  settingText: {
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
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

export default HomeScreen;
