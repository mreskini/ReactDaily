import { Link } from "react-router-dom"
import { BsPlus } from "react-icons/bs"
export default function addNewTodoLink(labelId){
    return(
        <Link to={`/create/${labelId}`} className="col-lg-4 p-3">
            <div className="w-100 marked add-todo-card todo-card py-4">
                <BsPlus className="align-middle mx-auto my-auto" />
            </div>
        </Link>
    )
}