export function reducer(state = {}, action) {

    if (action.type == 'GET_USER_PROFILE') {
        state = Object.assign({}, state, {
            loggedUser: action.loggedUser
            })
        }
    return state;
}
