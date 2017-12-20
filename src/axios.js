import axios from 'axios';

var instance = axios.create({
    xsrfCookieName: 'myob',
    xsrfHeaderName: 'csrf-token'
})

export default instance;
