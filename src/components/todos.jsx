//requirements
import {
    useState,
    useEffect
} from "react";
import {
    Link,
    useHistory
} from "react-router-dom";
import {
    BsBookmarkFill,
    BsFillTrashFill,
    BsBookmark,
    BsFiles,
    BsPaperclip,
    BsPlus,
    BsPencil,
} from "react-icons/bs";
import axios from "axios";
import { Nav, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";

export default function Todos(){

    //properties
    const history = useHistory()
    const [pending, setPending] = useState(true)
    const [todosChangePending, setTodosChangePending] = useState(false)
    const [initialized, setInitialized] = useState(false)
    const [todos, setTodos] = useState([])
    const [copied, setCopied] = useState(false)
    const [marked, setMarked] = useState(false)
    const [unmarked, setUnmarked] = useState(false)
    const [removed, setRemoved] = useState(false)

    //methods
    const neutralAlert = () => {
        setCopied(false)
        setMarked(false)
        setUnmarked(false)
        setRemoved(false)
        setTodosChangePending(false)
    }

    const setCopiedAlert = () => {
        setCopied(true)
        setMarked(false)
        setUnmarked(false)
        setRemoved(false)
    }

    const setMarkedAlert = () => {
        setCopied(false)
        setMarked(true)
        setUnmarked(false)
        setRemoved(false)
    }

    const setUnmarkedAlert = () => {
        setCopied(false)
        setMarked(false)
        setUnmarked(true)
        setRemoved(false)
    }

    const setRemovedAlert = () => {
        setCopied(false)
        setMarked(false)
        setUnmarked(false)
        setRemoved(true)
    }

    const getData = async () => {
        const userToken = localStorage.getItem("user_token")
        //I get all the todos (marked & unmarked) here:
        return axios.post(
            `${process.env.REACT_APP_SERVER_HOST}/auth/getUserByToken`,
            {userToken,},
            { headers:
                {
                    "api-key": process.env.REACT_APP_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        )
        .then( async response => {
            if(response.status === 200)
            {
                let {id} = response.data
                return axios.post(
                    `${process.env.REACT_APP_SERVER_HOST}/todos/get`,
                    {id,},
                    { headers:
                        {
                            "api-key": process.env.REACT_APP_API_KEY,
                            "Content-Type": "application/json"
                        }
                    }
                ).then( response => {
                    if(response.status === 200)
                    {
                        setTodos(response.data)
                        return setPending(false)
                    }
                })
            }
            return history.push("/login")
        })
    }

    const removeTodo = async (todo, currentTab) => {
        if(todo === null)
            return false
        return axios.post(
            `${process.env.REACT_APP_SERVER_HOST}/todos/delete`,
            {id : todo.id},
            { headers:
                {
                    "api-key": process.env.REACT_APP_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        )
        .then( async (response) => {
            if(response.status === 200)
            {
                setTodosChangePending(true)
                getData()
                setTimeout( () => neutralAlert(), process.env.REACT_APP_TODO_ACTION_ALERT_DELAY)
                return setRemovedAlert()
            }
        })
        .catch((e) => {})
    }

    const markTodo = async (id) => {
        return axios.post(
            `${process.env.REACT_APP_SERVER_HOST}/todos/mark`,
            {id,},
            { headers:
                {
                    "api-key": process.env.REACT_APP_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        )
        .then( (response) => {
            if(response.status === 200)
            {
                getData()
                setTimeout( () => neutralAlert(), process.env.REACT_APP_TODO_ACTION_ALERT_DELAY)
                return setMarkedAlert()
            }
        })
        .catch((e) => {})
    }

    const unmarkTodo = async (id) => {
        return axios.post(
            `${process.env.REACT_APP_SERVER_HOST}/todos/unmark`,
            {id,},
            { headers:
                {
                    "api-key": process.env.REACT_APP_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        )
        .then( response => {
            if(response.status === 200)
            {
                getData()
                setTimeout( () => neutralAlert(), process.env.REACT_APP_TODO_ACTION_ALERT_DELAY)
                return setUnmarkedAlert()
            }
        })
        .catch((e) => {})
    }

    const copyTodo = (todo) => {
        if(todo === null)
            return false
        navigator.clipboard.writeText(todo.task)
        setTimeout( () => neutralAlert(), process.env.REACT_APP_TODO_ACTION_ALERT_DELAY)
        return setCopiedAlert(true)
    }


    const getFullDateFromDateString = (dateString) => {
        const date = new Date(dateString)
        return date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear()
    }

    //partial components
    const generalTodosBuilder = todos === null ? nothingToShow : todos.filter(todo => todo.label_id === 1).map((todo) => {
        const todoDate = getFullDateFromDateString(todo.created_at)
        return(
            <div className="col-lg-4 p-3" key={todo.id}>
                <div className="w-100 todo-card py-4">
                    <br/>
                    {
                        todo.task
                    }
                    <OverlayTrigger overlay={<Tooltip>Mark</Tooltip>}>
                        <div className="btn btn-lg p-0 todo-icon mark-icon">
                            <BsBookmark onClick={() => markTodo(todo.id)}/>
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Remove</Tooltip>}>
                        <div className="btn btn-lg p-0 todo-icon trash-icon">
                            <BsFillTrashFill onClick={() => removeTodo(todo, 1)}/>
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Copy</Tooltip>}>
                        <div className="btn btn-lg p-0 todo-icon copy-icon" onClick={() => copyTodo(todo)}>
                            <BsFiles />
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                        <Link to={`/edit/${todo.id}`} className="btn btn-lg p-0 todo-icon edit-icon">
                            <BsPencil />
                        </Link>
                    </OverlayTrigger>
                    {
                        todo?.file_url?.length !== 0
                        ?
                        <OverlayTrigger overlay={<Tooltip>File</Tooltip>}>
                            <a href={todo.file_url} rel="noreferrer" target="_blank" className="btn btn-lg p-0 todo-icon attach-icon">
                                <BsPaperclip />
                            </a>
                        </OverlayTrigger>
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

    const importantTodosBuilder = todos === null ? nothingToShow : todos.filter(todo => todo.label_id === 2).map((todo) => {
        const todoDate = getFullDateFromDateString(todo.created_at)
        return(
            <div className="col-lg-4 p-3" key={todo.id}>
                <div className="w-100 todo-card py-4">
                    <br/>
                    {
                        todo.task
                    }
                    <OverlayTrigger overlay={<Tooltip>Mark</Tooltip>}>
                        <div className="btn btn-lg p-0 todo-icon mark-icon">
                            <BsBookmark onClick={() => markTodo(todo.id)}/>
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Remove</Tooltip>}>
                        <div className="btn btn-lg p-0 todo-icon trash-icon">
                            <BsFillTrashFill onClick={() => removeTodo(todo, 2)}/>
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Copy</Tooltip>}>
                        <div className="btn btn-lg p-0 todo-icon copy-icon" onClick={() => copyTodo(todo)}>
                            <BsFiles />
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                        <Link to={`/edit/${todo.id}`} className="btn btn-lg p-0 todo-icon edit-icon">
                            <BsPencil />
                        </Link>
                    </OverlayTrigger>
                    {
                        todo?.file_url?.length !== 0
                        ?
                        <OverlayTrigger overlay={<Tooltip>File</Tooltip>}>
                            <a href={todo.file_url} rel="noreferrer" target="_blank" className="btn btn-lg p-0 todo-icon attach-icon">
                                <BsPaperclip />
                            </a>
                        </OverlayTrigger>
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

    const todoTodosBuilder = todos === null ? nothingToShow : todos.filter(todo => todo.label_id === 3).map((todo) => {
        const todoDate = getFullDateFromDateString(todo.created_at)
        return(
            <div className="col-lg-4 p-3" key={todo.id}>
                <div className="w-100 todo-card py-4">
                    <br/>
                    {
                        todo.task
                    }
                    <OverlayTrigger overlay={<Tooltip>Mark</Tooltip>}>
                        <div className="btn btn-lg p-0 todo-icon mark-icon">
                            <BsBookmark onClick={() => markTodo(todo.id)}/>
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Remove</Tooltip>}>
                        <div className="btn btn-lg p-0 todo-icon trash-icon">
                            <BsFillTrashFill onClick={() => removeTodo(todo, 3)}/>
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Copy</Tooltip>}>
                        <div className="btn btn-lg p-0 todo-icon copy-icon" onClick={() => copyTodo(todo)}>
                            <BsFiles />
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                        <Link to={`/edit/${todo.id}`} className="btn btn-lg p-0 todo-icon edit-icon">
                            <BsPencil />
                        </Link>
                    </OverlayTrigger>
                    {
                        todo?.file_url?.length !== 0
                        ?
                        <OverlayTrigger overlay={<Tooltip>File</Tooltip>}>
                            <a href={todo.file_url} rel="noreferrer" target="_blank" className="btn btn-lg p-0 todo-icon attach-icon">
                                <BsPaperclip />
                            </a>
                        </OverlayTrigger>
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
                    <OverlayTrigger overlay={<Tooltip>Unmark</Tooltip>}>
                        <div className="btn btn-lg todo-icon p-0 marked mark-icon">
                            <BsBookmarkFill onClick={() => unmarkTodo(todo.id)} />
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Remove</Tooltip>}>
                        <div className="btn btn-lg todo-icon p-0 marked trash-icon">
                            <BsFillTrashFill onClick={() => removeTodo(todo, 0)}/>
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Copy</Tooltip>}>
                        <div className="btn btn-lg todo-icon p-0 marked copy-icon" onClick={() => copyTodo(todo)}>
                            <BsFiles />
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                        <Link to={`/edit/${todo.id}`} className="btn btn-lg p-0 todo-icon edit-icon">
                            <BsPencil />
                        </Link>
                    </OverlayTrigger>
                    {
                        todo.file_url.length !== 0
                        ?
                        <OverlayTrigger overlay={<Tooltip>File</Tooltip>}>
                            <a href={todo.file_url} rel="noreferrer" target="_blank" className="btn btn-lg p-0 todo-icon attach-icon">
                                <BsPaperclip />
                            </a>
                        </OverlayTrigger>
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

    const nothingToShow =
        <Link to="/create" className="col-lg-4 p-3">
            <div className="w-100 marked add-todo-card todo-card py-4">
                <BsPlus className="align-middle mx-auto my-auto" />
            </div>
        </Link>

    const [todosLabelBuilder, setTodosLabelBuilder] = useState()
    if( !initialized && !pending ){
        setTodosLabelBuilder(
            <>
                {
                    generalTodosBuilder
                }
            </>
        )
        setInitialized(true)
    }

    const showGeneralTodos = () => {
        setTodosLabelBuilder(
            <>
                {
                    generalTodosBuilder
                }
            </>
        )
    }

    const showImportantTodos = () => {
        setTodosLabelBuilder(
            <>
                {
                    importantTodosBuilder
                }
            </>
        )
    }

    const showTodoTodos = () => {
        setTodosLabelBuilder(
            <>
                {
                    todoTodosBuilder
                }
            </>
        )
    }

    //hooks (this method will be fired only once on the laod time)
    useEffect( () => {
        getData()
    }, [])
    return(
        pending
        ?
        <Spinner animation="border" className="text-dark-orange p-4 custom-spinner" role="status"></Spinner>
        :
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
                    <div className="col-lg-12 mb-5">
                        <Nav justify variant="tabs" defaultActiveKey="general-todos">
                            <Nav.Item>
                                <Nav.Link eventKey="general-todos" onSelect={showGeneralTodos}  className="text-dark-orange">General</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="important-todos" onSelect={showImportantTodos} className="text-dark-orange">Important</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="todo-todos" onClick={showTodoTodos} className="text-dark-orange">To Do</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>
                    <Link to="/create" className="col-lg-4 p-3">
                        <div className="w-100 marked add-todo-card todo-card py-4">
                            <BsPlus className="align-middle mx-auto my-auto" />
                        </div>
                    </Link>
                    {
                        todosChangePending
                        ?
                        <Spinner animation="border" className="text-dark-orange p-4 custom-spinner" role="status"></Spinner>
                        :
                        todosLabelBuilder
                    }
                    {
                        copied
                        &&
                        <div class="alert alert-info notification position-fixed border-0">
                            Copied To Clipboard
                        </div>
                    }
                    {
                        removed
                        &&
                        <div class="alert alert-info notification position-fixed border-0">
                            Removed ToDo
                        </div>
                    }
                    {
                        marked
                        &&
                        <div class="alert alert-info notification position-fixed border-0">
                            Marked ToDo
                        </div>
                    }
                    {
                        unmarked
                        &&
                        <div class="alert alert-info notification position-fixed border-0">
                            Unmarked ToDo
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}