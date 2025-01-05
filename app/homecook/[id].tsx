import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Mock data - in a real app, this would come from an API or database
const homeCooksDetails = {
  '1': {
    id: '1',
    name: "Alia's Kitchen",
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1UgfeQ2JULoivnfBGWpce9EfR6owD_JUf3Q&s',
    specialty: 'Organic Vegetarian',
    location: 'Vastrapur',
    bio: "Passionate about creating delicious, healthy vegetarian meals using fresh, organic ingredients. With 10 years of culinary experience, I believe in nourishing both body and soul.",
    dishes: [
      { id: '1', name: 'Quinoa Buddha Bowl', price: 249, description: 'Nutrient-rich bowl with roasted vegetables and homemade dressing' },
      { id: '2', name: 'Vegan Lasagna', price: 349, description: 'Layered lasagna with plant-based cheese and seasonal vegetables' },
      { id: '3', name: 'Organic Green Smoothie', price: 149, description: 'Refreshing smoothie packed with spinach, kale, and tropical fruits' }
    ],
    reviews: [
      { id: '1', name: 'Aayush Patel', rating: 5, comment: 'Absolutely delicious and so healthy!' },
      { id: '2', name: 'Parth Thakkar', rating: 4, comment: 'Great flavors, very fresh ingredients.' }
    ]
  },
  '2': {
    id: '2',
    name: "Kavita's Eats",
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr7gYsrMj8EmbhAkWq84ykzgTjW-f2jfskHg&s',
    specialty: 'Homemade Soups',
    location: 'South Bopal',
    bio: "Soup enthusiast with a mission to bring comfort and nutrition through carefully crafted, homemade soups. Each recipe is a labor of love.",
    dishes: [
      { id: '1', name: 'Hearty Minestrone', price: 199, description: 'Classic Italian vegetable soup with beans and pasta' },
      { id: '2', name: 'Chicken Noodle Soup', price: 249, description: 'Traditional healing soup with farm-fresh ingredients' },
      { id: '3', name: 'Roasted Tomato Bisque', price: 229, description: 'Creamy soup with roasted tomatoes and herbs' }
    ],
    reviews: [
      { id: '1', name: 'Aayush Patel', rating: 5, comment: 'Best soups in the city!' },
      { id: '2', name: 'Meet Lad', rating: 4, comment: 'So comforting and delicious.' }
    ]
  },
  '3': {
    id: '3',
    name: "Nini's Bakery",
    image: 'https://content3.jdmagicbox.com/v2/comp/ahmedabad/z7/079pxx79.xx79.231108160414.b1z7/catalogue/baked-by-nini-s-makarba-ahmedabad-bakeries-kz625ip7lr.jpg',
    specialty: 'Artisan Breads',
    location: 'Science City',
    bio: "Dedicated to the art of bread-making, using traditional techniques and the finest ingredients to create extraordinary artisan breads.",
    dishes: [
      { id: '1', name: 'Sourdough Loaf', price: 199, description: 'Classic sourdough with perfect crust and tangy flavor' },
      { id: '2', name: 'Multigrain Bread', price: 179, description: 'Nutritious bread with a mix of whole grains' },
      { id: '3', name: 'Focaccia', price: 229, description: 'Italian herb-infused flatbread' }
    ],
    reviews: [
      { id: '1', name: 'Aayush Patel', rating: 5, comment: 'Incredible artisan breads!' },
      { id: '2', name: 'Paryusha Shah', rating: 4, comment: 'Fresh and delicious.' }
    ]
  }
};

export default function HomeCookDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const cookDetails = homeCooksDetails[id as keyof typeof homeCooksDetails];

  if (!cookDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Home Cook Not Found</Text>
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image 
          source={{ uri: cookDetails.image }} 
          style={styles.headerImage} 
          resizeMode="cover"
        />
      }
      
    >
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <ThemedView style={styles.detailContainer}>
        <ThemedText type="title">{cookDetails.name}</ThemedText>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={20} color="#888" />
          <Text style={styles.locationText}>{cookDetails.location}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{cookDetails.bio}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Signature Dishes</Text>
          {cookDetails.dishes.map((dish) => (
            <View key={dish.id} style={styles.dishCard}>
              <Text style={styles.dishName}>{dish.name}</Text>
              <Text style={styles.dishDescription}>{dish.description}</Text>
              <Text style={styles.dishPrice}>₹{dish.price}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          {cookDetails.reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewName}>{review.name}</Text>
                <View style={styles.ratingContainer}>
                  {[...Array(review.rating)].map((_, i) => (
                    <Ionicons key={i} name="star" size={16} color="#FFD700" />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Order from {cookDetails.name}</Text>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: 300,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  errorText: {
    fontSize: 18,
    color: 'gray',
  },
  detailContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationText: {
    marginLeft: 10,
    color: '#888',
    fontSize: 16,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  bioText: {
    color: '#888',
    lineHeight: 22,
  },
  dishCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dishDescription: {
    color: '#888',
    marginVertical: 5,
  },
  dishPrice: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewName: {
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  reviewComment: {
    color: '#888',
  },
  orderButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});