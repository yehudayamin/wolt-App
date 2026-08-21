/*
 * SearchPage.jsx - Search Results Page 
 */

function SearchPage() {
    const { query } = ReactRouterDOM.useParams()
    const { token } = React.useContext(AppContext)

    const [results, setResults] = React.useState({ restaurants: [], products: [] })
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState('')

    React.useEffect(() => {
        async function fetchResults() {
            setLoading(true)
            setError('')
            const response = await fetch(`/api/search/${query}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            })
            if (response.ok) {
                const data = await response.json()
                setResults(data)
            } else {
                setError('Search failed. Please try again.')
            }
            setLoading(false)
        }
        fetchResults()
    }, [query])

    const totalResults = results.restaurants.length + results.products.length

    return (
        <div>
            <Navbar />
            <div className="search-page-container">

                <div className="search-page-header">
                    <h2 className="search-page-title">
                        Results for: <span style={{ color: 'var(--accent-color)' }}>"{query}"</span>
                    </h2>
                    {!loading && !error && (
                        <span className="search-page-count">
                            {totalResults} result{totalResults !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {loading && <p style={{ color: 'var(--text-secondary)' }}>Searching...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && totalResults === 0 && (
                    <div className="search-empty">
                        <p style={{ fontSize: '3rem' }}>🔍</p>
                        <p>No results found for "{query}"</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Try a different search term</p>
                    </div>
                )}

                {results.restaurants.length > 0 && (
                    <section className="search-section">
                        <div className="search-section-header">
                            <span className="search-section-icon">🍽️</span>
                            <h3>Restaurants</h3>
                            <span className="search-section-badge">{results.restaurants.length}</span>
                        </div>
                        <div className="restaurants-grid">
                            {results.restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
                        </div>
                    </section>
                )}

                {results.products.length > 0 && (
                    <section className="search-section">
                        <div className="search-section-header">
                            <span className="search-section-icon">🛍️</span>
                            <h3>Dishes</h3>
                            <span className="search-section-badge">{results.products.length}</span>
                        </div>
                        <div className="products-search-list">
                            {results.products.map(p => <ProductSearchResult key={p.id} product={p} />)}
                        </div>
                    </section>
                )}

            </div>
        </div>
    )
}

window.SearchPage = SearchPage