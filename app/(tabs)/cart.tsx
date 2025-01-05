import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const initialCartItems = [
  { id: '1', name: 'Margherita Pizza', price: 499, quantity: 1 },
  { id: '2', name: 'Cheeseburger', price: 249, quantity: 2 },
  { id: '3', name: 'Spicy Ramen', price: 299, quantity: 1 },
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleQuantityChange = (id: string, type: 'increment' | 'decrement') => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: type === 'increment' ? item.quantity + 1 : item.quantity > 1 ? item.quantity - 1 : 1,
            }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="cart" style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Your Cart</ThemedText>
      </ThemedView>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.cartItem}>
            <ThemedText style={styles.itemName}>{item.name}</ThemedText>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item.id, 'decrement')}
              >
                <Ionicons name="remove" size={20} color="white" />
              </TouchableOpacity>
              <ThemedText style={styles.itemQuantity}>{item.quantity}</ThemedText>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item.id, 'increment')}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <ThemedText style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</ThemedText>
          </ThemedView>
        )}
      />

      <ThemedView style={styles.totalContainer}>
        <ThemedText style={styles.totalText}>Total: ₹{calculateTotal()}</ThemedText>
        <TouchableOpacity style={styles.checkoutButton}>
          <ThemedText style={styles.checkoutText}>Proceed to Checkout</ThemedText>
        </TouchableOpacity>
      </ThemedView>
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
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  itemName: {
    flex: 2,
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#007bff',
    padding: 5,
    borderRadius: 5,
  },
  itemQuantity: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  itemPrice: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  totalContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  checkoutButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
