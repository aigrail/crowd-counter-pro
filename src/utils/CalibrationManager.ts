// src/utils/CalibrationManager.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Venue {
  id: string;
  name: string;
  type: string;
  calibrationFactor: number;
  lastUpdated: string;
  notes?: string;
}

export interface CalibrationProfile {
  venues: Venue[];
  lastSync?: string;
}

export class CalibrationManager {
  private profile: CalibrationProfile = { venues: [] };
  private loaded: boolean = false;
  
  constructor() {
    this.loadProfile();
  }
  
  /**
   * Load calibration profile from storage
   */
  private async loadProfile(): Promise<void> {
    try {
      const profileJson = await AsyncStorage.getItem('calibration_profile');
      if (profileJson) {
        this.profile = JSON.parse(profileJson);
      }
      this.loaded = true;
    } catch (error) {
      console.error('Error loading calibration profile:', error);
      this.profile = { venues: [] };
      this.loaded = true;
    }
  }
  
  /**
   * Save calibration profile to storage
   */
  private async saveProfile(): Promise<void> {
    try {
      await AsyncStorage.setItem('calibration_profile', JSON.stringify(this.profile));
    } catch (error) {
      console.error('Error saving calibration profile:', error);
    }
  }
  
  /**
   * Ensure profile is loaded before operations
   */
  private async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      await this.loadProfile();
    }
  }
  
  /**
   * Get all venues
   */
  async getVenues(): Promise<Venue[]> {
    await this.ensureLoaded();
    return [...this.profile.venues];
  }
  
  /**
   * Get a venue by ID
   */
  async getVenue(id: string): Promise<Venue | undefined> {
    await this.ensureLoaded();
    return this.profile.venues.find(venue => venue.id === id);
  }
  
  /**
   * Add a new venue
   */
  async addVenue(venue: Omit<Venue, 'id' | 'lastUpdated'>): Promise<Venue> {
    await this.ensureLoaded();
    
    const newVenue: Venue = {
      ...venue,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString()
    };
    
    this.profile.venues.push(newVenue);
    await this.saveProfile();
    
    return newVenue;
  }
  
  /**
   * Update an existing venue
   */
  async updateVenue(id: string, updates: Partial<Omit<Venue, 'id' | 'lastUpdated'>>): Promise<Venue | undefined> {
    await this.ensureLoaded();
    
    const index = this.profile.venues.findIndex(venue => venue.id === id);
    if (index === -1) return undefined;
    
    const updatedVenue: Venue = {
      ...this.profile.venues[index],
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    this.profile.venues[index] = updatedVenue;
    await this.saveProfile();
    
    return updatedVenue;
  }
  
  /**
   * Delete a venue
   */
  async deleteVenue(id: string): Promise<boolean> {
    await this.ensureLoaded();
    
    const initialLength = this.profile.venues.length;
    this.profile.venues = this.profile.venues.filter(venue => venue.id !== id);
    
    if (this.profile.venues.length !== initialLength) {
      await this.saveProfile();
      return true;
    }
    
    return false;
  }
  
  /**
   * Apply calibration to a crowd count
   */
  async applyCalibration(venueId: string | undefined, count: number): Promise<number> {
    if (!venueId) return count;
    
    await this.ensureLoaded();
    const venue = this.profile.venues.find(v => v.id === venueId);
    
    if (!venue) return count;
    
    // Apply the calibration factor
    return Math.round(count * venue.calibrationFactor);
  }
  
  /**
   * Export calibration profile
   */
  async exportProfile(): Promise<string> {
    await this.ensureLoaded();
    return JSON.stringify(this.profile);
  }
  
  /**
   * Import calibration profile
   */
  async importProfile(profileJson: string): Promise<boolean> {
    try {
      const newProfile = JSON.parse(profileJson) as CalibrationProfile;
      
      // Validate profile structure
      if (!newProfile.venues || !Array.isArray(newProfile.venues)) {
        return false;
      }
      
      this.profile = newProfile;
      await this.saveProfile();
      return true;
    } catch (error) {
      console.error('Error importing calibration profile:', error);
      return false;
    }
  }
  
  /**
   * Suggest calibration factor based on known count
   */
  suggestCalibrationFactor(detectedCount: number, actualCount: number): number {
    if (detectedCount === 0) return 1.0;
    return actualCount / detectedCount;
  }
}

// Singleton instance
export const calibrationManager = new CalibrationManager();
