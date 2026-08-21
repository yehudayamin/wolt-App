/*
 * (tabs)/index.js — HOME screen (the default tab)
 */
import { View, Text, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import { apiGet } from '../../services/api';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { AppContext } from '../../context/AppContext';
import { getColors } from '../../styles/Theme';
import { makeStyles } from '../../styles/home.styles';
import RestaurantCard from '../../components/RestaurantCard';
import CategoryBar from '../../components/CategoryBar';
import { haversineDistance } from '../../utils/haversine';
import RestaurantForm from '../../components/RestaurantForm';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const { token, user, theme } = useContext(AppContext);
  const colors = getColors(theme);
  const styles = makeStyles(colors);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [previousRestaurants, setPreviousRestaurants] = useState([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);

  async function fetchRestaurants() {
    setRefreshing(true);
    const res = await apiGet('/api/restaurants', token);
    if (res.ok) setRestaurants(res.data);
    setRefreshing(false);
  }

  async function fetchPreviousRestaurants() {
    const response = await apiGet('/api/orders', token);
    if (!response.ok) return;
    const ordersList = Array.isArray(response.data) ? response.data : (response.data.orders || []);
    if (!Array.isArray(ordersList)) return;
    const uniqueRestaurantIds = [...new Set(ordersList.map((o) => o.restaurantId))];
    const prevResList = uniqueRestaurantIds
      .map((id) => restaurants.find((r) => r._id == id))
      .filter(Boolean);
    setPreviousRestaurants(prevResList);
  }

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (token && restaurants.length > 0) fetchPreviousRestaurants();
    else if (!token) setPreviousRestaurants([]);

    if (user && user.lat && restaurants.length > 0) {
      const nearby = [...restaurants]
        .filter((r) => r.lat && r.lng && haversineDistance(user.lat, user.lng, r.lat, r.lng) <= 5)
        .sort(
          (a, b) =>
            haversineDistance(user.lat, user.lng, a.lat, a.lng) -
            haversineDistance(user.lat, user.lng, b.lat, b.lng)
        );
      setNearbyRestaurants(nearby);
    }
  }, [token, restaurants, user]);

  function HorizontalList({ data }) {
    return (
      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item._id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.horizontalCard}>
            <RestaurantCard restaurant={item} onPress={() => router.push('/restaurant/' + item._id)} />
          </View>
        )}
      />
    );
  }

  const header = (
    <View>
      <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/search')} activeOpacity={0.7}>
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Search restaurants or dishes</Text>
      </TouchableOpacity>

      {user && user.role === 'restaurant' && (
        <TouchableOpacity style={styles.button} onPress={() => setShowForm(true)}>
          <Text style={styles.textButton}>+ Add Restaurant</Text>
        </TouchableOpacity>
      )}

      <CategoryBar />

      {user?.role === 'user' && user?.lat && nearbyRestaurants.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Near You</Text>
          <HorizontalList data={nearbyRestaurants} />
        </>
      )}

      {token && previousRestaurants.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Order Again</Text>
          <HorizontalList data={previousRestaurants} />
        </>
      )}

      <Text style={styles.sectionTitle}>All Restaurants</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchRestaurants} />}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <RestaurantCard restaurant={item} onPress={() => router.push('/restaurant/' + item._id)} />
        )}
      />

      {showForm && (
        <RestaurantForm
          restaurant={null}
          onSuccess={() => {
            setShowForm(false);
            fetchRestaurants();
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </View>
  );
}
