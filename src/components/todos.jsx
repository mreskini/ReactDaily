//requirements
import {
    useState,
    useEffect
} from "react"
import { Link } from "react-router-dom"
import {
    BsBookmarkFill,
    BsFillTrashFill,
    BsBookmark,
    BsFiles,
    BsPaperclip,
    BsPlus
} from "react-icons/bs"
import axios from "axios"

export default function Todos(){

    //properties
    const [todos, setTodos] = useState([])
    const [copiedTodoId, setCopiedTodoId] = useState(-1)

    //methods
    const getData = async () => {
        const userToken = localStorage.getItem("user_token")
        //here I need to check that the uesrToken is valid.
        //I get all the todos (marked & unmarked) here:
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
            {
                getData()
            }
        })
        .catch((e) => {})
    }

    const markTodo = async (id) => {
        return axios.post(`${process.env.REACT_APP_SERVER_HOST}/todos/mark`, {id,})
        .then( (response) => {
            if(response.status === 200)
            {
                getData()
            }
        })
        .catch((e) => {})
    }

    const unmarkTodo = async (id) => {
        return axios.post(`${process.env.REACT_APP_SERVER_HOST}/todos/unmark`, {id,})
        .then( (response) => {
            if(response.status === 200)
            {
                getData()
            }
        })
        .catch((e) => {})
    }

    const copyTodo = (todo) => {
        navigator.clipboard.writeText(todo.task)
        setCopiedTodoId(todo.id)
    }

    const getFullDateFromDateString = (dateString) => {
        const date = new Date(dateString)
        const fullDate = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear()
        return fullDate
    }
    //partial components
    const todosBuilder = todos.filter(todo => todo.marked === 0).map((todo) => {
        const todoDate = getFullDateFromDateString(todo.created_at)
        return(
            <div className="col-lg-4 p-3" key={todo.id}>
                <div className="w-100 todo-card py-4">
                    <br/>
                    {
                        todo.task
                    }
                    {
                        todo.id === copiedTodoId
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
                        todo.file_url.length !== 0
                        ?
                        <a href={todo.file_url} rel="noreferrer" target="_blank" className="btn btn-lg p-0 todo-icon attach-icon">
                            <BsPaperclip />
                        </a>
                        :
                        <></>
                    }
                    <div className="creation-date mx-auto">
                    {
                        todoDate
                    }
                    </div>
                </div>
            </div>
        )
    })

    const markedTodosBuilder = todos.filter(todo => todo.marked === 1).map( (todo) => {
        const todoDate = getFullDateFromDateString(todo.created_at)
        return(
            <div className="col-lg-4 p-3" key={todo.id}>
                <div className="w-100 marked todo-card py-4">
                    <br/>
                    {
                        todo.task
                    }
                    {
                        todo.id === copiedTodoId
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
                        todo.file_url.length !== 0
                        ?
                        <a href={todo.file_url} rel="noreferrer" target="_blank" className="btn btn-lg p-0 todo-icon attach-icon">
                            <BsPaperclip />
                        </a>
                        :
                        <></>
                    }
                    <div className="creation-date mx-auto">
                    {
                        todoDate
                    }
                    </div>
                </div>
            </div>
        )
    })

    const nothingToShow = <p className="col-lg-12 h2 text-center">Nothing to show</p>

    //hooks (this method will be fired only once on the laod time)
    useEffect( () => {
        getData()
    }, [])

    return(
        <div className="text-white">
            <div className="container-fluid">
                <div className="row m-5">
                    <div className="bg-object bg-object1"></div>
                    <div className="bg-object bg-object2"></div>
                    <div className="bg-object bg-object3"></div>
                    <div className="row col-lg-12">
                        <div className="todo-counter text-center">
                        {
                            todos.length
                        }
                        </div>
                        <Link  to="/logout" autoComplete="nope" className="btn btn-lg custom-btn btn-outline-dark-orange exit-btn my-auto ml-4">
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
                        todos.filter(todo => todo.marked === 1).length === 0 ? nothingToShow : markedTodosBuilder
                    }
                    <p className="col-lg-12 display-4 mt-3">
                        <span className="display-1 align-middle">•</span>Other
                    </p>
                    <Link to="/create" className="col-lg-4 p-3">
                        <div className="w-100 marked add-todo-card todo-card py-4">
                            <BsPlus className="align-middle mx-auto my-auto" />
                        </div>
                    </Link>
                    {
                        todos.filter(todo => todo.marked === 0).length === 0 ? nothingToShow : todosBuilder
                    }
                </div>
            </div>
        </div>
    );
}