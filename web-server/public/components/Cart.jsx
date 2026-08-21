/*
 * Cart.jsx-Shopping Cart Component
 * Displays current order items, total price, and handles order submission.
 */

function Cart({ items, restaurantId, onOrderSuccess, onRemoveItem }) {
    const { token, user } = React.useContext(AppContext);

    const [orderMessage, setOrderMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [showGame, setShowGame] = React.useState(false);

    // Computed each render and not state, because it always derives from items
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    async function handlePlaceOrder() {
        if (items.length === 0) {
            setOrderMessage('Cart is empty');
            return;
        }

        setLoading(true);
        setOrderMessage('');

        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                restaurantId,
                items: items.map(i => i.name) // server expects array of product names
            })
        });

        const data = await res.json();

        if (res.status === 201) {
            setOrderMessage('Order placed successfully! 🎉');
            onOrderSuccess();
            setShowGame(true);
            setTimeout(() => setOrderMessage(''), 3000);
        } else {
            setOrderMessage(data.error || 'Failed to place order');
        }

        setLoading(false);
    }

    return (
        <div className="cart-panel">
            <div className="cart-header">
                <span>🛒 Your Order</span>
                {items.length > 0 && (
                    <span className="cart-item-count">{items.length}</span>
                )}
            </div>

            {items.length === 0 ? (
                <div className="cart-empty">
                    <p>🍽️</p>
                    <p>Your cart is empty</p>
                    <p>Add items from the menu</p>
                </div>
            ) : (
                <>
                    <ul className="cart-items-list">
                        {items.map((item, index) => (
                            <li key={index} className="cart-item">
                                <div className="cart-item-info">
                                    <span className="cart-item-name">{item.name}</span>
                                    <span className="cart-item-price">₪{item.price}</span>
                                </div>
                                <button className="cart-remove-btn" onClick={() => onRemoveItem(index)}>✕</button>
                            </li>
                        ))}
                    </ul>
                    <div className="cart-total">
                        <span>Total</span>
                        <span className="cart-total-price">₪{totalPrice.toFixed(2)}</span>
                    </div>
                </>
            )}

            {orderMessage && (
                <p className={orderMessage.includes('🎉') ? 'cart-msg-success' : 'cart-msg-error'}>
                    {orderMessage}
                </p>
            )}

            <button
                className="btn-primary cart-place-order"
                onClick={handlePlaceOrder}
                disabled={loading || items.length === 0}
            >
                {loading ? 'Placing Order...' : 'Place Order'}
            </button>

            {showGame && (
                <ClickGame onClose={() => setShowGame(false)} />
            )}
        </div>
    );
}

window.Cart = Cart;
