/*
 * Shows all orders placed by the currently logged-in user.
 * Allows updating status and deleting orders.
 */

function OrdersPage()
{
    const {token} = React.useContext(AppContext);
    const [loading, setLoading] = React.useState(false);
    const [orders, setOrders] = React.useState([]);
    const [error,setError] = React.useState('');

    async function fetchOrders()
    {
        setLoading(true); //start to load data
        const response = await fetch('/api/orders',{
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
        })

        if (response.ok) {
            const data = await response.json();
            setOrders(data.orders);
        }
        else { setError('Failed to load orders') };

        setLoading(false); //finish to load data.
    }

    React.useEffect(() => { fetchOrders() }, []); //every time we refresh / enter the page - show all orders.

    return (
    <div>
        <Navbar />
        <div className="orders-page-container">
            <h2>My Orders</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && orders.length === 0 && (
                <p>You haven't placed any orders yet.</p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginTop: '16px' }}>
                {orders.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onUpdate={fetchOrders}
                        onDelete={fetchOrders}
                    />
                ))}
            </div>
        </div>
    </div>
    )

}

window.OrdersPage=OrdersPage;