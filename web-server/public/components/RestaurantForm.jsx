/*
 * RestaurantForm.jsx - Create/Edit Restaurant Modal
*/

function RestaurantForm({restaurant, onSuccess, onClose}){
    const { token } = React.useContext(AppContext);

    const CATEGORIES = [
        { name: 'Burgers',    emoji: '🍔' },
        { name: 'Pizza',      emoji: '🍕' },
        { name: 'Italian',    emoji: '🍝' },
        { name: 'Falafel',    emoji: '🧆' },
        { name: 'Hummus',     emoji: '🫘' },
        { name: 'Vegan',      emoji: '🥗' },
        { name: 'Vegetarian', emoji: '🥦' },
        { name: 'Cafes',      emoji: '☕' },
        { name: 'Chinese',    emoji: '🥡' },
        { name: 'Sushi',      emoji: '🍣' },
        { name: 'Home Food',  emoji: '🍲' },
        { name: 'Kosher',     emoji: '✡️' },
        { name: 'Noodles',    emoji: '🍜' },
    ];
    

    //states
    const [name,setName] = React.useState(restaurant ? restaurant.name : ''); //if there is a restaurant, set name = restaurant.name
    const [address, setAddress] = React.useState(restaurant ? restaurant.address : ''); //if there is a restaurant, set address = restaurant.address
    const [phoneNumber, setPhoneNumber] = React.useState(restaurant ? restaurant.phoneNumber : ''); //if there is a restaurant, set number = restaurant.number
    const [description, setDescription] = React.useState(restaurant ? restaurant.description : ''); //if there is a restaurant, set description = restaurant.description
    const [selectedCategories, setSelectedCategories] = React.useState(restaurant ? restaurant.categories : []);
    const [image, setImage] = React.useState(restaurant?.image || null);
    const imageRef = React.useRef(restaurant?.image || null);
    const [errors, setErrors] = React.useState({
        name: '',
        address: '',
        phoneNumber: '',
        description: ''
    }); 
    const [serverError, setServerError] = React.useState('');
    const [loading, setLoading] = React.useState(false)
    const [lat, setLat] = React.useState(32.0853);
    const [lng, setLng] = React.useState(34.7818);

    function toggleCategory(catName){
        if (selectedCategories.includes(catName)){
            setSelectedCategories(selectedCategories.filter(c => c !== catName));
        }
        else{
            setSelectedCategories([...selectedCategories, catName]);
        }
    }

    function validation(){
        const newErrors = {name: '', address: '', phoneNumber: '', description: ''};
        let valid = true;
        if (!name){
            newErrors.name = 'Name is required';
            valid = false;
        }
        if (!address){
            newErrors.address = 'Address is required';
            valid = false;
        }
        if (!phoneNumber){
            newErrors.phoneNumber = 'Phone is required';
            valid = false;
        }
        else if (!/^\d+$/.test(phoneNumber)){ //only numbers
            newErrors.phoneNumber = 'Digits only'; 
            valid = false;
        }
        if (!description) { 
            newErrors.description = 'Description is required'; 
            valid = false; 
        }
        if (lat < -90 || lat > 90){
            newErrors.lat = "Latitude must be between -90 and 90"
            valid = false;
        }
        if (lng < -180 || lng > 180) {
            newErrors.lng = "Longitude must be between -180 and 180"
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
        if (restaurant === null){//meaning the user tries to create a restaurant
            response = await fetch('/api/restaurants', { //create restaurant
                headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({name: name, address: address, phoneNumber: phoneNumber, description: description, categories: selectedCategories, lat: parseFloat(lat), lng: parseFloat(lng), image: imageRef.current})
            });
        }
        else{
            response = await fetch(`/api/restaurants/${restaurant.id}`, { //edit restaurant
                headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
                method: 'PATCH',
                body: JSON.stringify({name: name, address: address, phoneNumber: phoneNumber, description: description, categories: selectedCategories, lat: parseFloat(lat), lng: parseFloat(lng)})
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
      <h3>{restaurant ? 'Edit Restaurant' : 'Add Restaurant'}</h3>
     <InputField label="Name" type="text" value={name} onChange={e => setName(e.target.value)} error={errors.name} placeholder="Restaurant name"/>
     <InputField label="Address" type = "text" value={address} onChange={e => setAddress(e.target.value)} error={errors.address} placeholder="Restaurant Address"/>
     <InputField label="Latitude" type = "text" value={lat} onChange={e => setLat(e.target.value)} error={errors.lat} placeholder="Restaurant Address-Latitude"/>
     <InputField label="Longtitude" type = "text" value={lng} onChange={e => setLng(e.target.value)} error={errors.lng} placeholder="Restaurant Address-Longtitude"/>
     <InputField label="Phone Number" type = "text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} error={errors.phoneNumber} placeholder="Restaurant Phone Number"/>
     <InputField label="Description" type = "text" value={description} onChange={e => setDescription(e.target.value)} error={errors.description} placeholder="Restaurant Description"/>
      {/* Optional image. label makes it clear it's not required */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Cover Photo <span style={{ fontWeight: '400', fontSize: '0.8rem' }}>(optional)</span>
        </label>
        <div style={{ marginTop: '8px' }}>
          <ImagePicker onImageSelect={(b64) => { imageRef.current = b64; setImage(b64); }} error="" />
        </div>
      </div>
      <div className="categories-select">
        <label>Categories</label>
        {CATEGORIES.map(cat => (
          <button
            key={cat.name}
            className={selectedCategories.includes(cat.name) ? 'category-btn selected' : 'category-btn'}
            onClick={() => toggleCategory(cat.name)}
          >{cat.emoji} {cat.name}</button>
        ))}
      </div>
      {serverError && <p className="error-message">{serverError}</p>}
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}
          style={{ flex: 1, padding: '11px', borderRadius: '12px' }}>
          {restaurant ? 'Save Changes' : 'Create Restaurant'}
        </button>
        <button onClick={onClose}
          style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1.5px solid var(--error-color)', background: 'white', color: 'var(--error-color)', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' }}>
          Cancel
        </button>
      </div>
    </div>
  </div>
}

window.RestaurantForm = RestaurantForm