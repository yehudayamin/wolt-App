/*
 * PURPOSE:
 * Displays a single product result on the search results page.
 * Clicking navigates to the restaurant that owns this product.
 */

function ProductSearchResult({ product }) {
    const history = ReactRouterDOM.useHistory()

    return (
        <div
            className="product-search-result"
            onClick={() => history.push(`/restaurant/${product.restaurantId}`)}
        >
            <div className="psr-left">
                <span className="psr-name">{product.name}</span>
                <span className="psr-desc">{product.description}</span>
                <span className="psr-restaurant">🏪 Go to restaurant</span>
            </div>
            <span className="psr-price">₪{product.price}</span>
        </div>
    )
}

window.ProductSearchResult = ProductSearchResult