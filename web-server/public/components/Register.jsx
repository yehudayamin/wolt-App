/*
 * Allows new users to create an account with full profile information.
 * Includes client-side validation that matches the server-side rules.
 */

function Register()
{
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [name, setName] = React.useState('')
    const [phone, setPhone] = React.useState('')
    const [address, setAddress] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [image, setImage] = React.useState('')
    const [errors, setErrors] = React.useState({})
    const [serverError, setServerError] = React.useState('')
    const [successMessage, setSuccessMessage] = React.useState('')
    const [role, setRole] = React.useState('user')
    const [lat, setLat] = React.useState(32.0853);
    const [lng, setLng] = React.useState(34.7818);

    //when we enters the page, we want the focus on username first.
    const usernameRef = React.useRef(null)
    React.useEffect(() => {
        usernameRef.current.focus()
    }, [])
    const history = ReactRouterDOM.useHistory(); //for navigation between screens

    function handleRoleChange(newRole) {
        setRole(newRole);
        if (newRole !== 'user') {
            setImage('');
            setAddress('');
            setLat(32.0853);
            setLng(34.7818);
        }
    }


    function validate() {
        const newErrors = {}
        
        if (!username) newErrors.username = "Username is required"
        if (!password || password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
            newErrors.password = "Password must be at least 8 characters with letters and digits"
        if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match"
        if (!name) newErrors.name = "Name is required"
        if (!phone || !/^\d+$/.test(phone)) newErrors.phone = "Phone must contain digits only"
        if (role === 'user' && !address) newErrors.address = "Address is required"
        if (!email || !email.includes('@')) newErrors.email = "Invalid email format"
        if (role === 'user' && !image) newErrors.image = "Please select an image"
        if (role === 'user' && (lat < -90 || lat > 90))
            newErrors.lat = "Latitude must be between -90 and 90"
        if (role === 'user' && (lng < -180 || lng > 180)) 
            newErrors.lng = "Longitude must be between -180 and 180"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
        }

    async function handleSubmit() {
    //if invalid don't do nothing
    if (!validate()) return
    
    //post to server - new user.
    const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name, phone, address, email, image, role, lat: parseFloat(lat), lng: parseFloat(lng)})
    })
    const data = await res.json()
    
    if (res.status === 201) {
        setSuccessMessage("Registration successful! Redirecting to login...")
        setTimeout(() => history.push('/login'), 2000)
    }
    else if (res.status === 409) { setServerError("Username already exists") }
    else if (res.status === 400) { setServerError(data.error) }
}

return (
    <div className="auth-container">
        <div className="auth-card">
            <h1 className="auth-title">Create Account</h1>

            <InputField
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                inputRef={usernameRef}
                error={errors.username}
            />

            <InputField
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                error={errors.name}
            />

            <InputField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                error={errors.email}
            />

            <InputField
                label="Phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                error={errors.phone}
            />
            {role === 'user' && (
                <>
                <InputField
                    label="Address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address"
                    error={errors.address}
                />
                <InputField
                    label="Latitude"
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="Enter Latitude"
                    error={errors.lat}
                />
                <InputField
                    label="Longtitude"
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="Enter Longtitude"
                    error={errors.lng}
                />
                </>
            )}

            <InputField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                error={errors.password}
            />

            <InputField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                error={errors.confirmPassword}
            />
            {role === 'user' && (
                <ImagePicker
                    onImageSelect={(base64) => setImage(base64)}
                    error={errors.image}
                />
            )}
            <select value={role} onChange={e => handleRoleChange(e.target.value)}>
                <option value="user">Regular User</option>
                <option value="restaurant">Restaurant Owner</option>
            </select>
            {serverError && <p className="error-message">{serverError}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <button className="btn-primary" onClick={handleSubmit}>Create Account</button>

            <p style={{ marginTop: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Already have an account?{' '}
                <span
                    onClick={() => history.push('/login')}
                    style={{ color: 'var(--accent-color)', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Log in
                </span>
            </p>
        </div>
    </div>
)

}

window.Register=Register;