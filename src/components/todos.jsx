//requirements
import { useState, useEffect, useReducer } from "react"
import { Link, useHistory } from "react-router-dom"
import {
    BsBookmarkFill,
    BsFillTrashFill,
    BsBookmark,
    BsFiles,
    BsPaperclip,
    BsPencil,
} from "react-icons/bs"

import axios from "axios"

import {
    OverlayTrigger,
    Spinner,
    Tooltip
} from "react-bootstrap"
import { Modal } from "react-bootstrap"
import notificationReducer from "../reducers/notificationReducer"
import addNewTodoLink from "../views/addNewTodoLinkView"
import todoTemplate from "../views/todoTemplateView"

export default function Todos(){

    //properties
    const history = useHistory()
    const [pending, setPending] = useState(true)
    const [todosChangePending, setTodosChangePending] = useState(false)
    const [initialized, setInitialized] = useState(false)
    const [todos, setTodos] = useState([])
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)
    const [tobeDeletedTodo, setTobeDeletedTodo] = useState({})
    const [notificationsState, notificationsDispatch] = useReducer(notificationReducer, { copy: false, mark: false, unmark: false, remove: false })
    const [labelId, setLabelId] = useState(3)

    //methods
    const neutralAlert = () => {
        notificationsDispatch({type: "NEUTRAL"})
        setTodosChangePending(false)
    }
    const changeTobeDeletedTodo = (todo) => {
        setShowDeleteConfirmationModal(true)
        setTobeDeletedTodo(todo)
    }

    const createReqHeader = () => {
        return {
            headers:
            {
                "api-key": process.env.REACT_APP_API_KEY,
                "Content-Type": "application/json"
            }
        }
    }

    const getData = async () => {
        const userToken = localStorage.getItem("user_token")
        const reqRoute = `${process.env.REACT_APP_SERVER_HOST}/auth/getUserByToken`
        const reqBody = {userToken,}
        const reqHeader = createReqHeader()

        return axios.post( reqRoute, reqBody, reqHeader )
            .then( async response => {
                if(response.status === 200)
                {
                    let {id} = response.data
                    const reqRoute =  `${process.env.REACT_APP_SERVER_HOST}/todos/get`
                    const reqBody = {id,}
                    return axios.post( reqRoute, reqBody, reqHeader )
                        .then( response => {
                            if(response.status === 200)
                            {
                                setTodos(response.data)
                                return setPending(false)
                            }
                        })
                }
                return navigateToLoginRoute()
            })
            .catch( error => {})
    }

    const navigateToLoginRoute = () => history.push("/login")

    const removeTodo = async () => {
        if(tobeDeletedTodo === null)
            return false
        setShowDeleteConfirmationModal(false)
        const reqRoute = `${process.env.REACT_APP_SERVER_HOST}/todos/delete`
        const reqBody = {id : tobeDeletedTodo.id}
        const reqHeader = createReqHeader()

        return axios.post( reqRoute, reqBody, reqHeader, )
            .then( async (response) => {
                if(response.status === 200)
                {
                    setTodosChangePending(true)
                    getData()
                    setTimeout( () => neutralAlert(), process.env.REACT_APP_TODO_ACTION_ALERT_DELAY)
                    return notificationsDispatch({type: "REMOVE"})
                }
            })
            .catch( ( error ) => {})
    }

    const markTodo = async (id) => {
        const reqRoute = `${process.env.REACT_APP_SERVER_HOST}/todos/mark`
        const reqBody = {id,}
        const reqHeader = createReqHeader()

        return axios.post( reqRoute, reqBody, reqHeader, )
            .then( (response) => {
                if(response.status === 200)
                {
                    getData()
                    setTimeout( () => neutralAlert(), process.env.REACT_APP_TODO_ACTION_ALERT_DELAY)
                    return notificationsDispatch({type: "MARK"})
                }
            })
            .catch( (error) => {} )
    }

    const unmarkTodo = async (id) => {
        const reqRoute = `${process.env.REACT_APP_SERVER_HOST}/todos/unmark`
        const reqBody = {id,}
        const reqHeader = createReqHeader()

        return axios.post( reqRoute, reqBody, reqHeader, )
            .then( (response) => {
                if(response.status === 200)
                {
                    getData()
                    setTimeout( () => neutralAlert(), process.env.REACT_APP_TODO_ACTION_ALERT_DELAY)
                    return notificationsDispatch({type: "UNMARK"})
                }
            })
            .catch( (error) => {} )
    }

    const copyTodo = (todo) => {
        if(todo === null)
            return false
        navigator.clipboard.writeText(todo.task)
        setTimeout( () => neutralAlert(), process.env.REACT_APP_TODO_ACTION_ALERT_DELAY)
        return notificationsDispatch({type: "COPY"})
    }

    const getFullDateFromDateString = ( dateString ) => {
        const date = new Date( dateString )
        return date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear()
    }

    const createTodoBuilderTemplate = (labelId) => {
        const todosBuilder = todos === null ? <></> : todos.filter(todo => todo.label_id === labelId && todo.marked == 0).map((todo) => {
            const todoDate = getFullDateFromDateString(todo.created_at)
            return todoTemplate(todo, todoDate, markTodo, copyTodo, changeTobeDeletedTodo)
        })
        return todosBuilder
    }

    //partial components
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
                        <div className="btn btn-lg todo-icon p-0 marked mark-icon" onClick={() => unmarkTodo(todo.id)}>
                            <BsBookmarkFill />
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Remove</Tooltip>}>
                        <div className="btn btn-lg todo-icon p-0 marked trash-icon" onClick={() => changeTobeDeletedTodo(todo)}>
                            <BsFillTrashFill />
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

    !initialized && !pending && setInitialized(true)

    const changeTodoLabel = (index) => setLabelId( parseInt(index) )
    const createTodoButtonLabel = (labelIndex, title) => {
        return(
            labelId == labelIndex
            ?
            <div className="btn btn-dark-orange my-auto mr-3 active no-bg-hover-effect" onClick={() => changeTodoLabel(labelIndex)}>
                {
                    title
                }
            </div>
            :
            <div className="btn btn-outline-dark-orange my-auto mr-3" onClick={() => changeTodoLabel(labelIndex)}>
                {
                    title
                }
            </div>
        )
    }

    //hooks
    useEffect( () => getData(), [])
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
                        <div className="todo-counter bg-darkish text-center my-auto">
                        { todos.length }
                        </div>
                        <Link  to="/logout" autoComplete="nope" className="btn btn-lg custom-btn btn-outline-dark-orange exit-btn my-auto ml-4">
                            Log Out
                        </Link>
                        <div className="text-dark-orange display-1 ml-5  text-center">
                            <span className="text-white"> Daily </span>
                            <span className="px-5 my-auto text-white"> • </span>
                            <span> Todos </span>
                        </div>
                    </div>

                    <p className="col-lg-12 h1 mt-3 p-0 m-0 my-auto">
                        <div className="row m-0">
                            <div className="my-auto align-middle mr-3">
                                <span className="display-1 align-middle">•</span>
                                <span className="align-middle my-auto">All</span>
                            </div>
                            {
                                createTodoButtonLabel(1, "General")
                            }
                            {
                                createTodoButtonLabel(2, "Important")
                            }
                            {
                                createTodoButtonLabel(3, "To Do")
                            }
                        </div>
                    </p>
                    {
                        addNewTodoLink(labelId)
                    }
                    {
                        todosChangePending
                        ?
                        <Spinner animation="border" className="text-dark-orange p-4 custom-spinner" role="status"></Spinner>
                        :
                        <>
                        {
                            labelId == 1 ? createTodoBuilderTemplate(1) :
                                labelId == 2 ? createTodoBuilderTemplate(2) :
                                    labelId == 3 ? createTodoBuilderTemplate(3) : <></>
                        }
                        </>
                    }
                    {
                        ( notificationsState.copy || notificationsState.mark || notificationsState.unmark || notificationsState.remove )
                        &&
                        <div className="alert alert-info notification position-fixed border-0 buttom-to-top-animation">
                            { notificationsState.copy && "Copied To Clipboard" }
                            { notificationsState.mark && "Marked ToDo" }
                            { notificationsState.unmark && "Unmarked ToDo" }
                            { notificationsState.remove && "Removed ToDo" }
                        </div>
                    }
                    <p className="col-lg-12 display-4 m-0 p-0">
                        <span className="display-1 align-middle">•</span>Marked
                    </p>
                    {
                        todos.filter(todo => todo.marked === 1).length === 0 ? addNewTodoLink(labelId) : markedTodosBuilder
                    }

                    <Modal className="delete-todo-modal mt-5 py-5" show={showDeleteConfirmationModal} onHide={() => setShowDeleteConfirmationModal(false)}>

                        <Modal.Header className="delete-todo-modal-header">
                            <Modal.Title className="h4 font-weight-light">Delete Todo Confirmation</Modal.Title>
                        </Modal.Header>

                        <Modal.Body className="delete-todo-modal-body font-weight-light">Do You Want To Delete This Todo?</Modal.Body>

                        <Modal.Footer className="delete-todo-modal-footer">
                            <button className="btn btn-outline-light" onClick={() => setShowDeleteConfirmationModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-dark-orange" onClick={removeTodo}>
                                Yes
                            </button>
                        </Modal.Footer>

                    </Modal>

                </div>
            </div>
        </div>
    )
}
//380
//395