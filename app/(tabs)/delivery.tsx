import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ScrollView, Dimensions, useColorScheme } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

// Interface for location point
interface LocationPoint {
  latitude: number;
  longitude: number;
}

// Function to calculate the geometric median using Weiszfeld's algorithm
function calculateOptimalMeetingPoint(points: LocationPoint[], maxIterations = 100): LocationPoint {
  if (points.length === 0) {
    throw new Error('No points provided');
  }

  if (points.length === 1) {
    return points[0];
  }

  // Haversine distance calculation
  const haversineDistance = (point1: LocationPoint, point2: LocationPoint): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Initial guess: arithmetic mean of all points
  let currentPoint: LocationPoint = {
    latitude: points.reduce((sum, p) => sum + p.latitude, 0) / points.length,
    longitude: points.reduce((sum, p) => sum + p.longitude, 0) / points.length
  };

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Calculate weights for each point
    let numeratorLat = 0;
    let numeratorLng = 0;
    let denominator = 0;

    points.forEach(point => {
      // Calculate distance
      const distance = haversineDistance(currentPoint, point);
      
      // Prevent division by zero
      if (distance === 0) {
        return;
      }

      numeratorLat += point.latitude / distance;
      numeratorLng += point.longitude / distance;
      denominator += 1 / distance;
    });

    // New point calculation
    const newPoint: LocationPoint = {
      latitude: numeratorLat / denominator,
      longitude: numeratorLng / denominator
    };

    // Check for convergence
    const change = Math.sqrt(
      Math.pow(newPoint.latitude - currentPoint.latitude, 2) + 
      Math.pow(newPoint.longitude - currentPoint.longitude, 2)
    );

    if (change < 1e-10) {
      return newPoint;
    }

    currentPoint = newPoint;
  }

  return currentPoint;
}

// Defining multiple starting locations for different drivers
const startLocations: LocationPoint[] = [
  {
    latitude: 23.0375,
    longitude: 72.4949,
  },
  {
    latitude: 23.0475,
    longitude: 72.5049,
  },
  {
    latitude: 23.0275,
    longitude: 72.4849,
  }
];

// Final destination
const homeLocation: LocationPoint = {
  latitude: 23.129318,
  longitude: 72.544884,
};

const previousOrders = [
  { id: '1', name: 'Pizza Margherita', date: '2024-11-20', status: 'Delivered' },
  { id: '2', name: 'French Fries', date: '2024-11-18', status: 'Delivered' },
  { id: '3', name: 'Cheeseburger', date: '2024-11-15', status: 'Delivered' },
  { id: '4', name: 'Salad', date: '2024-11-14', status: 'Delivered' },
];

const { height } = Dimensions.get('window');

export default function MapScreen() {
  // Dynamically calculate the meeting point
  const [meetingLocation, setMeetingLocation] = useState<LocationPoint>(
    calculateOptimalMeetingPoint(startLocations)
  );

  const [driversLocations, setDriversLocations] = useState<LocationPoint[]>(startLocations);
  const [isMerged, setIsMerged] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint>(startLocations[0]);
  const colorScheme = useColorScheme(); 
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    let animationInterval: NodeJS.Timeout | null = null;
    const newLocations = [...startLocations];
    let progressToMeeting = 0;
    let progressToHome = 0;
    let mergeStage = 0;

    const animateDrivers = () => {
      animationInterval = setInterval(() => {
        // First phase: Move to meeting point
        if (mergeStage === 0 && progressToMeeting <= 1) {
          newLocations.forEach((start, index) => {
            const latDiff = meetingLocation.latitude - start.latitude;
            const lngDiff = meetingLocation.longitude - start.longitude;

            newLocations[index] = {
              latitude: start.latitude + latDiff * progressToMeeting,
              longitude: start.longitude + lngDiff * progressToMeeting,
            };
          });

          progressToMeeting += 0.02;

          // Check if all drivers have reached the meeting point
          if (progressToMeeting >= 1) {
            mergeStage = 1;
            setIsMerged(true);
            progressToMeeting = 0;
          }
        }
        // Second phase: Move from meeting point to home
        else if (mergeStage === 1 && progressToHome <= 1) {
          const latDiff = homeLocation.latitude - meetingLocation.latitude;
          const lngDiff = homeLocation.longitude - meetingLocation.longitude;

          const mergedLocation = {
            latitude: meetingLocation.latitude + latDiff * progressToHome,
            longitude: meetingLocation.longitude + lngDiff * progressToHome,
          };

          setCurrentLocation(mergedLocation);
          progressToHome += 0.02;

          // Stop animation when reached home
          if (progressToHome >= 1) {
            mergeStage = 2;
            if (animationInterval) clearInterval(animationInterval);
          }
        }

        // Update locations for individual markers before merging
        if (mergeStage === 0) {
          setDriversLocations([...newLocations]);
        }
      }, 100);
    };

    animateDrivers();

    return () => {
      if (animationInterval) clearInterval(animationInterval);
    };
  }, [meetingLocation]);

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: meetingLocation.latitude,
              longitude: meetingLocation.longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            customMapStyle={isDarkMode ? darkMapStyle : []}
          >
            {/* Starting Locations Markers */}
            {!isMerged && startLocations.map((location, index) => (
              <Marker
                key={`start-${index}`}
                coordinate={location}
                title={`Start Point ${index + 1}`}
                description="Driver's initial location"
              >
                <Ionicons name="car" size={30} color={`rgb(${50 * (index + 1)}, 100, 200)`} />
              </Marker>
            ))}

            {/* Meeting Point Marker */}
            {!isMerged && (
              <Marker
                coordinate={meetingLocation}
                title="Meeting Point"
                description="Dynamically calculated optimal point"
              >
                <Ionicons name="pin" size={30} color="purple" />
              </Marker>
            )}

            {/* Drivers' Current Locations before merging */}
            {!isMerged && driversLocations.map((location, index) => (
              <Marker
                key={`driver-${index}`}
                coordinate={location}
                title={`Driver ${index + 1}`}
                description="In transit"
              >
                <Ionicons name="car" size={30} color={`rgb(${50 * (index + 1)}, 100, 200)`} />
              </Marker>
            ))}

            {/* Merged Driver Marker */}
            {isMerged && (
              <Marker
                coordinate={currentLocation}
                title="Merged Delivery"
                description="Multiple drivers united"
              >
                <Ionicons name="car" size={40} color="red" />
              </Marker>
            )}

            {/* Home Location Marker */}
            <Marker
              coordinate={homeLocation}
              title="Home"
              description="Final Destination"
            >
              <Ionicons name="home" size={30} color="green" />
            </Marker>

            {/* Polylines showing routes */}
            {!isMerged && driversLocations.map((location, index) => (
              <Polyline
                key={`route-${index}`}
                coordinates={[
                  startLocations[index], 
                  meetingLocation, 
                  location
                ]}
                strokeColor={`rgb(${50 * (index + 1)}, 100, 200)`}
                strokeWidth={3}
              />
            ))}
            
            {/* Final route to home */}
            <Polyline
              coordinates={[meetingLocation, homeLocation]}
              strokeColor="#007bff"
              strokeWidth={3}
            />
          </MapView>
        </View>

        <View style={[styles.ordersContainer, themeStyles.ordersContainer]}>
          <Text style={[styles.sectionTitle, themeStyles.sectionTitle]}>
            Previous Orders
          </Text>
          <FlatList
            data={previousOrders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.orderItem, themeStyles.orderItem]}
              >
                <Text style={[styles.orderName, themeStyles.orderName]}>
                  {item.name}
                </Text>
                <Text style={[styles.orderDate, themeStyles.orderDate]}>
                  {item.date}
                </Text>
                <Text style={[styles.orderStatus, themeStyles.orderStatus]}>
                  {item.status}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  mapContainer: {
    height: height * 0.75,
  },
  map: {
    flex: 1,
  },
  ordersContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  orderName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    color: 'gray',
  },
  orderStatus: {
    color: 'green',
    marginTop: 5,
  },
});

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  ordersContainer: {
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    color: '#000',
  },
  orderItem: {
    backgroundColor: '#fff',
  },
  orderName: {
    color: '#000',
  },
  orderDate: {
    color: 'gray',
  },
  orderStatus: {
    color: 'green',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
  },
  ordersContainer: {
    backgroundColor: '#1e1e1e',
  },
  sectionTitle: {
    color: '#fff',
  },
  orderItem: {
    backgroundColor: '#242424',
  },
  orderName: {
    color: '#fff',
  },
  orderDate: {
    color: '#aaa',
  },
  orderStatus: {
    color: '#4caf50',
  },
});

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#212121' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#212121' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#31444b' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ color: '#3c3c3c' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212121' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#1a2735' }],
  },
];