/*
 * RestaurantForm.js — create/edit a restaurant (shown as a Modal)
 */

import { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { apiPatch, apiPost } from '../services/api';
import { CATEGORIES } from '../constants/categories';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { makeStyles } from '../styles/RestaurantForm.styles';
import { getColors } from '../styles/Theme';
import * as ImagePicker from 'expo-image-picker';

export default function RestaurantForm({ restaurant, onSuccess, onClose }) {
  const { token, theme } = useContext(AppContext);
  const colors = getColors(theme);
  const styles = makeStyles(colors);

  const [name, setName] = useState(restaurant ? restaurant.name : '');
  const [address, setAddress] = useState(restaurant ? restaurant.address : '');
  const [phoneNumber, setPhoneNumber] = useState(restaurant ? restaurant.phoneNumber : '');
  const [description, setDescription] = useState(restaurant ? restaurant.description : '');
  const [selectedCategories, setSelectedCategories] = useState(restaurant ? restaurant.categories : []);
  const [image, setImage] = useState(restaurant?.image || null);
  const imageRef = useRef(restaurant?.image || null);
  const [imageChanged, setImageChanged] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState(restaurant?.lat ?? 32.0853);
  const [lng, setLng] = useState(restaurant?.lng ?? 34.7818);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], base64: true, quality: 0.3 });
    if (!result.canceled) {
      const base64 = 'data:image/jpeg;base64,' + result.assets[0].base64;
      setImage(base64);
      imageRef.current = base64;
      setImageChanged(true);
    }
  }

  function toggleCategory(catName) {
    if (selectedCategories.includes(catName)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== catName));
    } else {
      setSelectedCategories([...selectedCategories, catName]);
    }
  }

  function validation() {
    const newErrors = {};
    let valid = true;
    if (!name) { newErrors.name = 'Name is required'; valid = false; }
    if (!address) { newErrors.address = 'Address is required'; valid = false; }
    if (!phoneNumber) { newErrors.phoneNumber = 'Phone is required'; valid = false; }
    else if (!/^\d+$/.test(phoneNumber)) { newErrors.phoneNumber = 'Digits only'; valid = false; }
    if (!description) { newErrors.description = 'Description is required'; valid = false; }
    if (lat < -90 || lat > 90) { newErrors.lat = 'Latitude must be between -90 and 90'; valid = false; }
    if (lng < -180 || lng > 180) { newErrors.lng = 'Longitude must be between -180 and 180'; valid = false; }
    setErrors(newErrors);
    return valid;
  }

  async function handleSubmit() {
    if (!validation()) return;
    setLoading(true);
    const body = {
      name,
      address,
      phoneNumber,
      description,
      categories: selectedCategories,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };
    if (imageChanged) body.image = imageRef.current; // only re-send the image if it actually changed
    let response;
    if (restaurant === null) {
      response = await apiPost('/api/restaurants', body, token);
    } else {
      response = await apiPatch('/api/restaurants/' + restaurant._id, body, token);
    }
    if (response.status === 201 || response.status === 204) {
      onSuccess();
    } else {
      setServerError(response.data?.error || `Error ${response.status}`);
    }
    setLoading(false);
  }

  return (
    <Modal animationType="slide" visible={true} onRequestClose={onClose}>
      <View style={styles.screen}>
        <View style={styles.headerBar}>
          <Text style={styles.title}>{restaurant ? 'Edit Restaurant' : 'Add Restaurant'}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Restaurant name" placeholderTextColor={colors.textSecondary} />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <Text style={styles.label}>Address</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Address" placeholderTextColor={colors.textSecondary} />
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="numeric" placeholder="Phone number" placeholderTextColor={colors.textSecondary} />
          {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Short description"
            placeholderTextColor={colors.textSecondary}
            multiline
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Latitude</Text>
              <TextInput style={styles.input} value={String(lat)} onChangeText={setLat} keyboardType="numeric" placeholder="Latitude" placeholderTextColor={colors.textSecondary} />
              {errors.lat && <Text style={styles.errorText}>{errors.lat}</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Longitude</Text>
              <TextInput style={styles.input} value={String(lng)} onChangeText={setLng} keyboardType="numeric" placeholder="Longitude" placeholderTextColor={colors.textSecondary} />
              {errors.lng && <Text style={styles.errorText}>{errors.lng}</Text>}
            </View>
          </View>

          <Text style={styles.label}>Cover Photo (optional)</Text>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>{image ? '📷 Change Photo' : '📷 Choose Photo'}</Text>
          </TouchableOpacity>
          {image ? <Image source={{ uri: image }} style={styles.preview} /> : null}

          <Text style={styles.label}>Categories</Text>
          <View style={styles.categoriesWrap}>
            {CATEGORIES.map((cat) => {
              const active = selectedCategories.includes(cat.name);
              return (
                <TouchableOpacity
                  key={cat.name}
                  style={active ? styles.categoryActive : styles.category}
                  onPress={() => toggleCategory(cat.name)}
                >
                  <Text style={active ? styles.categoryTextActive : styles.categoryText}>
                    {cat.emoji} {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={loading ? null : handleSubmit}>
              <Text style={styles.buttonText}>
                {loading ? 'Saving...' : restaurant ? 'Save Changes' : 'Create Restaurant'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.cancelButton, { flex: 1 }]} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
