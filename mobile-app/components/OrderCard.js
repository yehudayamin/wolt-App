/*
 * OrderCard.js — one order in the Orders list
 */

import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { apiGet, apiPatch, apiDelete } from '../services/api';
import { STATUS_COLORS, getColors } from '../styles/Theme';

const STATUSES = ['pending', 'completed', 'cancelled'];

export default function OrderCard({ order, onUpdate, onDelete }) {
  const { token, theme } = useContext(AppContext);
  const colors = getColors(theme);
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    async function loadName() {
      const res = await apiGet('/api/restaurants/' + order.restaurantId, token);
      if (res.ok) setRestaurantName(res.data.name);
    }
    loadName();
  }, []);

  async function changeStatus(newStatus) {
    if (newStatus === order.status) return;
    const res = await apiPatch('/api/orders/' + order._id, { status: newStatus }, token);
    if (res.ok) onUpdate();
  }

  function handleDelete() {
    Alert.alert('Delete order', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const res = await apiDelete('/api/orders/' + order._id, token);
          if (res.ok) onDelete();
        },
      },
    ]);
  }

  const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
  const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '';

  return (
    <View style={{ padding: 16, marginBottom: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, gap: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontWeight: '700', fontSize: 16, color: colors.text }}>🏪 {restaurantName || 'Loading...'}</Text>
        <View style={{ backgroundColor: sc.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
          <Text style={{ color: sc.text, fontWeight: '600' }}>{order.status}</Text>
        </View>
      </View>

      <Text style={{ color: colors.textSecondary }}>{(order.items || []).join(' · ')}</Text>
      <Text style={{ fontWeight: '700', color: colors.text }}>Total: ₪{order.totalPrice}</Text>
      {date ? <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{date}</Text> : null}

      {/* status update buttons */}
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => changeStatus(s)}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: order.status === s ? colors.accent : colors.bgSecondary,
            }}
          >
            <Text style={{ color: order.status === s ? colors.buttonText : colors.textSecondary, fontSize: 12, fontWeight: '600' }}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* delete button */}
      <TouchableOpacity
        onPress={handleDelete}
        style={{ backgroundColor: colors.danger, borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 4 }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Delete Order</Text>
      </TouchableOpacity>
    </View>
  );
}
