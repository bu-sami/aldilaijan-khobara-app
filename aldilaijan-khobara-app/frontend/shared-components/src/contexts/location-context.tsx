import React, { createContext, useState, useContext, useEffect } from 'react';
import { locationsAPI } from '../services/api';

// Define the location types
export interface Location {
  id: number;
  name: string;
  nameAr?: string;
  parentId?: number;
  children?: Location[];
}

// Define the context type
interface LocationContextType {
  locations: Location[];
  loading: boolean;
  error: string | null;
  fetchLocations: () => Promise<void>;
  getLocationById: (id: number) => Location | undefined;
  getLocationName: (id: number, language: 'en' | 'ar') => string;
}

// Create the context with default values
export const LocationContext = createContext<LocationContextType>({
  locations: [],
  loading: false,
  error: null,
  fetchLocations: async () => {},
  getLocationById: () => undefined,
  getLocationName: () => '',
});

// Create the location provider component
export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all locations
  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await locationsAPI.getAll();
      setLocations(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch locations');
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get location by ID
  const getLocationById = (id: number): Location | undefined => {
    return locations.find(location => location.id === id);
  };

  // Get location name based on language
  const getLocationName = (id: number, language: 'en' | 'ar'): string => {
    const location = getLocationById(id);
    if (!location) return '';
    
    return language === 'ar' && location.nameAr 
      ? location.nameAr 
      : location.name;
  };

  // Fetch locations on mount
  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        locations,
        loading,
        error,
        fetchLocations,
        getLocationById,
        getLocationName,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use the location context
export const useLocation = () => useContext(LocationContext);

export default LocationProvider;
