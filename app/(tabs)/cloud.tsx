import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const homeCooks = [
  { 
    id: '1', 
    name: "Alia's Kitchen", 
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1UgfeQ2JULoivnfBGWpce9EfR6owD_JUf3Q&s', 
    specialty: 'Organic Vegetarian',
    location: 'Vastrapur'
  },
  { 
    id: '2', 
    name: "Kavita's Eats", 
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr7gYsrMj8EmbhAkWq84ykzgTjW-f2jfskHg&s', 
    specialty: 'Homemade Soups',
    location: 'South Bopal'
  },
  { 
    id: '3', 
    name: "Nini's Bakery", 
    image: 'https://content3.jdmagicbox.com/v2/comp/ahmedabad/z7/079pxx79.xx79.231108160414.b1z7/catalogue/baked-by-nini-s-makarba-ahmedabad-bakeries-kz625ip7lr.jpg',
    specialty: 'Artisan Breads',
    location: 'Science City'
  },
];

const specialties = ['All', 'Vegetarian', 'Soups', 'Baking', 'Desserts', 'Vegan'];

export default function HomeScreen() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCooks = homeCooks.filter(cook => {
    const matchesSpecialty = selectedSpecialty === 'All' || 
      cook.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    
    const matchesSearch = 
      cook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cook.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cook.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSpecialty && matchesSearch;
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="restaurant" style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Local Home Cooks</ThemedText>
      </ThemedView>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search cooks, specialties, or locations"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.specialtyContainer}>
        <Text style={styles.sectionTitle}>Browse by Specialty</Text>
        <FlatList
          horizontal
          data={specialties}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.specialtyButton, 
                selectedSpecialty === item && styles.selectedSpecialtyButton
              ]}
              onPress={() => setSelectedSpecialty(item)}
            >
              <Text style={styles.specialtyText}>{item}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View style={styles.cookContainer}>
        <Text style={styles.sectionTitle}>Home Cooks Near You</Text>
        {filteredCooks.length > 0 ? (
          <FlatList
            data={filteredCooks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Link 
                href={{
                  pathname: "../homecook/[id]",
                  params: { id: item.id }
                }}
                asChild
              >
                <TouchableOpacity style={styles.cookCard}>
                  <Image 
                    source={{ uri: item.image }} 
                    style={styles.cookImage} 
                    resizeMode="cover"
                  />
                  <Text style={styles.cookName}>{item.name}</Text>
                  <Text style={styles.cookSpecialty}>{item.specialty}</Text>
                  <Text style={styles.cookLocation}>{item.location}</Text>
                </TouchableOpacity>
              </Link>
            )}
          />
        ) : (
          <Text style={styles.noResultsText}>No home cooks found</Text>
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
  specialtyContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  specialtyButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedSpecialtyButton: {
    backgroundColor: '#0056b3',
  },
  specialtyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cookContainer: {
    paddingHorizontal: 16,
  },
  cookCard: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  cookImage: {
    width: '100%',
    height: 200,
  },
  cookName: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  cookSpecialty: {
    color: 'gray',
    paddingHorizontal: 10,
  },
  cookLocation: {
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