/* Search screen */

import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useState, useContext } from 'react';
import { useRouter } from 'expo-router';
import { AppContext } from '../../context/AppContext';
import { apiGet } from '../../services/api';
import { getColors } from '../../styles/Theme';
import ProductSearchResult from '../../components/ProductSearchResult';
import RestaurantCard from '../../components/RestaurantCard';

export default function Search() {
  const { token, theme } = useContext(AppContext);
  const colors = getColors(theme);
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    const res = await apiGet('/api/search/' + encodeURIComponent(query), token);
    if (res.ok) {
      setRestaurants(res.data.restaurants || []);
      setProducts(res.data.products || []);
    }
    setSearched(true);
  }

  const sectionTitle = { fontSize: 18, fontWeight: '700', marginVertical: 10, color: colors.text };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search restaurants or dishes..."
          placeholderTextColor={colors.textSecondary}
          onSubmitEditing={handleSearch}
          style={{ flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, height: 44, color: colors.text, backgroundColor: colors.inputBg }}
        />
        <TouchableOpacity
          onPress={handleSearch}
          style={{ backgroundColor: colors.accent, borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' }}
        >
          <Text style={{ color: colors.buttonText, fontWeight: '600' }}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ProductSearchResult product={item} />}
        ListHeaderComponent={
          <>
            {restaurants.length > 0 && (
              <>
                <Text style={sectionTitle}>Restaurants</Text>
                {restaurants.map((r) => (
                  <RestaurantCard
                    key={r._id}
                    restaurant={r}
                    onPress={() => router.push('/restaurant/' + r._id)}
                  />
                ))}
              </>
            )}
            {products.length > 0 && <Text style={sectionTitle}>Dishes</Text>}
          </>
        }
        ListEmptyComponent={
          searched && restaurants.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 40, color: colors.textSecondary }}>No results found</Text>
          ) : null
        }
      />
    </View>
  );
}
