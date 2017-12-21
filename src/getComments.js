import React from 'react';
import axios from './axios';
import { Loading } from './loading';

export class GetComments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        if (!this.props.comments) {
            return (
                <div className="comments">
                    <h4 onClick={this.props.onClick}>Show Comments</h4>
                </div>
            )
        }
        const comments = this.props.comments;
        return (
            <div className="comments">
                <div>
                    <h4>Comments <i className="fa fa-refresh green" aria-hidden="true" onClick={this.props.onClick}></i></h4>
                    {comments.length > 1 &&
                        <div>
                            {comments.map(comment =>
                            <div className="comment">
                                <h5>{comment.first_name} {comment.last_name}</h5>
                                <p>{comment.comment}</p>
                            </div>)}
                        </div>
                    }
                    {comments.length < 1 &&
                    <h4>No comments to show</h4>}
                </div>
            </div>
        )
    }
}
