/*
 * ProductCard.jsx - Product (Menu Item) Card Component
 */

function ProductCard({product, restaurantId, onAddToCart, onEdit, onDelete, isOwner}){
    //hooks
    const { token, user } = React.useContext(AppContext)

    async function handleAddToCart(){ //set product as watched, update cpp server
        const response = await fetch(`/api/restaurants/${restaurantId}/products/${product.id}`, { 
                headers: { 'Authorization': 'Bearer ' + token},
                method: 'GET',
            });
        if (response.ok){
            onAddToCart(product); //if the request is ok
        }
        else{
            console.error('Failed to register view'); //show error in the console
        }
    }
    
    async function handleDelete(){
        const confirmed = window.confirm('Delete this product?'); //pop up window with message, and yes/no buttons
        if (!confirmed) // if the user pressed no
            return; 
        const response = await fetch(`/api/restaurants/${restaurantId}/products/${product.id}`, { 
                headers: { 'Authorization': 'Bearer ' + token},
                method: 'DELETE',
            });
            if (response.status === 204){//deleted successfully
                onDelete();
            }
            else{
                alert('Failed to delete product');
            }
    }

    return <div className="product-card card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Product image covers top half of card — only shown if product has an image */}
        {product.image && (
            <div style={{ width: '100%', height: '140px', overflow: 'hidden' }}>
                <img src={product.image} alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
        )}
        <div className="product-info" style={{ padding: '12px' }}>
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <span className="product-price">₪{product.price}</span>
        </div>
        <div className="product-actions" style={{ padding: '0 12px 12px' }}>
            <button className="product-btn product-btn-cart" title="Add to Cart" onClick={handleAddToCart}>🛒</button>
            {isOwner && (
            <button className="product-btn product-btn-edit" title="Edit" onClick={() => onEdit(product)}>✏️</button>
            )}
            {isOwner && (
            <button className="product-btn product-btn-delete" title="Delete" onClick={handleDelete}>🗑️</button>
            )}
        </div>
    </div>
}

window.ProductCard = ProductCard;


