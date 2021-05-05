import { Redirect, Route } from "react-router"

export const ProtectedRoute = ({
    component: Component,
    ...rest
}) => {
    let isAuthenticated = localStorage.getItem("user_token");
    return (
        <Route
            {...rest}
            render={
                props => {
                    if(isAuthenticated)
                        return (<Component {...props} />)
                    else
                        return (
                            <Redirect to="/login" />
                        )
                }
            }
        >

        </Route>
    )
}