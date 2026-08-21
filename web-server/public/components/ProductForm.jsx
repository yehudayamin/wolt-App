
/*
 * RestaurantForm.jsx - Create/Edit Restaurant Modal
*/

function ProductForm({product, onSuccess, onClose, restaurantId}){
    const { token } = React.useContext(AppContext);

    //states
    const [name,setName] = React.useState(product ? product.name : ''); 
    const [description, setDescription] = React.useState(product ? product.description : ''); 
    const [price, setPrice] = React.useState(product? product.price : '');
    const [image, setImage] = React.useState(product?.image || null);
    const imageRef = React.useRef(product?.image || null);
    const [errors, setErrors] = React.useState({
        name: '',
        description: '',
        price: ''
    }); 
    const [serverError, setServerError] = React.useState('');
    const [loading, setLoading] = React.useState(false)


    function validation(){
        const newErrors = {name: '', price: '', description: ''};
        let valid = true;
        if (!name){
            newErrors.name = 'Name is required';
            valid = false;
        }
        if (!price || parseFloat(price) <= 0 || isNaN(parseFloat(price))) {
            newErrors.price = 'Price must be a positive number';
            valid = false;
        }
        if (!description) { 
            newErrors.description = 'Description is required'; 
            valid = false; 
        }
        setErrors(newErrors);// set the new errors using useState
        return valid;
    }

    async function handleSubmit(){
        if (!validation())
            return;
        setLoading(true);
        let response;
        if (product === null){
            response = await fetch(`/api/restaurants/${restaurantId}/products`, { //create a product
                headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({name: name, price: parseFloat(price), description: description, image: imageRef.current})
            });
        }
        else{
            response = await fetch(`/api/restaurants/${restaurantId}/products/${product.id}`, {//edit a product
                headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
                method: 'PATCH',
                body: JSON.stringify({name: name, price: parseFloat(price), description: description, image: imageRef.current})
            });
        }
        if (response.status === 201 || response.status === 204) { //if status code is 201 (created) or 204 (updated), call onSuccess function
            onSuccess();
        } else {
            try {
                const data = await response.json(); //wait for the body
                setServerError(data.error || `Error ${response.status}`);
            } catch {
                setServerError(`Error ${response.status}`);
            }
        }
        setLoading(false);
    }

    
    return <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content card" onClick={e => e.stopPropagation()}>
        <h3>{product ? 'Edit Product' : 'Add Product'}</h3>
        <InputField label="Name" type="text" value={name} onChange={e => setName(e.target.value)} error={errors.name} placeholder="Product name"/>
        <InputField label="Description" type = "text" value={description} onChange={e => setDescription(e.target.value)} error={errors.description} placeholder="Product Description"/>
        <InputField label="Price (₪)" type="number" value={price} onChange={e => setPrice(e.target.value)} error={errors.price} placeholder="0"/>
        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Product Photo <span style={{ fontWeight: '400', fontSize: '0.8rem' }}>(optional)</span>
          </label>
          <div style={{ marginTop: '8px' }}>
            <ImagePicker onImageSelect={(b64) => { imageRef.current = b64; setImage(b64); }} error="" />
          </div>
        </div>
        {serverError && <p className="error-message">{serverError}</p>}
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}
            style={{ flex: 1, padding: '11px', borderRadius: '12px' }}>
            {product ? 'Save Changes' : 'Add Product'}
          </button>
          <button onClick={onClose}
            style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1.5px solid var(--error-color)', background: 'white', color: 'var(--error-color)', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' }}>
            Cancel
          </button>
        </div>
        </div>
    </div>
}

window.ProductForm = ProductForm