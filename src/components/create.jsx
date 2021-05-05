//requirements
import {
    useState,
    useEffect
} from "react";
import {
    Link,
    useHistory
} from "react-router-dom";
import { AiOutlinePaperClip } from "react-icons/ai";
import axios from "axios";
import { ProgressBar } from "react-bootstrap";

export default function Create(){

    //properties
    const history = useHistory()
    const [user, setUser] = useState({})
    const [error, setError] = useState(false)
    const [fileUploadProgress, setFileUploadProgress] = useState(0.0)
    const [uploaded, setUploaded] = useState(false)
    const [pending, setPending] = useState(false)

    //properties - from data
    const [todoValue, setTodoValue] = useState("")
    const [uploadedFileUrl, setUploadedFileUrl] = useState("")


    //auth check
    if(localStorage.getItem("user_token") === null)
        history.push("/login")

    //methods
    const getUserByToken = async () => {
        let userToken = localStorage.getItem("user_token")
        //need some more auth check here to be sure that the use_token value i valid :)
        return axios.post(`${process.env.REACT_APP_SERVER_HOST}/auth/getUserByToken`, {userToken,})
        .then((response) => {
            if(response.status === 200)
                return setUser(response.data)
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(todoValue.length > 0)
            return axios.post(`${process.env.REACT_APP_SERVER_HOST}/todos/add`,
            {
                task: todoValue,
                fileUrl: uploadedFileUrl,
                id: user.id,
            })
            .then( response => {
                if(response.status === 200)
                    return history.push("/todos")
            })
            .catch( e => setError(true))
        return setError(true)
    }
    const onTodoInputChange = (e) => setTodoValue(e.target.value)

    const handleAttachFileChange = async (e) => {
        setPending(true)

        //form file data
        const file = e.target.files[0];
        const fd = new FormData()

        setFileUploadProgress(0.0)

        //note: attach the file always at last.s
        fd.append("file", file)

        //uploading the file to the server
        return axios.post(`${process.env.REACT_APP_SERVER_HOST}/todos/uploadFile`, fd, {
            onUploadProgress: ProgressEvent =>
                setFileUploadProgress(Math.floor(ProgressEvent.loaded / ProgressEvent.total * 100))
        })
        .then( response => {
            if(response.status == 200)
            {
                setUploadedFileUrl(response.data.fileDestinationUrl)
                setUploaded(true)
                setPending(false)
            }
        })
        .catch((e) => {})
    }
    //hooks
    useEffect( () => getUserByToken() , [])

    return(
        <div className="text-white">
            <div className="container-fluid">
                <div className="row">
                    <div className="bg-object bg-object1"></div>
                    <div className="bg-object bg-object2"></div>
                    <div className="bg-object bg-object3"></div>
                    <p className="text-dark-orange col-lg-12 display-1 text-center pt-5">
                        <span className="text-white">
                            Add
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
                            error
                            ?
                            <p className="col-lg-12 text-left text-danger h5">
                                The Field Is Invalid
                            </p>
                            :
                            <></>
                        }
                        <input type="text" autoFocus placeholder="Task Message" onChange={onTodoInputChange} className="login-form-input" /> <br/>
                        <div className="col-lg-12 border-0 text-left mt-3">
                            <label htmlFor="add-a-file" className="btn btn-outline-dark-orange col-lg-4 h5">
                                <AiOutlinePaperClip className="h4 align-middle my-auto mr-1" />
                                <span className="align-middle">
                                    Add a File
                                </span>
                            </label>
                            {
                                uploaded
                                ?
                                <span className="text-lightgrey pl-3">
                                    File Attached!
                                </span>
                                :
                                <></>
                            }
                        </div>
                        <div className="login-form-input border-0 p-0">
                            <ProgressBar variant="" label={uploaded ? "100%" : ""} striped now={fileUploadProgress} max={100} className="bg-light-darkish mt-4" />
                        </div>
                        <input type="file" onChange={handleAttachFileChange} className="d-none" id="add-a-file"/>
                        <Link to="/todos" className="btn btn-outline-light px-5 mt-5 btn-lg mr-3">Cancel</Link>
                        {
                            pending
                            ?
                            <input type="submit" disabled value="Add" className="btn disabled btn-secondary px-5 mt-5 btn-lg"/>
                            :
                            <input type="submit" value="Add" className="btn btn-outline-dark-orange px-5 mt-5 btn-lg"/>
                        }
                   </form>
                </div>
            </div>
        </div>
    );
}