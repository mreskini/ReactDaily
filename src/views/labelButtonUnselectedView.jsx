export default function LabelButtonUnselected(title, changeTodoLabel, labelIndex){
    return(
        <div className="btn btn-outline-dark-orange my-auto mr-3" onClick={() => changeTodoLabel(labelIndex)}>
            {
                title
            }
        </div>
    )
}