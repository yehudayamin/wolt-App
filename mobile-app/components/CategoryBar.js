/*
 * CategoryBar.js — horizontal scrollable row of category circles
 */

import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { CATEGORIES } from '../constants/categories';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { getColors } from '../styles/Theme';

export default function CategoryBar() {
  const router = useRouter();
  const { theme } = useContext(AppContext);
  const c = getColors(theme);

  return (
    <FlatList
      horizontal
      data={CATEGORIES}
      keyExtractor={(item) => item.name}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 4 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{ alignItems: 'center', marginRight: 14, width: 66 }}
          onPress={() => router.push(`/category/${item.name}`)}
          activeOpacity={0.7}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: c.accentSoft,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 6,
            }}
          >
            <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
          </View>
          <Text style={{ fontSize: 11, textAlign: 'center', color: c.textSecondary, fontWeight: '600' }} numberOfLines={1}>
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}
