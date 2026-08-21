/*
 * category/[name].js — Category page (dynamic route, e.g. /category/Pizza)
 */

import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppContext } from '../../context/AppContext';
import { useContext, useEffect, useState } from 'react';
import { apiGet } from '../../services/api';
import RestaurantCard from '../../components/RestaurantCard';

export default function CategoryPage() {
  const { name } = useLocalSearchParams();
  const { token } = useContext(AppContext)

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false); //if we are loading something from the server
  const [error, setError] = useState(''); //error while loading
  const router = useRouter();
  useEffect(() => {
    async function fetchData(){
            setLoading(true);//update loading state
            const response = await apiGet('/api/restaurants', token)
            if (response.ok){//if we got a response
                
                const filtered = response.data.filter(r => r.categories && r.categories.includes(name)); //filter the restaurants by the catergory
                setRestaurants(filtered); //update useState to show the filtered restaurants
            }
            else{
                setError('Failed to load restaurants');
            }
            setLoading(false);
            
        }
        fetchData();
  }, [name])
  return (
        <View style={styles.container}>
        <Text>{name}</Text>
        {loading && <Text>Loading...</Text>}
        {error && <Text style={styles.error}>{error}</Text>}
        {!loading && restaurants.length === 0 && (
            <Text>No restaurants found in this category.</Text>
        )}
        
          <FlatList
            data = {restaurants}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                <RestaurantCard
                  restaurant={item}
                  onPress={() => router.push('/restaurant/' + item._id)}
                />
              )}
            />
        </View>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  error: { color: 'red', marginTop: 8 }
});