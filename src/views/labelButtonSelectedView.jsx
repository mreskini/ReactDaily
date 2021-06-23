export default function LabelButtonSelected(title, changeTodoLabel, labelIndex){
    return(
        <div className="btn btn-dark-orange my-auto mr-3 active no-bg-hover-effect" onClick={() => changeTodoLabel(labelIndex)}>
            {
                title
            }
        </div>
    )
}