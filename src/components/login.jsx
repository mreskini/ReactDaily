//requirements
import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios  from "axios";

export default function Login(){

    //properties
    const history = useHistory()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)

    //methods
    const handleUsernameChange = (e) => setUsername(e.target.value)

    const handlePasswordChange = (e) => setPassword(e.target.value)

    const handleSubmit = (e) => {
        e.preventDefault();
        if( username.length === 0 || password.length === 0 )
            return setError(true)
        return axios.post(`${process.env.REACT_APP_SERVER_HOST}/auth/login`, {username, password})
        .then( response => {
            if(response.status === 200)
            {
                if (typeof(Storage) !== "undefined") //checks if the browser supports localstorages
                    localStorage.setItem("user_token", response.data.user_token);
                return history.push("/todos")
            }
            else
               return setError(true)
        })
        .catch((error) => {
            return setError(true)
        })
    }

    return(
        <div className="text-white">
            <div className="container-fluid">
                <div className="row">
                    <div className="bg-object bg-object1"></div>
                    <div className="bg-object bg-object2"></div>
                    <div className="bg-object bg-object3"></div>
                    <p className="text-dark-orange col-lg-12 display-1 text-center pt-5 mt-5">
                        <span className="text-white">
                            React
                        </span>
                        <span className="px-5 align-middle text-white">
                            •
                        </span>
                        <span>
                            Daily
                        </span>
                    </p>
                    <p className="col-lg-12 text-center text-lightgrey font-weight-normal h1">
                        Welcome Back
                    </p>
                   <form className="col-lg-5 mx-auto mt-4 p-0" onSubmit={handleSubmit}>
                        {
                            error && <p className="col-lg-12 text-danger text-left mx-auto h5 mt-3 font-weight-normal">Invalid Username Or Password</p>
                        }
                        <input type="text" onChange={handleUsernameChange} placeholder="Username" className="login-form-input" /> <br/>
                        <input type="password" onChange={handlePasswordChange} placeholder="Password" className="login-form-input" />
                        <div className="col-lg-12 text-center mt-5">
                            <input type="submit" value="Sign In" className="btn btn-outline-dark-orange px-5 btn-lg" />
                        </div>
                   </form>
                </div>
            </div>
        </div>
    );
}