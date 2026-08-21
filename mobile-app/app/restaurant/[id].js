/*
 * restaurant/[id].js — Restaurant page (dynamic route, e.g. /restaurant/665f...)
 */

import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { AppContext } from '../../context/AppContext';
import { apiDelete, apiGet } from '../../services/api';
import ProductCard from '../../components/ProductCard'
import Cart from '../../components/Cart'
import RestaurantForm from '../../components/RestaurantForm';
import { getColors } from '../../styles/Theme';
import { makeStyles } from '../../styles/restaurant.styles';
import ProductForm from '../../components/ProductForm';

export default function RestaurantPage() {
    // id comes from the URL, e.g. /restaurant/3 → id = "3"
    const { id } = useLocalSearchParams();

    const router = useRouter();
    const { token, user, theme } = useContext(AppContext);

    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [showEditRestaurant, setShowEditRestaurant] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    // holds the product object being edited. null means no edit modal open
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const colors = getColors(theme);
    const styles = makeStyles(colors);


    async function fetchRestaurant() {
        const res = await apiGet('/api/restaurants/'+id, token)
        if (res.ok) {
            setRestaurant(res.data);
        } else {
            setError('Failed to load restaurant');
        }
    }

    // Separate function so it can be called after add/edit/delete product
    async function fetchProducts() {
        const res = await apiGet(`/api/restaurants/${id}/products`, token)
        if (res.ok) {
            setProducts(res.data);
        }
    }

    useEffect(() => {
        async function loadAll() {
            setLoading(true);
            await fetchRestaurant();
            await fetchProducts();
            setLoading(false);
        }
        loadAll();
    }, [id]);

    // Cart operations
    const addToCart = (product) => {
        setCart(prev => [...prev, product]);
    };

    // Index-based removal so the same product can appear multiple times in cart
    const removeFromCart = (index) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const onOrderSuccess = () => {
        setCart([]);
    };

    async function handleDeleteRestaurant() {
      Alert.alert('Delete restaurant', 'Are you sure?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: async () => {
              const res = await apiDelete(`/api/restaurants/${id}`, token);
              if (res.status === 204) router.back();
          }}
      ]);
    }

    if (loading) return (
        <View>
            
            <Text style={styles.infoText}>Loading...</Text>
        </View>
    );
    
    if (error) return (
        <View>
            
            <Text style={styles.errorText}>{error}</Text>
        </View>
    );

    const isOwner = !!(user && restaurant && restaurant.ownerId && String(user._id) === String(restaurant.ownerId));

    return (
        <ScrollView style={styles.container}>

            {restaurant && (
                <View>
                    {restaurant.image ? (
                        <Image source={{ uri: restaurant.image }} style={styles.hero} />
                    ) : null}
                    {/* Restaurant header: info + edit/delete buttons */}
                    <View style={styles.header}>
                        <View>
                          <>
                            <Text style={styles.restaurantName}>
                                {restaurant.name}
                            </Text>
                            <Text style={styles.infoText}>
                                {restaurant.description}
                            </Text>
                            <Text style={styles.infoText}>
                                📍 {restaurant.address}
                            </Text>
                            <Text style={styles.infoText}>
                                📞 {restaurant.phoneNumber}
                            </Text>
                          </>
                        </View>
                        {isOwner && (
                            <View style={styles.ownerButtons}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => setShowEditRestaurant(true)}
                                >
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.dangerButton}
                                    onPress={handleDeleteRestaurant}
                                >
                                    <Text style={styles.dangerButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        </View>

                    {/* Main content: menu on the left, cart on the right */}
                        {/* Menu section */}
                        <View style={styles.menuList}>
                            <View style={styles.menuHeader}>
                                <Text style={styles.sectionTitle}>Menu</Text>
                                {isOwner && (
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => setShowAddProduct(true)}
                                >
                                   <Text style={styles.buttonText}>+ Add Product</Text> 
                                </TouchableOpacity>
                                )}
                            </View>

                            {products.length === 0 ? (
                                <Text style={styles.emptyText}>No products yet.</Text>
                            ) : (
                                <View>
                                    {products.map(p => (
                                        <ProductCard
                                            key={p._id}
                                            product={p}
                                            restaurantId={id}
                                            onAddToCart={addToCart}
                                            onEdit={(prod) => setEditingProduct(prod)}
                                            onDelete={fetchProducts}
                                            isOwner={isOwner}
                                        />
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Cart section fixed width sidebar */}
                        
                            <Cart
                                items={cart}
                                restaurantId={id}
                                onOrderSuccess={onOrderSuccess}
                                onRemoveItem={removeFromCart}
                            />

                    </View>
            )}

            {/* Edit restaurant modal */}
            {showEditRestaurant && (
                <RestaurantForm
                    restaurant={restaurant}
                    onSuccess={() => {
                        setShowEditRestaurant(false);
                        fetchRestaurant(); // refresh restaurant info after edit
                    }}
                    onClose={() => setShowEditRestaurant(false)}
                />
            )}

            {/* Add product modal */}
            {showAddProduct && (
                <ProductForm
                    restaurantId={id}
                    product={null}
                    onSuccess={() => {
                        setShowAddProduct(false);
                        fetchProducts();
                    }}
                    onClose={() => setShowAddProduct(false)}
                />
            )}

            {/* Edit product modal. opens when editingProduct is set */}
            {editingProduct && (
                <ProductForm
                    restaurantId={id}
                    product={editingProduct}
                    onSuccess={() => {
                        setEditingProduct(null);
                        fetchProducts();
                    }}
                    onClose={() => setEditingProduct(null)}
                />
            )}
        </ScrollView>
    );
    
}
