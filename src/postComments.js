import React from 'react';
import axios from './axios';

export class PostComments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(name, value) {
        this.props.receiveData(value);
    }
    render() {
        return (
            <div className="post-comment">
                <input type="text" name="comment" onChange={(e) => this.handleChange(e.target.name, e.target.value) } placeholer="Add a comment" />
                <button onClick={this.props.onClick}>Comment</button>
            </div>
        )
    }
}
