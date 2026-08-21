/*
 * ProductCard.js — one menu item
 */

import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { apiDelete, apiGet } from '../services/api';
import { getColors } from '../styles/Theme';
import { makeStyles } from '../styles/ProductCard.styles';

export default function ProductCard({ product, restaurantId, onAddToCart, onEdit, onDelete, isOwner }) {
  const { token, theme } = useContext(AppContext);
  const colors = getColors(theme);
  const styles = makeStyles(colors);

  async function handleAddToCart() {
    const response = await apiGet(`/api/restaurants/${restaurantId}/products/${product._id}`, token);
    if (response.ok) onAddToCart(product);
    else console.error('Failed to register view');
  }

  function handleDelete() {
    Alert.alert('Delete product', 'Delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const res = await apiDelete(`/api/restaurants/${restaurantId}/products/${product._id}`, token);
          if (res.status === 204) onDelete();
        },
      },
    ]);
  }

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ fontSize: 28 }}>🍴</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          {product.description ? (
            <Text style={styles.description} numberOfLines={2}>{product.description}</Text>
          ) : null}
          <Text style={styles.price}>₪{product.price}</Text>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart} activeOpacity={0.8}>
          <Text style={styles.addBtnText}>＋</Text>
        </TouchableOpacity>
      </View>

      {isOwner && (
        <View style={styles.ownerRow}>
          <TouchableOpacity style={styles.ownerBtn} onPress={() => onEdit(product)}>
            <Text style={styles.ownerBtnText}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ownerBtnDanger} onPress={handleDelete}>
            <Text style={styles.ownerBtnDangerText}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
