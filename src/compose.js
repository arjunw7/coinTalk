import React from 'react';
import axios from './axios.js';
import { Link } from 'react-router';

export class Compose extends React.Component {
    constructor(props) {
    super(props);
    this.state = {};
    }
    handleChange(name, value) {
        this.setState({
            [name]: value
        })
        console.log(name, value);
    }
    handleSubmit() {
        const { title, post_text } = this.state;
        const data = { title, post_text };
        axios.post('/post', data)
        .then(resp => {
            if (resp.data.success) {
                console.log(data);
                console.log('Success!');
                location.replace('/#/profile/');
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
            <div className="container">
                <div className="compose">
                    {this.state.error && <div>Sorry, something went wrong. Try again!</div>}
                    <input className="title" onChange={(e) => this.handleChange(e.target.name, e.target.value) } name="title" type="text" placeholder="Title" />
                    <textarea name="post_text" rows="5" cols="80" onChange={(e) => this.handleChange(e.target.name, e.target.value) }></textarea>
                    <button type="submit" onClick={() => this.handleSubmit() }>Post!</button>
                </div>
            </div>
        );
    }
}
