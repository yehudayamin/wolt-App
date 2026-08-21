/*
 * Login.jsx - Login Screen 
 *
 * Allows existing users to authenticate with username and password.
 * On success: stores JWT + user data in AppContext and redirects to home screen.

 */

function Login()
{

const [password,setPassword]=React.useState('');
const [error,setError] = React.useState('');
const [username,setUsername] = React.useState('');

//when we enters the page, we want the focus on username first.
const usernameRef = React.useRef(null)
React.useEffect(() => {
    usernameRef.current.focus()
}, [])

const history = ReactRouterDOM.useHistory(); //for navigation between screens
const { login } = React.useContext(AppContext); //call the function login

//function that runs after users click 'log-in'
async function handleSubmit() {
    //send (POST) the new data to server
    const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    const data = await res.json();

    if (res.status===200)
    {
        const userData = await fetch(`/api/users/${data.userId}`,{
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + data.token }
        });
        
        const userDataJson = await userData.json();
        login(data.token,userDataJson); //save token (JWT)
        history.push('/'); //go to home page
    }
    else if (res.status === 404) { setError("User not found") }
    else if (res.status === 401) { setError("Incorrect password") }
}

return (
    <div className="auth-container">
        <div className="auth-card">
            <h1 className="auth-title">Wolt</h1>
            
            <InputField
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                inputRef={usernameRef}
            />
            
            <InputField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
            />
            
            {error && <p className="error-message">{error}</p>}
            
            <button className="btn-primary" onClick={handleSubmit} style={{ width: '100%', padding: '12px' }}>Log In</button>

            <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Don't have an account?{' '}
                <span
                    onClick={() => history.push('/register')}
                    style={{ color: 'var(--accent-color)', fontWeight: '600', cursor: 'pointer' }}
                >
                    Sign up
                </span>
            </p>
        </div>
    </div>
)

}


window.Login=Login;