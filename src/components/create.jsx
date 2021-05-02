import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
export default function Create(){
    const history = useHistory()
    const [user, setUser] = useState({})
    const goToLogin = () => {
        history.push("/login")
    }
    if(localStorage.getItem("user_token") === null)
        goToLogin()
    const getUserByToken = async () => {
        let userToken = localStorage.getItem("user_token")
        console.log(userToken)
        axios.post(`${process.env.REACT_APP_SERVER_HOST}/auth/getUserByToken`, {userToken,})
        .then((response) => {
            if(response.status == 200)
                setUser(response.data)
        })
    }
    const [todoValue, setTodoValue] = useState("")
    const [emptyError, setEmptyError] = useState(false)
    const handleSubmit = (e) => {
        e.preventDefault()
        if(todoValue.length > 0){
            const todo = {
                task: todoValue,
                id: user.id,
            }
            axios.post(`${process.env.REACT_APP_SERVER_HOST}/todos/add`, todo)
            .then((response) => {
                if(response.status == 200){
                    setEmptyError(false)
                    history.push("/todos")
                }
            })
            .catch((e) => {})
        }else{
            setEmptyError(true)
        }
    }
    const onTodoInputChange = (e) => {
        setTodoValue(e.target.value)
    }
    useEffect( async () => {
        await getUserByToken()
    }, [])
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
                            ToDo
                        </span>
                    </p>
                   <form className="col-lg-6 mx-auto mt-4 p-0 text-center" onChange={onTodoInputChange} onSubmit={handleSubmit}>
                        {
                            emptyError
                            ?
                            <p className="col-lg-12 text-left text-danger h5">
                                The Field Is Empty
                            </p>
                            :
                            <></>
                        }
                        <input type="text" autoFocus placeholder="Task Message" className="login-form-input" /> <br/>
                        <input type="submit" value="Add" className="btn btn-outline-dark-orange px-5 mt-5 btn-lg"/>
                   </form>
                </div>
            </div>
        </div>
    );
}