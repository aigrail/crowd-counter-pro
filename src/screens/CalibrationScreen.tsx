// src/screens/CalibrationScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, TextInput, List, Dialog, Portal, useTheme, Divider } from 'react-native-paper';
import { calibrationManager, Venue } from '../utils/CalibrationManager';

const CalibrationScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  
  // Form state
  const [venueName, setVenueName] = useState('');
  const [venueType, setVenueType] = useState('');
  const [calibrationFactor, setCalibrationFactor] = useState('1.0');
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    loadVenues();
  }, []);
  
  const loadVenues = async () => {
    try {
      setLoading(true);
      const venueList = await calibrationManager.getVenues();
      setVenues(venueList);
    } catch (error) {
      console.error('Error loading venues:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddVenue = () => {
    setEditingVenue(null);
    setVenueName('');
    setVenueType('');
    setCalibrationFactor('1.0');
    setNotes('');
    setDialogVisible(true);
  };
  
  const handleEditVenue = (venue: Venue) => {
    setEditingVenue(venue);
    setVenueName(venue.name);
    setVenueType(venue.type);
    setCalibrationFactor(venue.calibrationFactor.toString());
    setNotes(venue.notes || '');
    setDialogVisible(true);
  };
  
  const handleDeleteVenue = async (venue: Venue) => {
    Alert.alert(
      'Delete Venue',
      `Are you sure you want to delete "${venue.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await calibrationManager.deleteVenue(venue.id);
              loadVenues();
            } catch (error) {
              console.error('Error deleting venue:', error);
            }
          }
        },
      ]
    );
  };
  
  const handleSaveVenue = async () => {
    try {
      const factor = parseFloat(calibrationFactor);
      if (isNaN(factor) || factor <= 0) {
        Alert.alert('Invalid Input', 'Calibration factor must be a positive number');
        return;
      }
      
      if (!venueName.trim()) {
        Alert.alert('Invalid Input', 'Venue name is required');
        return;
      }
      
      if (editingVenue) {
        // Update existing venue
        await calibrationManager.updateVenue(editingVenue.id, {
          name: venueName.trim(),
          type: venueType.trim(),
          calibrationFactor: factor,
          notes: notes.trim(),
        });
      } else {
        // Add new venue
        await calibrationManager.addVenue({
          name: venueName.trim(),
          type: venueType.trim(),
          calibrationFactor: factor,
          notes: notes.trim(),
        });
      }
      
      setDialogVisible(false);
      loadVenues();
    } catch (error) {
      console.error('Error saving venue:', error);
    }
  };
  
  const handleExportCalibrations = async () => {
    try {
      const profileJson = await calibrationManager.exportProfile();
      Alert.alert(
        'Export Successful',
        'Calibration profile exported successfully. In a production app, this would allow you to share the profile with other users or devices.'
      );
    } catch (error) {
      console.error('Error exporting calibrations:', error);
    }
  };
  
  const handleImportCalibrations = async () => {
    Alert.alert(
      'Import Calibrations',
      'In a production app, this would allow you to import calibration profiles from other users or devices.'
    );
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Venue Calibrations</Text>
            <Text style={styles.cardDescription}>
              Calibrate the crowd counting algorithm for specific venues to improve accuracy.
            </Text>
            
            <Button 
              mode="contained" 
              icon="plus"
              onPress={handleAddVenue}
              style={{marginVertical: 16, backgroundColor: theme.colors.primary}}
            >
              Add Venue
            </Button>
            
            {venues.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No calibration profiles available.
                </Text>
                <Text style={styles.emptySubtext}>
                  Add a venue to create a calibration profile.
                </Text>
              </View>
            ) : (
              venues.map(venue => (
                <Card key={venue.id} style={styles.venueCard}>
                  <Card.Content>
                    <View style={styles.venueHeader}>
                      <View>
                        <Text style={styles.venueName}>{venue.name}</Text>
                        <Text style={styles.venueType}>{venue.type}</Text>
                      </View>
                      <Text style={styles.calibrationFactor}>
                        {venue.calibrationFactor.toFixed(2)}x
                      </Text>
                    </View>
                    
                    {venue.notes && (
                      <Text style={styles.venueNotes}>{venue.notes}</Text>
                    )}
                    
                    <Text style={styles.lastUpdated}>
                      Last updated: {new Date(venue.lastUpdated).toLocaleDateString()}
                    </Text>
                    
                    <View style={styles.venueActions}>
                      <Button 
                        mode="outlined" 
                        compact
                        onPress={() => handleEditVenue(venue)}
                      >
                        Edit
                      </Button>
                      <Button 
                        mode="outlined" 
                        compact
                        onPress={() => handleDeleteVenue(venue)}
                        style={{marginLeft: 8}}
                        textColor="red"
                      >
                        Delete
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Share Calibrations</Text>
            <Text style={styles.cardDescription}>
              Export your calibration profiles to share with other users or import profiles from others.
            </Text>
            
            <View style={styles.shareButtons}>
              <Button 
                mode="contained" 
                icon="export"
                onPress={handleExportCalibrations}
                style={{flex: 1, marginRight: 8, backgroundColor: theme.colors.primary}}
              >
                Export
              </Button>
              <Button 
                mode="contained" 
                icon="import"
                onPress={handleImportCalibrations}
                style={{flex: 1, marginLeft: 8, backgroundColor: theme.colors.secondary}}
              >
                Import
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
      
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>
            {editingVenue ? 'Edit Venue' : 'Add Venue'}
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Venue Name"
              value={venueName}
              onChangeText={setVenueName}
              style={styles.input}
            />
            <TextInput
              label="Venue Type"
              value={venueType}
              onChangeText={setVenueType}
              placeholder="e.g., Concert Hall, Stadium, Conference"
              style={styles.input}
            />
            <TextInput
              label="Calibration Factor"
              value={calibrationFactor}
              onChangeText={setCalibrationFactor}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Notes (Optional)"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleSaveVenue}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
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
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  venueCard: {
    marginBottom: 12,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  venueName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  venueType: {
    fontSize: 14,
    color: '#666',
  },
  calibrationFactor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  venueNotes: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  venueActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  shareButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
});

export default CalibrationScreen;
