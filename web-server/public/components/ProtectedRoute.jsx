/*
 * Wraps protected routes to ensure only authenticated users can access them.
 * Unauthenticated users are redirected to /login automatically.
 */


//gets children: the component to render if the user is authenticated
function ProtectedRoute({children})
{
    const { token, loading } = React.useContext(AppContext);

    if (loading) return null;
    if (!token) return <ReactRouterDOM.Redirect to="/login" />;
    return children;
}

window.ProtectedRoute = ProtectedRoute