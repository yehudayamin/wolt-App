/*
 * RestaurantPage.jsx-Restaurant Detail Page
 * Full page for a single restaurant: info, menu, cart, and management controls.
 */

function RestaurantPage() {
    // id comes from the URL, e.g. /restaurant/3 → id = "3"
    const { id } = ReactRouterDOM.useParams();

    const history = ReactRouterDOM.useHistory();
    const { token, user } = React.useContext(AppContext);

    const [restaurant, setRestaurant] = React.useState(null);
    const [products, setProducts] = React.useState([]);
    const [cart, setCart] = React.useState([]);
    const [showEditRestaurant, setShowEditRestaurant] = React.useState(false);
    const [showAddProduct, setShowAddProduct] = React.useState(false);
    // holds the product object being edited. null means no edit modal open
    const [editingProduct, setEditingProduct] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    async function fetchRestaurant() {
        const res = await fetch(`/api/restaurants/${id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
            const data = await res.json();
            setRestaurant(data);
        } else {
            setError('Failed to load restaurant');
        }
    }

    // Separate function so it can be called after add/edit/delete product
    async function fetchProducts() {
        const res = await fetch(`/api/restaurants/${id}/products`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
            const data = await res.json();
            setProducts(data);
        }
    }

    React.useEffect(() => {
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
        if (!window.confirm('Delete this restaurant?')) return;

        const res = await fetch(`/api/restaurants/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (res.status === 204) {
            history.push('/');
        }
    }

    if (loading) return (
        <div>
            <Navbar />
            <p style={{ padding: '24px', color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
    );
    
    if (error) return (
        <div>
            <Navbar />
            <p className="error-message" style={{ padding: '24px' }}>{error}</p>
        </div>
    );

    const isOwner = user && restaurant && user.id === restaurant.ownerId;

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <Navbar />

            {restaurant && (
                <div>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

                    {/* Restaurant header: info + edit/delete buttons */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '32px',
                        paddingBottom: '24px',
                        borderBottom: '1px solid var(--border-color)'
                    }}>
                        <div>
                            <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
                                {restaurant.name}
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                {restaurant.description}
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                📍 {restaurant.address}
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                📞 {restaurant.phoneNumber}
                            </p>
                        </div>
                        {isOwner && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    className="btn-primary"
                                    onClick={() => setShowEditRestaurant(true)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn-danger"
                                    onClick={handleDeleteRestaurant}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                        </div>

                    {/* Main content: menu on the left, cart on the right */}
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

                        {/* Menu section */}
                        <div style={{ flex: 1 }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '16px'
                            }}>
                                <h3 style={{ color: 'var(--text-primary)' }}>Menu</h3>
                                {isOwner && (
                                <button
                                    className="btn-primary"
                                    onClick={() => setShowAddProduct(true)}
                                >
                                    + Add Product
                                </button>
                                )}
                            </div>

                            {products.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)' }}>No products yet.</p>
                            ) : (
                                <div className="products-grid">
                                    {products.map(p => (
                                        <ProductCard
                                            key={p.id}
                                            product={p}
                                            restaurantId={id}
                                            onAddToCart={addToCart}
                                            onEdit={(prod) => setEditingProduct(prod)}
                                            onDelete={fetchProducts}
                                            isOwner={isOwner}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Cart section fixed width sidebar */}
                        <div style={{ width: '300px', flexShrink: 0 }}>
                            <Cart
                                items={cart}
                                restaurantId={id}
                                onOrderSuccess={onOrderSuccess}
                                onRemoveItem={removeFromCart}
                            />
                        </div>

                    </div>
                </div>
                </div>
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

        </div>
    );
}

window.RestaurantPage = RestaurantPage;
