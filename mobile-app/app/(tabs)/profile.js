/* Profile / Edit Profile / Settings */

import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, Image } from 'react-native';
import { useState, useContext } from 'react';
import { useRouter } from 'expo-router';
import { AppContext } from '../../context/AppContext';
import { apiGet, apiPatch } from '../../services/api';
import { getColors, CARD_SHADOW } from '../../styles/Theme';

export default function Profile() {
  const { user, token, theme, toggleTheme, logout, updateUser } = useContext(AppContext);
  const colors = getColors(theme);
  const router = useRouter();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [lat, setLat] = useState(String(user?.lat ?? ''));
  const [lng, setLng] = useState(String(user?.lng ?? ''));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSave() {
    setError('');
    setMessage('');

    if (phone && !/^\d+$/.test(phone)) {
      setError('Phone must contain digits only');
      return;
    }
    if (user.role === 'user') {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      if (lat && (latNum < -90 || latNum > 90)) {
        setError('Latitude must be between -90 and 90');
        return;
      }
      if (lng && (lngNum < -180 || lngNum > 180)) {
        setError('Longitude must be between -180 and 180');
        return;
      }
    }

    const body = { name, phone };
    if (user.role === 'user') {
      body.address = address;
      body.lat = parseFloat(lat);
      body.lng = parseFloat(lng);
    }

    const res = await apiPatch('/api/users/' + user._id, body, token);
    if (res.ok) {
      const fresh = await apiGet('/api/users/' + user._id, token);
      if (fresh.ok) updateUser(fresh.data);
      setMessage('Profile updated!');
    } else {
      setError(res.data?.error || 'Failed to update profile');
    }
  }

  async function handleLogout() {
    await logout();
    router.replace('/(tabs)');
  }

  const card = { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 16, ...CARD_SHADOW };
  const label = { color: colors.textSecondary, fontSize: 13, marginBottom: 4, marginTop: 8 };
  const input = {
    backgroundColor: colors.inputBg,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  };
  const cardTitle = { fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 4 };

  // Guest (not logged in) — show login / register options instead of the profile.
  if (!token || !user) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 60, marginBottom: 12 }}>👤</Text>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 6 }}>Welcome to Wolt</Text>
        <Text style={{ color: colors.textSecondary, marginBottom: 24, textAlign: 'center' }}>
          Log in or create an account to order and manage your profile.
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={{ backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', width: '100%', marginBottom: 12 }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/register')}
          style={{ borderWidth: 1.5, borderColor: colors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', width: '100%' }}
        >
          <Text style={{ color: colors.accent, fontWeight: '700' }}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      {/* header card */}
      <View style={[card, { alignItems: 'center' }]}>
        {user?.image ? (
          <Image source={{ uri: user.image }} style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 10 }} />
        ) : (
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <Text style={{ color: '#fff', fontSize: 40, fontWeight: '800' }}>{user?.name?.charAt(0)?.toUpperCase() || '👤'}</Text>
          </View>
        )}
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>{user?.name}</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 2 }}>{user?.username} · {user?.role}</Text>
      </View>

      {/* edit card */}
      <View style={card}>
        <Text style={cardTitle}>Edit Profile</Text>

        <Text style={label}>Name</Text>
        <TextInput value={name} onChangeText={setName} style={input} placeholderTextColor={colors.textSecondary} />

        <Text style={label}>Phone</Text>
        <TextInput value={phone} onChangeText={setPhone} keyboardType="numeric" style={input} placeholderTextColor={colors.textSecondary} />

        {user?.role === 'user' && (
          <>
            <Text style={label}>Address</Text>
            <TextInput value={address} onChangeText={setAddress} style={input} placeholderTextColor={colors.textSecondary} />

            <Text style={label}>Latitude</Text>
            <TextInput value={lat} onChangeText={setLat} keyboardType="numeric" style={input} placeholderTextColor={colors.textSecondary} />

            <Text style={label}>Longitude</Text>
            <TextInput value={lng} onChangeText={setLng} keyboardType="numeric" style={input} placeholderTextColor={colors.textSecondary} />
          </>
        )}

        {error ? <Text style={{ color: colors.danger, marginTop: 10 }}>{error}</Text> : null}
        {message ? <Text style={{ color: colors.success, marginTop: 10 }}>{message}</Text> : null}

        <TouchableOpacity onPress={handleSave} style={{ backgroundColor: colors.accent, borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginTop: 14 }}>
          <Text style={{ color: colors.buttonText, fontWeight: '700' }}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      {/* settings card */}
      <View style={card}>
        <Text style={cardTitle}>Settings</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: colors.text, fontSize: 16 }}>🌙 Dark Mode</Text>
          <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
        </View>
      </View>

      <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: colors.danger, borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
