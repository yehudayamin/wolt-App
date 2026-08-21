/*
 * Provides global state accessible to all components via React Context:
 * - Current authenticated user info
 * - JWT token
 * - UI theme (light/dark)
 */

const AppContext = React.createContext(); //global variable that all compomemets can read from it directly


// AppProvider is the "bartender" - it holds all shared data (user, token, theme)
// and makes it accessible to every component in the app without passing it manually
function AppProvider({ children }) {
    const [user, setUser] = React.useState(null);
    const [token, setToken] = React.useState(null)
    const [theme, setTheme] = React.useState('light')
    const [loading, setLoading] = React.useState(true)
    //we choose name for setX function - for example setUser is the name of the function
    //that react will create for us - if we want to change the user value but we use useState
    //so it will change it automtically on page.


    //function get token (JWT) and userData (data of the user).
    //when user send name and password and click 'login' the Login Page send request to server.
    // the server returns JWT - in this time the login Page call login(token,userData) to update AppContext.
    function login(token, userData)
    {
        localStorage.setItem('token', token); //save token in localStorage
        localStorage.setItem('userId', userData.id) //save userid in localStorage
        setToken(token); //update the token in state 
        setUser(userData) //update the user in state
        // localStorage: permanent memory - survives page refresh
        // state: temporary memory - updates the screen immediately
    }

    function logout()
    {
        //when user logout from app.
        localStorage.removeItem('token'); //remove his JWT 
        setToken(null); //remove his token from state
        setUser(null); //remove his user data from state
    }

    function toggleTheme()
    {
        const newTheme = theme==='light' ? 'dark':'light'; //change the current theme

        setTheme(newTheme); //update the theme immediately (state)
        localStorage.setItem('theme',newTheme); //update the new theme (after refresh)

        if (newTheme==='dark')
        {
            // add to this body of the page that we in 'dark'. if we dark it's 
            // call body.dark (in main.css)
            document.body.classList.add('dark');     
        }
        else
        {
            document.body.classList.remove('dark')  
        }
    }
    function updateUser(userData) {
        setUser(userData);
    }

    React.useEffect(() => {
    //code that runs only when the component upload first time (after refresh)
    const savedToken = localStorage.getItem('token') //check if there is token in storage
    if(savedToken){ setToken(savedToken)
    const savedUserId = localStorage.getItem('userId')
    if (savedUserId) {
        fetch(`/api/users/${savedUserId}`, {
            headers: { 'Authorization': 'Bearer ' + savedToken }
        })
        .then(res => {
            if (!res.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                setToken(null);
                return null;
            }
            return res.json();
        })
        .then(data => { if (data) setUser(data); })
    }
    };
    const savedTheme = localStorage.getItem('theme') //check if there is theme in storage
    if (savedTheme){
        setTheme(savedTheme);
        if (savedTheme==='dark') {document.body.classList.add('dark')};
        //when refresh the page it loss his class body. so we need to write it again.
    }

    
        setLoading(false)
    }, [])
    return (
        <AppContext.Provider value={{ user, token, theme, loading, login, logout, toggleTheme, updateUser }}>
            {children}
        </AppContext.Provider>
    )
}


window.AppProvider = AppProvider
window.AppContext = AppContext
