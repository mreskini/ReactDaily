import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux"
import TodoListData from "./data/todoListData";
export default function Todos(){
    const history = useHistory()
    try{
        const user = useSelector(state => state.user)
    }
    catch(e){
        history.push("/login")
    }
    const [todos, setTodos] = useState(
        TodoListData.data
    )
    const removeTodo = (id) => {
        setTodos( () => {
            return todos.filter( todo => todo.id != id)
        })
        TodoListData.data = TodoListData.data.filter( todo => todo.id != id)
    }
    const todosBuilder = todos.map( (todo) => {
        return(
            <div className="col-lg-3 p-3" key={todo.id} onDoubleClick={() => removeTodo(todo.id)}>
                <div className="w-100 btn btn-outline-dark-orange py-4">
                    {
                        todo.task
                    }
                </div>
            </div>
        )
    })
    const nothingToShow = <p className="col-lg-12 display-4 text-center">Nothing to show</p>
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
                    {
                        todos.length == 0 ? nothingToShow : todosBuilder
                    }
                </div>
            </div>
        </div>
    );
}