/*
 * NotFound.jsx - 404 Page
 * Shown when the user navigates to a route that doesn't exist.
 */

function NotFound() {
    const history = ReactRouterDOM.useHistory();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
        }}>
            {/* Wolt logo */}
            <span style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: '#009de0',
                letterSpacing: '-1px'
            }}>
                Wolt
            </span>

            {/* 404 number */}
            <h1 style={{
                fontSize: '7rem',
                fontWeight: '800',
                color: '#009de0',
                margin: 0,
                lineHeight: 1
            }}>
                404
            </h1>

            {/* Subtitle */}
            <p style={{
                fontSize: '1.3rem',
                color: 'var(--text-secondary)',
                margin: 0
            }}>
                Page not found
            </p>

            {/* Back home button */}
            <button
                className="btn-primary"
                onClick={() => history.push('/')}
                style={{ marginTop: '8px', padding: '12px 32px', fontSize: '1rem' }}
            >
                Back to Home
            </button>
        </div>
    );
}

window.NotFound = NotFound;
