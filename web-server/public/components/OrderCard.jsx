/*
 * OrderCard.jsx - Single Order Display 
 * Shows order details, allows status update and deletion.
 */

function OrderCard({ order, onUpdate, onDelete }) {
    const { token } = React.useContext(AppContext);
    const [restaurantName, setRestaurantName] = React.useState('');

    // Fetch restaurant name once on mount — avoids showing raw ID to the user
    React.useEffect(() => {
        async function fetchRestaurantName() {
            const res = await fetch(`/api/restaurants/${order.restaurantId}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (res.ok) {
                const data = await res.json();
                setRestaurantName(data.name);
            }
        }
        fetchRestaurantName();
    }, [order.restaurantId]);

    async function handleDelete() {
        if (!window.confirm('Are you sure you want to delete this order?')) return;
        const res = await fetch(`/api/orders/${order.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.status === 204) onDelete();
    }

    async function handleStatusChange(newStatus) {
        const res = await fetch(`/api/orders/${order.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        if (res.status === 204) onUpdate();
    }

    // Color scheme per status for the select dropdown
    const statusColors = {
        pending:   { bg: '#fffbe6', border: '#f5c518', color: '#856404' },
        completed: { bg: '#e8f5e9', border: '#43a047', color: '#155724' },
        cancelled: { bg: '#fdecea', border: '#e53935', color: '#721c24' },
    };
    const currentColors = statusColors[order.status] || statusColors.pending;

    return (
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* Top row: order number + status badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    Order #{order.id}
                </span>
                <span className={`status-${order.status}`} style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                    {order.status}
                </span>
            </div>

            {/* Restaurant name */}
            <span style={{ color: 'var(--accent-color)', fontWeight: '600', fontSize: '0.9rem' }}>
                🏪 {restaurantName || `Restaurant #${order.restaurantId}`}
            </span>

            {/* Items — comma separated to save space */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                {order.items.join(' · ')}
            </p>

            {/* Total */}
            <p style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem', margin: 0 }}>
                Total: ₪{order.totalPrice}
            </p>

            {/* Bottom row: styled status select + delete button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <select
                    value={order.status}
                    onChange={e => handleStatusChange(e.target.value)}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: `1.5px solid ${currentColors.border}`,
                        background: currentColors.bg,
                        color: currentColors.color,
                        fontWeight: '600',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        outline: 'none',
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        paddingRight: '28px',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23666'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 10px center',
                    }}
                >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                <button className="btn-danger" onClick={handleDelete} style={{ padding: '6px 14px', fontSize: '0.85rem', borderRadius: '20px' }}>
                    Delete
                </button>
            </div>
        </div>
    );
}

window.OrderCard = OrderCard;
