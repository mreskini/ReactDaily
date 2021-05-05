import axios from "axios"
import { Redirect, Route } from "react-router"

export const ProtectedRoute = async ({
    component: Component,
    ...rest
}) => {
    let isAuthenticated = localStorage.getItem("user_token") !== null
    // if(localStorage.getItem("user_token") !== null)
    // {
    //     const userToken = localStorage.getItem("user_token")
    //     const response = await axios.post(`${process.env.REACT_APP_SERVER_HOST}/auth/getUserByToken`, {userToken,})
    //     if(response.status === 200)
    //         isAuthenticated = true
    // }
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