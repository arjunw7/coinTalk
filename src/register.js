import React from 'react';
import axios from './axios.js';
import { Link } from 'react-router';
import { Loading } from './loading';

export class Register extends React.Component {
    constructor(props) {
    super(props);
    this.state = {};
    }
    handleChange(name, value) {
        this.setState({
            [name]: value
        })
    }
    handleSubmit() {
        const {first_name, last_name, email, password} = this.state;
        const data = {first_name, last_name, email, password};
        axios.post('/register', data)
        .then(resp => {
            if (resp.data.success) {
                console.log(data);
                console.log('Success!');
                location.replace('/');
            } else {
                this.setState({
                    error: true
                })
            }
        })
        .catch((err) => {
            console.log('Error inside handleSubmit Register', err);
        })
    }
    render() {
        return (
            <div className="form">
                {this.state.error && <div>Sorry, something went wrong. Try again!</div>}
                <input onChange={(e) => this.handleChange(e.target.name, e.target.value) } name="first_name" type="text" placeholder="First Name" />
                <input onChange={(e) => this.handleChange(e.target.name, e.target.value) } name="last_name" type="text" placeholder="Last Name" />
                <input onChange={(e) => this.handleChange(e.target.name, e.target.value) } name="email" type="email" placeholder="Email" />
                <input onChange={(e) => this.handleChange(e.target.name, e.target.value) } name="password" type="password" placeholder="Password" />
                <button type="submit" onClick={() => this.handleSubmit() }>Join!</button>
            </div>
        );
    }
}
