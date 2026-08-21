/*
 * The root React component that sets up React Router and defines all routes.
 * Wraps the entire app in AppProvider so all components have access to global state.

 */

function App()
{
    const { BrowserRouter, Switch, Route, Redirect } = ReactRouterDOM

    return (
        <AppProvider>
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route exact path="/" component={Home} />
                    <Route path="/orders" render={() => <ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                    <Route path="/category/:name" render={() => <ProtectedRoute><CategoryPage /></ProtectedRoute>} />
                    <Route path="/search/:query" render={() => <ProtectedRoute><SearchPage /></ProtectedRoute>} />
                    <Route path="/restaurant/:id" render={() => <ProtectedRoute><RestaurantPage /></ProtectedRoute>} />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        </AppProvider>
    )
}

window.App = App
