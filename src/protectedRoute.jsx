import { Redirect, Route } from "react-router"
export const ProtectedRoute = ({
    component: Component,
    ...rest
}) => {
    let isAuthenticated = localStorage.getItem("user_token") !== null
    return (
        <Route
            {...rest}
            render={
                props => {
                    if(isAuthenticated)
                        return <Component {...props} />
                    else
                        return (
                            <Redirect to={
                                {
                                    pathname: "/login",
                                    state: {
                                        from: props.location
                                    }
                                }
                            } />
                        )
                }
            }
        />
    )
}