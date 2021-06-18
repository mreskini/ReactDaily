//requirements
import { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import {
    BsBookmarkFill,
    BsFillTrashFill,
    BsBookmark,
    BsFiles,
    BsPaperclip,
    BsPlus,
    BsPencil,
} from "react-icons/bs"

import axios from "axios"

import {
    OverlayTrigger,
    Spinner,
    Tooltip
} from "react-bootstrap"
import { Button, Modal } from "react-bootstrap"

export default function Todos(){

    //properties
    const history = useHistory()
    const [pending, setPending] = useState(true)
    const [todosChangePending, setTodosChangePending] = useState(false)
    const [initialized, setInitialized] = useState(false)
    const [todos, setTodos] = useState([])
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)
    const [tobeDeletedTodo, setTobeDeletedTodo] = useState({})
    const [notifications, setNotifications] = useState(
        {
            copy: false,
            mark: false,
            unmark: false,
            remove: false
        }
    )
    const [labelId, setLabelId] = useState(3)

    //methods
    const neutralAlert = () => {
        setNotifications(
            { copy: false, mark: false, unmark: false, remove: false }
        )
        setTodosChangePending(false)
    }
    const changeTobeDeletedTodo = (todo) => {
        setShowDeleteConfirmationModal(true)
        setTobeDeletedTodo(todo)
    }
    const setCopiedAlert = () => setNotifications( { copy: true, mark: false, unmark: false, remove: false } )

    const setMarkedAlert = () => setNotifications( { copy: false, mark: true, unmark: false, remove: false } )

    const setUnmarkedAlert = () => setNotifications( { copy: false, mark: false, unmark: true, remove: false } )

    const setRemovedAlert = () => setNotifications( { copy: false, mark: false, unmark: false, remove: true } )

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
        console.log(tobeDeletedTodo)
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
                    return setRemovedAlert()
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
                    return setMarkedAlert()
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
                    return setUnmarkedAlert()
                }
            })
            .catch( (error) => {} )
    }

    const copyTodo = (todo) => {
        if(todo === null)
            return false
        navigator.clipboard.writeText(todo.task)
        setTimeout( () => neutralAlert(), process.env.REACT_APP_TODO_ACTION_ALERT_DELAY)
        return setCopiedAlert()
    }


    const getFullDateFromDateString = ( dateString ) => {
        const date = new Date( dateString )
        return date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear()
    }

    const createTodoBuilderTemplate = (labelId) => {
        const todosBuilder = todos === null ? <></> : todos.filter(todo => todo.label_id === labelId && todo.marked == 0).map((todo) => {
            const todoDate = getFullDateFromDateString(todo.created_at)
            return(
                <>
                    <div className="col-lg-4 p-3" key={todo.id}>
                        <div className="w-100 todo-card py-4">
                            <br/>
                            { todo.task }
                            <OverlayTrigger overlay={<Tooltip>Mark</Tooltip>}>
                                <div className="btn btn-lg p-0 todo-icon mark-icon"> <BsBookmark onClick={() => markTodo(todo.id)}/> </div>
                            </OverlayTrigger>
                            <OverlayTrigger overlay={<Tooltip>Remove</Tooltip>}>
                                <div className="btn btn-lg p-0 todo-icon trash-icon"> <BsFillTrashFill onClick={ () => changeTobeDeletedTodo(todo) }/> </div>
                            </OverlayTrigger>
                            <OverlayTrigger overlay={<Tooltip>Copy</Tooltip>}>
                                <div className="btn btn-lg p-0 todo-icon copy-icon" onClick={() => copyTodo(todo)}> <BsFiles /> </div>
                            </OverlayTrigger>
                            <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                                <Link to={`/edit/${todo.id}`} className="btn btn-lg p-0 todo-icon edit-icon"> <BsPencil /> </Link>
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
                            <div className="creation-date mx-auto"> { todoDate } </div>
                        </div>
                    </div>
                </>
            )
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
                        <div className="btn btn-lg todo-icon p-0 marked mark-icon">
                            <BsBookmarkFill onClick={() => unmarkTodo(todo.id)} />
                        </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Remove</Tooltip>}>
                        <div className="btn btn-lg todo-icon p-0 marked trash-icon">
                            <BsFillTrashFill onClick={() => changeTobeDeletedTodo(todo)} />
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

    const addNewTodoLink =
        <Link to={`/create/${labelId}`} className="col-lg-4 p-3">
            <div className="w-100 marked add-todo-card todo-card py-4">
                <BsPlus className="align-middle mx-auto my-auto" />
            </div>
        </Link>

    !initialized && !pending && setInitialized(true)

    const changeTodoLabel = (e) => setLabelId( parseInt(e.target.value) )

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

                    <p className="col-lg-12 display-4 mt-3 p-0 m-0">
                        <span className="display-1 align-middle">•</span>All
                    </p>

                    <div className="col-lg-12 mb-3">
                        <select name="todo-label" value={labelId} onChange={changeTodoLabel} className="btn btn-outline-dark-orange-no-over col-lg-12 p-2 h5">
                            <option value="1"> General </option>
                            <option value="2"> Important </option>
                            <option value="3" defaultChecked> To Do </option>
                        </select>
                    </div>
                    {
                        addNewTodoLink
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
                        ( notifications.copy || notifications.mark || notifications.unmark || notifications.remove )
                        &&
                        <div className="alert alert-info notification position-fixed border-0">
                            { notifications.copy && "Copied To Clipboard" }
                            { notifications.mark && "Marked ToDo" }
                            { notifications.unmark && "Unmarked ToDo" }
                            { notifications.remove && "Removed ToDo" }
                        </div>
                    }
                    <p className="col-lg-12 display-4 m-0 p-0">
                        <span className="display-1 align-middle">•</span>Marked
                    </p>

                    {
                        todos.filter(todo => todo.marked === 1).length === 0 ? addNewTodoLink : markedTodosBuilder
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