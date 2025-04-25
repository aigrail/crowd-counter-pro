// src/screens/ResultsScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card, ActivityIndicator, useTheme, Divider } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { RootStackParamList } from '../../App';
import { crowdDetector, DetectionResult } from '../utils/CrowdDetector';
import { calibrationManager, Venue } from '../utils/CalibrationManager';

type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;
type ResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Results'>;

const ResultsScreen = () => {
  const route = useRoute<ResultsScreenRouteProp>();
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const theme = useTheme();
  const { imageUri, count: precomputedCount } = route.params;
  
  const [loading, setLoading] = useState(precomputedCount === undefined);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [calibratedCount, setCalibratedCount] = useState<number | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [processingStage, setProcessingStage] = useState(0);
  
  useEffect(() => {
    if (precomputedCount !== undefined) {
      // Use precomputed count if provided
      setResult({
        count: precomputedCount,
        confidence: 0.9,
        processingTime: 0,
      });
      setLoading(false);
    } else {
      // Otherwise detect crowd in the image
      detectCrowd();
    }
    
    // Load venues for calibration
    loadVenues();
  }, [imageUri, precomputedCount]);
  
  useEffect(() => {
    // Apply calibration when result or selected venue changes
    applyCalibration();
  }, [result, selectedVenue]);
  
  const detectCrowd = async () => {
    try {
      setLoading(true);
      
      // Simulate processing stages
      setProcessingStage(1); // Image preprocessing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProcessingStage(2); // Person detection
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProcessingStage(3); // Counting
      const detectionResult = await crowdDetector.detectCrowd(imageUri);
      
      setProcessingStage(4); // Finalizing
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setResult(detectionResult);
    } catch (error) {
      console.error('Error detecting crowd:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadVenues = async () => {
    try {
      const venueList = await calibrationManager.getVenues();
      setVenues(venueList);
    } catch (error) {
      console.error('Error loading venues:', error);
    }
  };
  
  const applyCalibration = async () => {
    if (!result) return;
    
    try {
      if (selectedVenue) {
        const calibrated = await calibrationManager.applyCalibration(
          selectedVenue.id,
          result.count
        );
        setCalibratedCount(calibrated);
      } else {
        setCalibratedCount(null);
      }
    } catch (error) {
      console.error('Error applying calibration:', error);
    }
  };
  
  const handleSelectVenue = (venue: Venue) => {
    setSelectedVenue(venue);
  };
  
  const handleClearVenue = () => {
    setSelectedVenue(null);
  };
  
  const handleAddCalibration = () => {
    navigation.navigate('Calibration');
  };
  
  const handleShareResults = async () => {
    try {
      // Create a text file with the results
      const count = calibratedCount !== null ? calibratedCount : result?.count;
      const resultsText = 
        `Crowd Counter Pro Results\n` +
        `Date: ${new Date().toLocaleString()}\n` +
        `Estimated crowd size: ${count}\n` +
        `${selectedVenue ? `Venue: ${selectedVenue.name}\n` : ''}` +
        `${result?.confidence ? `Confidence: ${(result.confidence * 100).toFixed(1)}%\n` : ''}` +
        `${result?.processingTime ? `Processing time: ${result.processingTime.toFixed(2)}s\n` : ''}`;
      
      const fileUri = `${FileSystem.cacheDirectory}crowd_results.txt`;
      await FileSystem.writeAsStringAsync(fileUri, resultsText);
      
      // Share the file
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: 'Share Crowd Count Results',
      });
    } catch (error) {
      console.error('Error sharing results:', error);
    }
  };
  
  const getProcessingStageText = () => {
    switch (processingStage) {
      case 1: return 'Preprocessing image...';
      case 2: return 'Detecting people...';
      case 3: return 'Counting crowd...';
      case 4: return 'Finalizing results...';
      default: return 'Processing...';
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.imageCard}>
        <Card.Content style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>No image available</Text>
            </View>
          )}
        </Card.Content>
      </Card>
      
      <Card style={styles.resultsCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Crowd Analysis</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>{getProcessingStageText()}</Text>
            </View>
          ) : result ? (
            <>
              <View style={styles.countContainer}>
                <Text style={styles.countLabel}>Estimated Crowd Size:</Text>
                <Text style={styles.countValue}>
                  {calibratedCount !== null ? calibratedCount : result.count}
                </Text>
                {calibratedCount !== null && (
                  <Text style={styles.calibratedLabel}>Calibrated</Text>
                )}
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Raw Count:</Text>
                  <Text style={styles.detailValue}>{result.count}</Text>
                </View>
                
                {result.confidence && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Confidence:</Text>
                    <Text style={styles.detailValue}>
                      {(result.confidence * 100).toFixed(1)}%
                    </Text>
                  </View>
                )}
                
                {result.processingTime && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Processing Time:</Text>
                    <Text style={styles.detailValue}>
                      {result.processingTime.toFixed(2)}s
                    </Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <Text style={styles.errorText}>
              Error processing image. Please try again.
            </Text>
          )}
        </Card.Content>
      </Card>
      
      <Card style={styles.calibrationCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>Venue Calibration</Text>
          
          {venues.length === 0 ? (
            <View style={styles.noVenuesContainer}>
              <Text style={styles.noVenuesText}>
                No calibration profiles available
              </Text>
              <Button 
                mode="contained" 
                onPress={handleAddCalibration}
                style={{marginTop: 16, backgroundColor: theme.colors.primary}}
              >
                Add Calibration
              </Button>
            </View>
          ) : (
            <>
              <Text style={styles.venueSelectionText}>
                Select a venue to apply calibration:
              </Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.venueScrollView}
                contentContainerStyle={styles.venueScrollContent}
              >
                {venues.map(venue => (
                  <TouchableOpacity
                    key={venue.id}
                    style={[
                      styles.venueItem,
                      selectedVenue?.id === venue.id && {
                        borderColor: theme.colors.primary,
                        backgroundColor: `${theme.colors.primary}20`,
                      }
                    ]}
                    onPress={() => handleSelectVenue(venue)}
                  >
                    <Text style={styles.venueName}>{venue.name}</Text>
                    <Text style={styles.venueType}>{venue.type}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {selectedVenue && (
                <View style={styles.selectedVenueContainer}>
                  <Text style={styles.selectedVenueText}>
                    Applied calibration: {selectedVenue.name}
                  </Text>
                  <Text style={styles.calibrationFactorText}>
                    Factor: {selectedVenue.calibrationFactor.toFixed(2)}x
                  </Text>
                  <Button 
                    mode="outlined" 
                    onPress={handleClearVenue}
                    style={{marginTop: 8}}
                    compact
                  >
                    Clear
                  </Button>
                </View>
              )}
            </>
          )}
        </Card.Content>
      </Card>
      
      <View style={styles.actionsContainer}>
        <Button 
          mode="contained" 
          icon="share"
          onPress={handleShareResults}
          style={{backgroundColor: theme.colors.primary}}
          disabled={!result}
        >
          Share Results
        </Button>
        
        <Button 
          mode="outlined" 
          icon="camera"
          onPress={() => navigation.navigate('Camera')}
          style={{marginTop: 12}}
        >
          New Capture
        </Button>
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
  imageCard: {
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    padding: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  noImageContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  noImageText: {
    fontSize: 16,
    color: '#666',
  },
  resultsCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  countContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  countLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  countValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
  calibratedLabel: {
    fontSize: 14,
    color: '#0066CC',
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  detailsContainer: {
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    padding: 16,
  },
  calibrationCard: {
    marginBottom: 16,
  },
  noVenuesContainer: {
    alignItems: 'center',
    padding: 16,
  },
  noVenuesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  venueSelectionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  venueScrollView: {
    marginBottom: 16,
  },
  venueScrollContent: {
    paddingRight: 16,
  },
  venueItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    minWidth: 120,
  },
  venueName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  venueType: {
    fontSize: 12,
    color: '#666',
  },
  selectedVenueContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  selectedVenueText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  calibrationFactorText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
});

export default ResultsScreen;
