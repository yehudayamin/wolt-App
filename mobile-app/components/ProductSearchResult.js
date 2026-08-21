/* One product in the search results */

import { View, Text, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { useRouter } from 'expo-router';
import { AppContext } from '../context/AppContext';
import { getColors } from '../styles/Theme';

export default function ProductSearchResult({ product }) {
  const router = useRouter();
  const { theme } = useContext(AppContext);
  const colors = getColors(theme);

  return (
    <TouchableOpacity
      onPress={() => router.push('/restaurant/' + product.restaurantId)}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginBottom: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
      }}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>{product.name}</Text>
        <Text style={{ color: colors.textSecondary }}>{product.description}</Text>
        <Text style={{ color: colors.accent, fontWeight: '600' }}>🏪 Go to restaurant</Text>
      </View>
      <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 12, color: colors.text }}>₪{product.price}</Text>
    </TouchableOpacity>
  );
}
