import {
    OverlayTrigger,
    Tooltip
} from "react-bootstrap"
import {
    BsFillTrashFill,
    BsBookmark,
    BsFiles,
    BsPaperclip,
    BsPencil,
} from "react-icons/bs"
import { Link } from "react-router-dom"
export default function todoTemplate(todo, todoDate, markTodo, copyTodo, changeTobeDeletedTodo){
    return(
        <>
            <div className="col-lg-4 p-3" key={todo.id}>
                <div className="w-100 todo-card py-4">
                    <br/>
                    { todo.task }
                    <OverlayTrigger overlay={<Tooltip>Mark</Tooltip>}>
                        <div className="btn btn-lg p-0 todo-icon mark-icon" onClick={() => markTodo(todo.id)} > <BsBookmark /> </div>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip>Remove</Tooltip>}>
                        <div className="btn btn-lg p-0 todo-icon trash-icon" onClick={ () => changeTobeDeletedTodo(todo) } > <BsFillTrashFill /> </div>
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
}