const initState = {
    user: {},
}
const mainReducer = (state = initState, action) => {
    if(action.type == "SET_USER"){
        return {
            user: action.user
        }
    }
}
export default mainReducer