const notificationReducer = (state, action) => {
    switch(action.type){
        case "COPY":{
            return { copy: true, mark: false, unmark: false, remove: false }
        }
        case "MARK":{
            return { copy: false, mark: true, unmark: false, remove: false }
        }
        case "UNMARK":{
            return { copy: false, mark: false, unmark: true, remove: false }
        }
        case "REMOVE":{
            return { copy: false, mark: false, unmark: false, remove: true }
        }
        case "NEUTRAL":{
            return { copy: false, mark: false, unmark: false, remove: false }
        }
    }
}
export default notificationReducer