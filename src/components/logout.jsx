//requirements
import { useHistory } from "react-router-dom"

export default function Logout(){

    //properties
    const history = useHistory()

    localStorage.removeItem("user_token")
    history.push("/login")

    return(
        <></>
    )
}