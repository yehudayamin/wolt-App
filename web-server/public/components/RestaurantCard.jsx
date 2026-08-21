/*
 * RestaurantCard.jsx-Restaurant Card Component
 */


function RestaurantCard({restaurant}){
    //hooks
    const history = ReactRouterDOM.useHistory()

    return <div className="restaurant-card card" onClick={() => history.push(`/restaurant/${restaurant.id}`)} style={{ padding: 0, overflow: 'hidden' }}>
        {restaurant.image ? (
            <div style={{ width: '100%', height: '150px', overflow: 'hidden' }}>
                <img src={restaurant.image} alt={restaurant.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
        ) : (
            <div style={{
                width: '100%', height: '150px',
                background: 'linear-gradient(135deg, #5dd0f5 0%, #29b8e8 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <span style={{ color: '#ffffff', fontSize: '2rem', fontWeight: '800', letterSpacing: '2px' }}>
                    Wolt
                </span>
            </div>
        )}
        <div style={{ padding: '14px' }}>
        <h3>{restaurant.name}</h3>
        <p className="description">{restaurant.description}</p>
        <p className="address">📍 {restaurant.address}</p>
        <div className="category-tags">
        {(restaurant.categories || []).map(cat => (
        <span className="category-tag">{cat}</span>
        ))}
    </div>
        </div>
    </div>
}

window.RestaurantCard = RestaurantCard;
