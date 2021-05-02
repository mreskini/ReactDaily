//requirements
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

export default function Create(){

    //properties
    const history = useHistory()
    const [user, setUser] = useState({})
    const [todoValue, setTodoValue] = useState("")
    const [error, setError] = useState(false)


    //auth check
    if(localStorage.getItem("user_token") === null)
        history.push("/login")

    //methods
    const getUserByToken = async () => {
        let userToken = localStorage.getItem("user_token")
        axios.post(`${process.env.REACT_APP_SERVER_HOST}/auth/getUserByToken`, {userToken,})
        .then((response) => {
            if(response.status === 200)
                return setUser(response.data)
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if(todoValue.length > 0){
            const todo = {
                task: todoValue,
                id: user.id,
            }
            return axios.post(`${process.env.REACT_APP_SERVER_HOST}/todos/add`, todo)
            .then((response) => {
                if(response.status === 200){
                    setError(false)
                    return history.push("/todos")
                }
            })
            .catch((e) => {
                return setError(true)
            })
        }
        return setError(true)
    }
    const onTodoInputChange = (e) => setTodoValue(e.target.value)

    //hooks
    useEffect( () => getUserByToken() , [])

    return(
        <div className="text-white">
            <div className="container-fluid">
                <div className="row">
                    <div className="bg-object bg-object1"></div>
                    <div className="bg-object bg-object2"></div>
                    <div className="bg-object bg-object3"></div>
                    <p className="text-dark-orange col-lg-12 text-center pt-5">
                        <span className="display-1 text-white">
                            Add
                        </span>
                        <span className="display-3 px-5 align-middle text-white">
                            •
                        </span>
                        <span className="display-1">
                            Todo
                        </span>
                    </p>
                   <form className="col-lg-6 mx-auto mt-4 p-0 text-center" onChange={onTodoInputChange} onSubmit={handleSubmit}>
                        {
                            error
                            ?
                            <p className="col-lg-12 text-left text-danger h5">
                                The Field Is Invalid
                            </p>
                            :
                            <></>
                        }
                        <input type="text" autoFocus placeholder="Task Message" className="login-form-input" /> <br/>
                        <Link to="/todos" className="btn btn-outline-light px-5 mt-5 btn-lg mr-3">Cancel</Link>
                        <input type="submit" value="Add" className="btn btn-outline-dark-orange px-5 mt-5 btn-lg"/>
                   </form>
                </div>
            </div>
        </div>
    );
}