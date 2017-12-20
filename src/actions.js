import axios from './axios';

export function getUserProfile() {
    return axios.get('/profile')
    .then(({ data }) => {
        return {
            type: 'GET_USER_PROFILE',
            loggedUser: data.results
        }
    })
}
