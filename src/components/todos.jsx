//requirements
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { BsBookmarkFill, BsFillTrashFill, BsBookmark, BsFiles, BsPlusCircle, BsPaperclip } from "react-icons/bs";
import axios from "axios";
import { Dropdown } from "react-bootstrap";

export default function Todos(){

    //properties
    const history = useHistory()
    const [todos, setTodos] = useState([])
    const [markedTodos, setmarkedTodos] = useState([])
    const [copiedTodoId, setCopiedTodoId] = useState(-1)

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
                return axios.post(`${process.env.REACT_APP_SERVER_HOST}/todos/getUnmarked`, {id,})
                .then( response => setTodos(response.data) )
            }
        })
    }

    const getMarkedTodos = async () => {
        let userToken = localStorage.getItem("user_token")
        return axios.post(`${process.env.REACT_APP_SERVER_HOST}/auth/getUserByToken`, {userToken,})
        .then( async (response) => {
            if(response.status === 200)
            {
                let {id} = response.data
                return axios.post(`${process.env.REACT_APP_SERVER_HOST}/todos/getMarked`, {id,})
                .then( response => setmarkedTodos(response.data) )
            }
        })
    }

    const removeTodo = async (id) => {
        return axios.post(`${process.env.REACT_APP_SERVER_HOST}/todos/delete`, {id,})
        .then( (response) => {
            if(response.status === 200)
            {
                getTodos()
                getMarkedTodos()
            }
        })
        .catch((e) => {})
    }

    const markTodo = async (id) => {
        return axios.post(`${process.env.REACT_APP_SERVER_HOST}/todos/mark`, {id,})
        .then( (response) => {
            if(response.status === 200)
            {
                getTodos()
                getMarkedTodos()
            }
        })
        .catch((e) => {})
    }

    const unmarkTodo = async (id) => {
        return axios.post(`${process.env.REACT_APP_SERVER_HOST}/todos/unmark`, {id,})
        .then( (response) => {
            if(response.status === 200)
            {
                getTodos()
                getMarkedTodos()
            }
        })
        .catch((e) => {})
    }

    const copyTodo = (todo) => {
        navigator.clipboard.writeText(todo.task)
        setCopiedTodoId(todo.id)
    }
    //partial components
    const todosBuilder = todos.map( (todo) => {
        return(
            <div className="col-lg-4 p-3" key={todo.id}>
                <div className="w-100 todo-card py-4">
                    <br/>
                    {
                        todo.task
                    }
                    {
                        todo.id == copiedTodoId
                        ?
                        <div class="alert alert-info notification font-weight-bold bg-transparent position-absolute" role="alert">
                            Copied!
                        </div>
                        :
                        <></>
                    }
                    <div className="btn btn-lg p-0 todo-icon mark-icon">
                        <BsBookmark onClick={() => markTodo(todo.id)}/>
                    </div>
                    <div className="btn btn-lg p-0 todo-icon trash-icon">
                        <BsFillTrashFill onClick={() => removeTodo(todo.id)}/>
                    </div>
                    <div className="btn btn-lg p-0 todo-icon copy-icon" onClick={() => copyTodo(todo)}>
                        <BsFiles />
                    </div>
                    {
                        todo.file_url.length != 0
                        ?
                        <a href={todo.file_url} target="_blank" className="btn btn-lg p-0 todo-icon attach-icon">
                            <BsPaperclip />
                        </a>
                        :
                        <></>
                    }
                </div>
            </div>
        )
    })

    const markedTodosBuilder = markedTodos.map( (todo) => {
        return(
            <div className="col-lg-4 p-3" key={todo.id}>
                <div className="w-100 marked todo-card py-4">
                    <br/>
                    {
                        todo.task
                    }
                    {
                        todo.id == copiedTodoId
                        ?
                        <div class="alert alert-info notification position-absolute bg-transparent" role="alert">
                            Copied!
                        </div>
                        :
                        <></>
                    }
                    <div className="btn btn-lg todo-icon p-0 marked mark-icon">
                        <BsBookmarkFill onClick={() => unmarkTodo(todo.id)} />
                    </div>
                    <div className="btn btn-lg todo-icon p-0 marked trash-icon">
                        <BsFillTrashFill onClick={() => removeTodo(todo.id)}/>
                    </div>
                    <div className="btn btn-lg todo-icon p-0 marked copy-icon" onClick={() => copyTodo(todo)}>
                        <BsFiles />
                    </div>
                    {
                        todo.file_url.length != 0
                        ?
                        <a href={todo.file_url} target="_blank" className="btn btn-lg p-0 todo-icon attach-icon">
                            <BsPaperclip />
                        </a>
                        :
                        <></>
                    }
                </div>
            </div>
        )
    })

    const nothingToShow = <p className="col-lg-12 h2 text-center">Nothing to show</p>

    //hooks
    useEffect( () => {
        getTodos()
        getMarkedTodos()
    }, [])

    return(
        <div className="text-white">
            <div className="container-fluid">
                <div className="row m-5">
                    <div className="bg-object bg-object1"></div>
                    <div className="bg-object bg-object2"></div>
                    <div className="bg-object bg-object3"></div>
                    <div className="row">
                        <div className="todo-counter text-center">
                        {
                            todos.length + markedTodos.length
                        }
                        </div>
                        <Link  to="/logout" className="btn btn-lg custom-btn btn-outline-dark-orange exit-btn my-auto ml-4">
                            Log Out
                        </Link>
                    </div>
                    <p className="text-dark-orange display-1 col-lg-12 text-center pt-2">
                        <span className="text-white">
                            Daily
                        </span>
                        <span className="px-5 align-middle text-white">
                            •
                        </span>
                        <span>
                            Todos
                        </span>
                    </p>
                    <p className="col-lg-12 display-4">
                        <span className="display-1 align-middle">•</span>Marked
                    </p>
                    {
                        markedTodos.length === 0 ? nothingToShow : markedTodosBuilder
                    }
                    <p className="col-lg-12 display-4 mt-3">
                        <span className="display-1 align-middle">•</span>Other
                    </p>
                    {
                        todos.length === 0 ? nothingToShow : todosBuilder
                    }
                    <Link to="/create" className="add-new-btn custom-btn p-0 m-3" >
                        <BsPlusCircle />
                    </Link>
                </div>
            </div>
        </div>
    );
}