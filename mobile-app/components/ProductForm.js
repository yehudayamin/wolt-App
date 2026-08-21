/*
 * ProductForm.js — create/edit a product (shown as a Modal)
 */

import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { apiPatch, apiPost } from '../services/api';
import { getColors } from '../styles/Theme';
import { makeStyles } from '../styles/ProductForm.styles';
import * as ImagePicker from 'expo-image-picker';

export default function ProductForm({ product, onSuccess, onClose, restaurantId }) {
  const { token, theme } = useContext(AppContext);
  const colors = getColors(theme);
  const styles = makeStyles(colors);

  const [name, setName] = useState(product ? product.name : '');
  const [description, setDescription] = useState(product ? product.description : '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [image, setImage] = useState(product?.image || null);
  const imageRef = useRef(product?.image || null);
  const [imageChanged, setImageChanged] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], base64: true, quality: 0.3 });
    if (!result.canceled) {
      const base64 = 'data:image/jpeg;base64,' + result.assets[0].base64;
      setImage(base64);
      imageRef.current = base64;
      setImageChanged(true);
    }
  }

  function validation() {
    const newErrors = {};
    let valid = true;
    if (!name) { newErrors.name = 'Name is required'; valid = false; }
    if (!price || parseFloat(price) <= 0 || isNaN(parseFloat(price))) { newErrors.price = 'Price must be a positive number'; valid = false; }
    if (!description) { newErrors.description = 'Description is required'; valid = false; }
    setErrors(newErrors);
    return valid;
  }

  async function handleSubmit() {
    if (!validation()) return;
    setLoading(true);
    const body = { name, price: parseFloat(price), description };
    if (imageChanged) body.image = imageRef.current; // only re-send the image if it actually changed
    let response;
    if (product === null) {
      response = await apiPost(`/api/restaurants/${restaurantId}/products`, body, token);
    } else {
      response = await apiPatch(`/api/restaurants/${restaurantId}/products/${product._id}`, body, token);
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
          <Text style={styles.title}>{product ? 'Edit Product' : 'Add Product'}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Product name" placeholderTextColor={colors.textSecondary} />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

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

          <Text style={styles.label}>Price (₪)</Text>
          <TextInput style={styles.input} value={String(price)} onChangeText={setPrice} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textSecondary} />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

          <Text style={styles.label}>Product Photo (optional)</Text>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Text style={styles.imageButtonText}>{image ? '📷 Change Photo' : '📷 Choose Photo'}</Text>
          </TouchableOpacity>
          {image ? <Image source={{ uri: image }} style={styles.preview} /> : null}

          {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.button} onPress={loading ? null : handleSubmit}>
              <Text style={styles.buttonText}>{loading ? 'Saving...' : product ? 'Save Changes' : 'Add Product'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
