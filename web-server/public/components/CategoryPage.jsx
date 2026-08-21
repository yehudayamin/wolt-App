/*
 * CategoryPage.jsx - Filtered Restaurant List by Category (Task 6.4)
*/

function CategoryPage(){
    //hooks
    const { name } = ReactRouterDOM.useParams()
    const { token } = React.useContext(AppContext)

    //states
    const [restaurants, setRestaurants] = React.useState([]);
    const [loading, setLoading] = React.useState(false); //if we are loading something from the server
    const [error, setError] = React.useState(''); //error while loading


    //useEffect, re run when name changes
    React.useEffect(() => {
        async function fetchData(){
            setLoading(true);//update loading state
            const response = await fetch('/api/restaurants', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
            });
            if (response.ok){//if we got a response
                const data = await response.json();
                const filtered = data.filter(r => r.categories && r.categories.includes(name)); //filter the restaurants by the catergory
                setRestaurants(filtered); //update useState to show the filtered restaurants
            }
            else{
                setError('Failed to load restaurants');
            }
            setLoading(false);
            
        }
        fetchData();
    }, [name])

    return <div>
        <Navbar />
        <div className="category-page-container">
        <h2>{name}</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && restaurants.length === 0 && (
            <p>No restaurants found in this category.</p>
        )}
        <div className="restaurants-grid">
            {restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
        </div>
    </div>
}

window.CategoryPage = CategoryPage;
