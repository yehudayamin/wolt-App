/*
 * Navbar.jsx-Top Navigation Bar
 * Displayed on every protected screen (Home, RestaurantPage, OrdersPage, etc.)
 */

function Navbar() {
    // Pull shared state and actions from AppContext
    const { user, logout, toggleTheme, theme } = React.useContext(AppContext);

    const history = ReactRouterDOM.useHistory();
    // Controlled input for the search bar
    const [searchQuery, setSearchQuery] = React.useState('');
    const [showProfile, setShowProfile] = React.useState(false); //state to show user profile
    // Navigate to search results page — ignores empty/whitespace queries
    const handleSearch = () => {
        if (searchQuery.trim()) {
            history.push(`/search/${searchQuery.trim()}`);
        }
    };

    // Allow submitting search with the Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    // Clear app state and send user back to login
    const handleLogout = () => {
        logout();
        history.push('/');
    };

    return (
        <div>
        <nav className="navbar">

            {/* LEFT: brand logo — clicking returns to home */}
            <span className="navbar-brand" onClick={() => history.push('/')}>
                Wolt
            </span>

            {/* CENTER: search input + search button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                    type="text"
                    placeholder="Search restaurants or dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--input-bg)',
                        color: 'var(--text-primary)',
                        width: '300px',
                        outline: 'none',
                        fontSize: '0.9rem'
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
                >
                    🔍
                </button>
            </div>

            {/* RIGHT: theme toggle + conditional auth buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                <button
                    onClick={toggleTheme}
                    title="Toggle theme"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px' }}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>

                {user ? (
                    <>
                        <button
                            className="btn-primary"
                            onClick={() => history.push('/orders')}
                            style={{ padding: '8px 16px' }}
                        >
                            My Orders
                        </button>

                        <div onClick={() => setShowProfile(true)} style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {user.image && (
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '2px solid var(--accent-color)'
                                    }}
                                />
                            )}
                            <span style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '0.95rem' }}>
                                {user.name}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'none',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                cursor: 'pointer',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem'
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="btn-primary"
                            onClick={() => history.push('/login')}
                            style={{ padding: '8px 16px' }}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => history.push('/register')}
                            style={{
                                background: 'none',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                cursor: 'pointer',
                                color: 'var(--text-primary)',
                                fontSize: '0.9rem'
                            }}
                        >
                            Register
                        </button>
                    </>
                )}

            </div>
        </nav>
            {showProfile && (
                <EditProfile onClose={() => setShowProfile(false)} />
            )}
        </div>
    );
}

window.Navbar = Navbar;
