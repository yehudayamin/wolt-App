/*
 * Home.jsx - Main Home Screen 
 */


function Home(){
    const { token, user } = React.useContext(AppContext) //get the token from AppContext

    //states
    const [restaurants, setRestaurants] = React.useState([]);
    const [showAddRestaurant, setShowAddRestaurant] = React.useState(false); //form of adding a restaurant
    const [loading, setLoading] = React.useState(false); //if we are loading something from the server
    const [error, setError] = React.useState(''); //error while loading
    const [previousRestaurants, setPreviousRestaurants] = React.useState([])
    const [nearbyRestaurants, setNearbyRestaurants] = React.useState([]);

    async function fetchRestaurants(){
        setLoading(true);//set loading to be true because we start loading from the server

        const response = await fetch('/api/restaurants', { //send message to the server with the token
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (response.ok){//if the fetch succeeded
            const data = await response.json(); //get the restaurants
            setRestaurants(data); //set restaurants using useState
        }
        else{ //we got an error while fetching
            setError('Failed to load restaurants');
        }
        setLoading(false); //we finished loading, so update useState
    }

    async function fetchPreviousRestaurants(){
        const response = await fetch('/api/orders', { 
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!response.ok) return;
        const data = await response.json(); 
        const ordersList = Array.isArray(data) ? data : (data.orders || []);
        if (!Array.isArray(ordersList)) return; 

        const uniqueRestaurantIds = [...new Set(ordersList.map(order => order.restaurantId))]; 
        const prevResList = uniqueRestaurantIds
            .map(id => restaurants.find(r => r.id == id))
            .filter(r => r !== undefined); 
            
        setPreviousRestaurants(prevResList);
    }
    function haversineDistance(lat1, lng1, lat2, lng2) {//function to calculate the distance between user and restaurant
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }


    React.useEffect(() => { fetchRestaurants() }, []); //on reload, run fetchRestaurants. 
    React.useEffect(() => {
        if (token && restaurants.length > 0) {
            fetchPreviousRestaurants();
        } else if (!token) {
            setPreviousRestaurants([]);
        }
        if (user && user.lat && restaurants.length > 0) {
            const nearby = [...restaurants]
            .filter(r => r.lat && r.lng && haversineDistance(user.lat, user.lng, r.lat, r.lng) <= 5)
            .sort((a, b) => haversineDistance(user.lat, user.lng, a.lat, a.lng) - haversineDistance(user.lat, user.lng, b.lat, b.lng));
        setNearbyRestaurants(nearby);
                }
    }, [token, restaurants, user]); //run this when token/restaurants were changed...

    return <div>
        <Navbar /> 
        <div className="home-container">
        <CategoryBar />
        
        {/*previous restaurns...*/}
        {token && previousRestaurants.length > 0 && (
            <div className="previous-restaurants-section">
                <h2>Order Again</h2>
                <div className="previous-restaurants-row">
                    {previousRestaurants.map(r => (
                        <div key={r.id} className="horizontal-card-wrapper">
                            <RestaurantCard restaurant={r} />
                        </div>
                    ))}
                </div>
            </div>
        )}
        {/*nearby restaurns...*/}
        {token && user && user.role === 'user' && nearbyRestaurants.length > 0 && (
            <div className="nearby-restaurants-section">
                <h2>Near You</h2>
                <div className="nearby-restaurants-row">
                    {nearbyRestaurants.map(r => (
                        <div key={r.id} className="horizontal-card-wrapper">
                            <RestaurantCard restaurant={r} />
                        </div>
                    ))}
                </div>
            </div>
        )}
        <div className="home-header">
            <h2>Restaurants</h2>
            {token && user && user.role === 'restaurant' && (
                <button className="btn-primary" onClick={() => setShowAddRestaurant(true)}>
                    + Add Restaurant
                </button>
            )}
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        <div className="restaurants-grid">
            {restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
        </div>
        {showAddRestaurant && (
        <RestaurantForm
            restaurant={null}
            onSuccess={() => { setShowAddRestaurant(false); fetchRestaurants(); }}
            onClose={() => setShowAddRestaurant(false)}
        />
        )}
    </div>
}

window.Home = Home
