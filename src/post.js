import React from 'react';
import axios from './axios';
import { Loading } from './loading';
import { Link } from 'react-router';
import { PostComments } from './postComments';
import { GetComments } from './getComments';
import { Header } from './header';

export class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.addToFavorites = this.addToFavorites.bind(this);
        this.removeFromFavorites = this.removeFromFavorites.bind(this);
        this.addComment = this.addComment.bind(this);
        this.commentData = this.commentData.bind(this);
        this.getComments = this.getComments.bind(this);
    }
    componentDidMount() {
        axios.get(`/single-post/${this.props.params.id}`)
        .then(({ data }) => {
            if (data.results.user_id && data.results.post_id) {
                this.setState({
                    favorite: true
                })
            }
            this.setState({
                data: data.results
            })
        })
    }
    addToFavorites() {
        axios.post(`/favorites/${this.props.params.id}`)
        .then((resp) => {
            if (resp.data.success) {
                this.setState({
                    favorite: !this.state.favorite
                })
            }
        })
    }
    removeFromFavorites() {
        axios.post(`/remove-from-favorites/${this.props.params.id}`)
        .then((resp) => {
            if (resp.data.success) {
                this.setState({
                    favorite: !this.state.favorite
                })
            }
        })
    }
    commentData(data) {
        this.setState({
            commentData: data
        })
    }
    addComment() {
        const commentData = this.state;
        const comment = commentData;
        axios.post(`/comment/${this.props.params.id}`, comment)
        .then((resp) => {
            this.getComments();
        })
    }
    getComments() {
        axios.get(`/get-comments/${this.props.params.id}`)
        .then(({ data }) => {
            this.setState({
                comments: data.results
            })
        })
    }
    render() {
        if (!this.state.data) {
            return (
                <Loading />
            )
        }
        const data = this.state.data;
        const userUrl = '/user/';
        return (
            <div>
            <Header image={this.props.image} />
                <div className="container">
                    <h2 className="blog-title post-title">{data.title}</h2>
                    <p className="post-text">{data.post_text}</p>
                    {!this.state.favorite && <button className="bookmark green-back" onClick={this.addToFavorites}><i className="fa fa-bookmark" aria-hidden="true"></i> Bookmark</button>}
                    {this.state.favorite && <button onClick={this.removeFromFavorites} className="bookmark red-back"><i className="fa fa-bookmark-o" aria-hidden="true"></i> Remove</button>}
                    <PostComments onClick={this.addComment} receiveData={this.commentData} />
                    <GetComments onClick={this.getComments} comments={this.state.comments} />
                </div>
                <div className="about-me">
                    <div className="others-bio-pic">
                        <img src={data.image} />
                    </div>
                    <div className="user">
                        <Link to={userUrl + data.id}><h1>Post by: {data.first_name} {data.last_name}</h1></Link>
                        <h2 className="post-about">About the author:</h2>
                        <p className="bio">{data.about}</p>
                    </div>
                </div>
            </div>
        )
    }
}
