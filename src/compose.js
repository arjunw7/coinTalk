import React from 'react';
import axios from './axios.js';
import { Link } from 'react-router';
import { Header } from './header';

export class Compose extends React.Component {
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
        const { title, post_text, file } = this.state;
        const data = { title, post_text, file };
        let formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('post_text', post_text);
        axios.post('/post', formData)
        .then(resp => {
            if (resp.data.success) {
                location.replace('/#/profile/');
            } else {
                this.setState({
                    error: true
                })
            }
        })
        .catch((err) => {
            console.log('Error inside handleSubmit Compose', err);
        })
    }
    render() {
        return (
            <div>
                <Header image={this.props.image} />
                <div className="container">
                    <div className="compose">
                        {this.state.error && <div>Sorry, something went wrong. Try again!</div>}
                        <input className="title" onChange={(e) => this.handleChange(e.target.name, e.target.value) } name="title" type="text" placeholder="Title" />
                        <textarea name="post_text" rows="5" cols="80" onChange={(e) => this.handleChange(e.target.name, e.target.value) } placeholder="Tell your story..."></textarea>
                        <input id="file" type="file" name="file" className="file-input" onChange={(e) => this.setState({ file: e.target.files[0] }) } />
                        <label htmlFor="file" onChange={(e) => this.setState({ file: e.target.files[0] }) }>Choose a file</label>
                        <button type="submit" onClick={() => this.handleSubmit() }>Publish</button>
                    </div>
                </div>
            </div>
        );
    }
}
