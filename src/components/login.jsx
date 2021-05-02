import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux"
import axios  from "axios";
export default function Login(){

    const dispatch = useDispatch()
    const history = useHistory()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if(username.length == 0 || password.length == 0)
        return setError(true)
        axios.post(`${process.env.REACT_APP_SERVER_HOST}/auth/login`, {username, password})
        .then((response) => {
            if(response.status == 200)
            {
                if (typeof(Storage) !== "undefined")
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
                    <p className="text-dark-orange col-lg-12 text-center pt-5">
                        <span className="display-1 text-white">
                            React
                        </span>
                        <span className="display-3 px-5 align-middle text-white">
                            •
                        </span>
                        <span className="display-1">
                            Daily
                        </span>
                    </p>
                    <p className="col-lg-12 text-center text-secondary h3">
                        Enter your Username & Password to sign in.
                    </p>
                    {
                        error && <p className="col-lg-12 text-danger text-center mx-auto h5 mt-3">Invalid Username Or Password</p>
                    }
                   <form className="col-lg-6 mx-auto mt-4 p-0" onSubmit={handleSubmit}>
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