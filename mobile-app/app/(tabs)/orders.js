/* My Orders screen */

import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useState, useCallback, useContext } from 'react';
import { useFocusEffect } from 'expo-router';
import { AppContext } from '../../context/AppContext';
import { apiGet } from '../../services/api';
import { getColors } from '../../styles/Theme';
import OrderCard from '../../components/OrderCard';

export default function Orders() {
  const { token, theme } = useContext(AppContext);
  const colors = getColors(theme);
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchOrders() {
    setRefreshing(true);
    const res = await apiGet('/api/orders', token);
    if (res.ok) {
      setOrders(res.data.orders);
    }
    setRefreshing(false);
  }

  // refetch when the tab gains focus, so new orders show up
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [token])
  );

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.bg }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchOrders} />}
        renderItem={({ item }) => (
          <OrderCard order={item} onUpdate={fetchOrders} onDelete={fetchOrders} />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: colors.textSecondary }}>No orders yet</Text>
        }
      />
    </View>
  );
}
