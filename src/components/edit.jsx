//requirements
import {
    useState,
    useEffect
} from "react";
import {
    Link,
    useHistory,
    useParams
} from "react-router-dom";
import { AiOutlinePaperClip } from "react-icons/ai";
import axios from "axios";
import { ProgressBar, Spinner } from "react-bootstrap";
import { data } from "jquery";

export default function Edit(){

    //properties
    const history = useHistory()
    const {todo_id: id} = useParams()
    const [user, setUser] = useState({})
    const [error, setError] = useState("")
    const [fileUploadProgress, setFileUploadProgress] = useState(0.0)
    const [uploaded, setUploaded] = useState(false)
    const [pending, setPending] = useState(false)
    const [removed, setRemoved] = useState(false)
    const [labelId, setLabelId] = useState(0)
    const [loading, setLoading] = useState(true)

    //properties - from data
    const [todoValue, setTodoValue] = useState("")
    const [uploadedFileUrl, setUploadedFileUrl] = useState("")

    //methods
    const getData = async () => {
        let userToken = localStorage.getItem("user_token")
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
        .then( response => {
            if(response.status === 200){
                setUser(response.data)
                return axios.post(
                    `${process.env.REACT_APP_SERVER_HOST}/todos/getSingle`,
                    {id,},
                    { headers:
                        {
                            "api-key": process.env.REACT_APP_API_KEY,
                            "Content-Type": "application/json"
                        }
                    }
                )
                .then( response => {
                    if(response?.status === 200)
                    {
                        setTodoValue(response?.data?.task)
                        setUploadedFileUrl(response?.data?.file_url)
                        setLabelId(response?.data?.label_id)
                        setLoading(false)
                        if(response?.data?.file_url?.length > 0){
                            setPending(false)
                            setFileUploadProgress(100)
                            setUploaded(true)
                        }
                    }
                })
            }
            return history.push("/login")
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(todoValue.length > 0)
            return axios.post(
                `${process.env.REACT_APP_SERVER_HOST}/todos/update`,
                {
                    task: todoValue,
                    fileUrl: uploadedFileUrl,
                    id,
                    labelId,
                },
                { headers:
                    {
                        "api-key": process.env.REACT_APP_API_KEY,
                        "Content-Type": "application/json"
                    }
                }
            )
            .then( response => {
                if(response.status === 200)
                    return history.push("/todos")
            })
            .catch( e => setError("Something Went Wrong!"))
        return setError("Task Cannot Be Empty!")
    }
    const onTodoInputChange = (e) => setTodoValue(e.target.value)

    const removeAttachedFile = () => {
        return axios.post(
            `${process.env.REACT_APP_SERVER_HOST}/todos/deleteTodoFile`,
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
                setRemoved(true)
                setFileUploadProgress(0.0)
                setPending(false)
                setUploaded(false)
                setUploadedFileUrl("")
                return setTimeout( () => { setRemoved(false) } , 3000 )
            }
        })
        .catch((e) => {})
    }

    const handleAttachFileChange = async (e) => {
        setPending(true)

        //form file data
        const file = e.target.files[0];
        const fd = new FormData()

        setFileUploadProgress(0.0)

        //note: attach the file always at last.s
        fd.append("file", file)

        //uploading the file to the server
        return axios.post(
            `${process.env.REACT_APP_SERVER_HOST}/todos/uploadFile`,
            fd,
            {
                headers:
                {
                    "api-key": process.env.REACT_APP_API_KEY,
                    "Content-Type": "application/json"
                },
                onUploadProgress: ProgressEvent =>
                    setFileUploadProgress(Math.floor(ProgressEvent.loaded / ProgressEvent.total * 100))
            }
        )
        .then( response => {
            if(response.status === 200)
            {
                setUploadedFileUrl(response.data.fileDestinationUrl)
                setUploaded(true)
                setPending(false)
            }
        })
        .catch((e) => {})
    }
    const changeTodoLabel = (e) => {
        setLabelId(
            parseInt(e.target.value)
        )
    }
    //hooks
    useEffect( () => getData() , [])

    return(
        loading
        ?
        <Spinner animation="border" className="text-dark-orange p-4 custom-spinner" role="status"></Spinner>
        :
        <div className="text-white">
            <div className="container-fluid">
                <div className="row">
                    <div className="bg-object bg-object1"></div>
                    <div className="bg-object bg-object2"></div>
                    <div className="bg-object bg-object3"></div>
                    <p className="text-dark-orange col-lg-12 display-1 text-center pt-5 mt-5">
                        <span className="text-white">
                            Edit
                        </span>
                        <span className="px-5 align-middle text-white">
                            •
                        </span>
                        <span>
                            Todo
                        </span>
                    </p>
                <form className="col-lg-6 mx-auto mt-4 p-0 text-center"  onSubmit={handleSubmit}>
                        {
                            error?.length > 0 &&  <p className="col-lg-12 text-left text-danger text-error"> { error } </p>
                        }
                        <input type="text" autoFocus placeholder="Task Message" value={todoValue} onChange={onTodoInputChange} className="login-form-input" /> <br/>
                        <div className="col-lg-12 border-0 text-left mt-3">
                            <label htmlFor="add-a-file" className="btn btn-outline-dark-orange my-auto col-lg-4 h5">
                                <AiOutlinePaperClip className="h4 align-middle my-auto mr-1" />
                                <span className="align-middle">
                                    Add a File
                                </span>
                            </label>
                            {
                                uploaded
                                ?
                                <span className="text-lightgrey pl-3">
                                    <span className="mr-2 btn btn-outline-danger" onClick={removeAttachedFile}>
                                        X
                                    </span>
                                    <span className="align-middle">
                                        File Attached!
                                    </span>
                                </span>
                                :
                                <></>
                            }
                        </div>
                        <div className="login-form-input border-0 p-0">
                            <ProgressBar variant="" label={uploaded ? "100%" : ""} striped now={fileUploadProgress} max={100} className="bg-light-darkish mt-4" />
                        </div>
                        <input type="file" onChange={handleAttachFileChange} className="d-none" id="add-a-file"/>
                        <div className="col-lg-12 mt-4 text-left">
                            <select name="todo-label" value={labelId} onChange={changeTodoLabel} className="btn btn-outline-dark-orange-no-over p-2 col-lg-4 h5">
                                <option value="1">
                                    General
                                </option>
                                <option value="2">
                                    Important
                                </option>
                                <option value="3">
                                    To Do
                                </option>
                            </select>
                        </div>
                        <Link to="/todos" className="btn btn-outline-light px-5 mt-5 btn-lg mr-3">Cancel</Link>
                        {
                            pending
                            ?
                            <input type="submit" disabled value="Add" className="btn disabled btn-secondary px-5 mt-5 btn-lg"/>
                            :
                            <input type="submit" value="Edit" className="btn btn-dark-orange px-5 mt-5 btn-lg"/>
                        }
                </form>
                    {
                        removed
                        &&
                        <div class="alert alert-info notification position-fixed border-0">
                            Removed Attached File
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}