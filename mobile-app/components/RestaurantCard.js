/*
 * RestaurantCard.js — one restaurant in a list
 */

import { TouchableOpacity, Text, View, Image } from 'react-native';
import { makeStyles } from '../styles/RestaurantCard.styles';
import { getColors } from '../styles/Theme';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export default function RestaurantCard({ restaurant, onPress }) {
  const { theme } = useContext(AppContext);
  const colors = getColors(theme);
  const styles = makeStyles(colors);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrap}>
        {restaurant.image ? (
          <Image source={{ uri: restaurant.image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderEmoji}>🍽️</Text>
          </View>
        )}
        {/* name sits on top of the image with a soft dark scrim for readability */}
        <View style={styles.scrim}>
          <Text style={styles.nameOnImage} numberOfLines={1}>{restaurant.name}</Text>
        </View>
      </View>

      <View style={styles.info}>
        {restaurant.description ? (
          <Text style={styles.description} numberOfLines={1}>{restaurant.description}</Text>
        ) : null}
        <Text style={styles.address} numberOfLines={1}>📍 {restaurant.address}</Text>

        {restaurant.categories?.length > 0 && (
          <View style={styles.tagsRow}>
            {restaurant.categories.slice(0, 3).map((cat) => (
              <View key={cat} style={styles.tag}>
                <Text style={styles.tagText}>{cat}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
