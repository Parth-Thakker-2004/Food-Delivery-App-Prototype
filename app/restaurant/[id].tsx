import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

// Same restaurant data as in the home screen
const featuredRestaurants = [
  { 
    id: '1', 
    name: "La Pino'z", 
    image: 'https://content.jdmagicbox.com/comp/def_content/pizza_outlets/default-pizza-outlets-13.jpg', 
    cuisine: 'Italian',
    dishes: [
      { id: '1', name: 'Margherita Pizza', price: 299, description: 'Classic pizza with tomato sauce and mozzarella' },
      { id: '2', name: 'Pepperoni Pizza', price: 349, description: 'Spicy pepperoni pizza' },
      { id: '3', name: 'Garlic Bread', price: 149, description: 'Crispy garlic bread with herbs' }
    ]
  },
  { 
    id: '2', 
    name: "McDonald's", 
    image: 'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/RX_THUMBNAIL/IMAGES/VENDOR/2024/9/18/1040d56b-bc83-4ed2-9e59-d5e87c88cb36_93271.jpg', 
    cuisine: 'American',
    dishes: [
      { id: '1', name: 'Big Mac', price: 219, description: 'Iconic burger with special sauce' },
      { id: '2', name: 'McChicken', price: 179, description: 'Crispy chicken burger' },
      { id: '3', name: 'French Fries', price: 99, description: 'Classic golden french fries' }
    ]
  },
  { 
    id: '3', 
    name: "Kovallam", 
    image: 'https://media-cdn.tripadvisor.com/media/photo-p/15/d1/a2/5f/kovallam-special-south.jpg', 
    cuisine: 'South Indian',
    dishes: [
      { id: '1', name: 'Dosa', price: 99, description: 'Crispy rice and lentil crepe' },
      { id: '2', name: 'Idli', price: 79, description: 'Steamed rice cake' },
      { id: '3', name: 'Sambar', price: 59, description: 'Spicy lentil vegetable stew' }
    ]
  },
];

export default function RestaurantDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Find the restaurant by ID
  const restaurant = featuredRestaurants.find(r => r.id === id);

  // If no restaurant is found, return null or a not found view
  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text>Restaurant not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Restaurant Header */}
      <View style={styles.headerContainer}>
        <Image 
          source={{ uri: restaurant.image }} 
          style={styles.restaurantImage} 
          resizeMode="cover"
        />
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantCuisine}>{restaurant.cuisine} Cuisine</Text>
        </View>
      </View>

      {/* Dishes List */}
      <Text style={styles.sectionTitle}>Menu</Text>
      <FlatList
        data={restaurant.dishes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.dishCard}>
            <View style={styles.dishInfo}>
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.dishDescription}>{item.description}</Text>
            </View>
            <Text style={styles.dishPrice}>₹{item.price}</Text>
          </View>
        )}
        contentContainerStyle={styles.dishesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  headerContainer: {
    width: '100%',
    height: 250,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  restaurantInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
  },
  restaurantName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  restaurantCuisine: {
    color: 'white',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: 'white',
  },
  dishesList: {
    paddingHorizontal: 16,
  },
  dishCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  dishInfo: {
    flex: 1,
    marginRight: 16,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dishDescription: {
    color: 'gray',
    marginTop: 4,
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
});