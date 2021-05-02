//requirements
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { BsBookmark } from "react-icons/bs";
import axios from "axios";

export default function Todos(){

    //properties
    const history = useHistory()
    const [todos, setTodos] = useState([])

    //auth check
    if(localStorage.getItem("user_token") === null)
        history.push("/login")

    //methods
    const getTodos = async () => {
        let userToken = localStorage.getItem("user_token")
        return axios.post(`${process.env.REACT_APP_SERVER_HOST}/auth/getUserByToken`, {userToken,})
        .then( async (response) => {
            if(response.status === 200)
            {
                let {id} = response.data
                return axios.post(`${process.env.REACT_APP_SERVER_HOST}/todos/get`, {id,})
                .then( response => setTodos(response.data) )
            }
        })
    }

    const removeTodo = async (id) => {
        return axios.post(`${process.env.REACT_APP_SERVER_HOST}/todos/delete`, {id,})
        .then( (response) => {
            if(response.status === 200)
                return getTodos()
        })
        .catch((e) => {})
    }
    //partial components
    const todosBuilder = todos.map( (todo) => {
        return(
            <div className="col-lg-3 p-3" key={todo.id} onDoubleClick={() => removeTodo(todo.id)}>
                <div className="w-100 btn btn-outline-dark-orange py-4">
                    {
                        todo.task
                    }
                    <div className="btn btn-outline-light btn-sm ml-5">
                        <BsBookmark />
                    </div>
                </div>
            </div>
        )
    })

    const nothingToShow = <p className="col-lg-12 display-4 text-center">Nothing to show</p>

    //hooks
    useEffect( () => getTodos(), [])

    return(
        <div className="text-white">
            <div className="container-fluid">
                <div className="row m-5">
                    <div className="bg-object bg-object1"></div>
                    <div className="bg-object bg-object2"></div>
                    <div className="bg-object bg-object3"></div>
                    <Link to="/create" className="btn btn-lg btn-dark-orange add-new-btn" >
                        Add New
                    </Link>
                    <Link to="/logout" className="btn btn-lg btn-outline-light add-exit-btn" >
                        Log Out
                    </Link>
                    {
                        todos.length === 0 ? nothingToShow : todosBuilder
                    }
                </div>
            </div>
        </div>
    );
}