import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
// Updated restaurant data with dishes
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

const cuisines = ['All', 'Indian', 'Italian', 'American', 'Japanese', 'Chinese'];

export default function HomeScreen() {
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRestaurants = featuredRestaurants.filter(restaurant => {
    const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisine === selectedCuisine;
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCuisine && matchesSearch;
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="fast-food" style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Find Your Favorite Food</ThemedText>
      </ThemedView>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants or cuisines"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.cuisineContainer}>
        <Text style={styles.sectionTitle}>Browse by Cuisine</Text>
        <FlatList
          horizontal
          data={cuisines}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.cuisineButton, 
                selectedCuisine === item && styles.selectedCuisineButton
              ]}
              onPress={() => setSelectedCuisine(item)}
            >
              <Text style={styles.cuisineText}>{item}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.featuredContainer}>
        <Text style={styles.sectionTitle}>Featured Restaurants</Text>
        {filteredRestaurants.length > 0 ? (
          <FlatList
            data={filteredRestaurants}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Link 
                href={{
                  pathname: "../restaurant/[id]",
                  params: { id: item.id }
                }}
                // as={`/restaurant/${item.id}`}
                asChild
              >
                <TouchableOpacity style={styles.restaurantCard}>
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.restaurantImage} 
                    resizeMode="cover"
                  />
                  <Text style={styles.restaurantName}>{item.name}</Text>
                  <Text style={styles.restaurantCuisine}>{item.cuisine}</Text>
                </TouchableOpacity>
              </Link>
            )}
          />
        ) : (
          <Text style={styles.noResultsText}>No restaurants found</Text>
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHorizontal: 16,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: 'white',
  },
  cuisineContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  cuisineButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedCuisineButton: {
    backgroundColor: '#0056b3',
  },
  cuisineText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  featuredContainer: {
    paddingHorizontal: 16,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  restaurantCuisine: {
    color: 'gray',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  noResultsText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
    fontSize: 16,
  },
});