/* Shopping cart for the current restaurant */

import { View, Text, TouchableOpacity } from 'react-native';
import { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { apiPost } from '../services/api';
import { getColors, CARD_SHADOW } from '../styles/Theme';
import ClickGame from './ClickGame';

export default function Cart({ items, restaurantId, onRemoveItem, onOrderSuccess }) {
  const { token, theme } = useContext(AppContext);
  const colors = getColors(theme);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGame, setShowGame] = useState(false);

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  async function handlePlaceOrder() {
    if (items.length === 0) {
      setMessage('Cart is empty');
      return;
    }
    setLoading(true);
    setMessage('');

    const res = await apiPost('/api/orders', { restaurantId, items: items.map((i) => i.name) }, token);

    if (res.ok) {
      setMessage('Order placed successfully! 🎉');
      setShowGame(true);
      onOrderSuccess();
    } else {
      setMessage(res.data?.error || 'Failed to place order');
    }
    setLoading(false);
  }

  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 16, margin: 16, gap: 10, ...CARD_SHADOW }}>
      <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>🛒 Your Order</Text>

      {items.length === 0 ? (
        <Text style={{ color: colors.textSecondary }}>Your cart is empty — add items from the menu.</Text>
      ) : (
        <>
          {items.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <Text style={{ color: colors.text, flex: 1 }}>{item.name}</Text>
              <Text style={{ color: colors.textSecondary, marginRight: 12 }}>₪{item.price}</Text>
              <TouchableOpacity onPress={() => onRemoveItem(index)}>
                <Text style={{ color: colors.danger, fontSize: 18, fontWeight: '700' }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ fontWeight: '800', fontSize: 16, color: colors.text }}>Total</Text>
            <Text style={{ fontWeight: '800', fontSize: 16, color: colors.accent }}>₪{totalPrice.toFixed(2)}</Text>
          </View>
        </>
      )}

      {message ? (
        <Text style={{ color: message.includes('🎉') ? colors.success : colors.danger, fontWeight: '600' }}>{message}</Text>
      ) : null}

      <TouchableOpacity
        onPress={handlePlaceOrder}
        disabled={loading || items.length === 0}
        style={{
          backgroundColor: loading || items.length === 0 ? colors.border : colors.accent,
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: 'center',
          marginTop: 4,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>{loading ? 'Placing Order...' : 'Place Order'}</Text>
      </TouchableOpacity>

      {showGame && <ClickGame onClose={() => setShowGame(false)} />}
    </View>
  );
}
