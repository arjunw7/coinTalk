import React from 'react';
import axios from './axios';
import { Link } from 'react-router';
import { Loading } from './loading';

export class Bookmarks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios.get('/favorites/')
        .then(({ data }) => {
            this.setState({
                posts: data.results
            })
            console.log(this.state.posts);
        })
    }
    render() {
        if (!this.state.posts) {
            return (
                <Loading />
            )
        }
        const posts = this.state.posts;
        const postUrl = '/post/';
        const userUrl = '/user/';
        return (
            <div className="container">
                <h1 className="blog-title">Bookmarks</h1>
                { posts.map(post =>
                <div className="news-article">
                    <Link to={postUrl + post.post_id}>
                        <img src={post.post_picture} className="news-pic" />
                        <div className="news-text">
                            <h2 className="news-title post">{post.title}</h2>
                            <h3>@ {post.blog_title}</h3>
                            <Link to={userUrl + post.author_id}>
                                <div className="profile-pic">
                                    <img src={post.image} />
                                </div>
                                <p className="description">By: {post.first_name} {post.last_name}</p>
                            </Link>
                        </div>
                    </Link>
                </div>
            )}
            </div>
        )
    }
}
