/*
 * EditProfile.jsx - Edit User Modal
*/

function EditProfile({onClose}){
    const { user, token, updateUser } = React.useContext(AppContext);

    //states
    const [name,setName] = React.useState(user ? user.name : ''); 
    const [address, setAddress] = React.useState(user ? user.address : ''); 
    const [phone, setPhone] = React.useState(user ? user.phone : ''); 
    const [errors, setErrors] = React.useState({}); 
    const [serverError, setServerError] = React.useState('');
    const [loading, setLoading] = React.useState(false)
    const [lat, setLat] = React.useState(user ? user.lat : 32.0853);
    const [lng, setLng] = React.useState(user ? user.lng : 34.7818);

    function validation(){
        const newErrors = {name: '', address: '', phone: ''};
        let valid = true;
        if (phone && !/^\d+$/.test(phone)){ //only numbers
            newErrors.phone = 'Digits only'; 
            valid = false;
        }
        if (lat && (lat < -90 || lat > 90)){
            newErrors.lat = "Latitude must be between -90 and 90"
            valid = false;
        }
        if (lng && (lng < -180 || lng > 180)) {
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
        response = await fetch(`/api/users/${user.id}`, { 
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'},
            method: 'PATCH',
            body: JSON.stringify({name: name, address: address, phone: phone, lat: parseFloat(lat), lng: parseFloat(lng)})
        });
        
        if (response.status === 204) {
            const res = await fetch(`/api/users/${user.id}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const updatedUser = await res.json();
            updateUser(updatedUser);
            onClose();
        }
        else {
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
      <h3>{'Edit Profile'}</h3>
     <InputField label="Name" type="text" value={name} onChange={e => setName(e.target.value)} error={errors.name} placeholder="User's name"/>
     {user && user.role === 'user' && (
        <>
        <InputField label="Address" type = "text" value={address} onChange={e => setAddress(e.target.value)} error={errors.address} placeholder="User's Address"/>
        <InputField label="Latitude" type = "text" value={lat} onChange={e => setLat(e.target.value)} error={errors.lat} placeholder="User's Address-Latitude"/>
        <InputField label="Longtitude" type = "text" value={lng} onChange={e => setLng(e.target.value)} error={errors.lng} placeholder="User's Address-Longtitude"/>
        </>
    )}
     <InputField label="Phone Number" type = "text" value={phone} onChange={e => setPhone(e.target.value)} error={errors.phone} placeholder="User's Phone Number"/>
      {serverError && <p className="error-message">{serverError}</p>}
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}
          style={{ flex: 1, padding: '11px', borderRadius: '12px' }}>
          {'Save Changes'}
        </button>
        <button onClick={onClose}
          style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1.5px solid var(--error-color)', background: 'white', color: 'var(--error-color)', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' }}>
          Cancel
        </button>
      </div>
    </div>
  </div>
}

window.EditProfile = EditProfile