import React from 'react';
import axios from './axios';
import { Link } from 'react-router';
import { Loading } from './loading';
import { Coins } from './coinQtes';
import { Header } from './header';

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios.get('/all-posts')
        .then((resp) => {
            this.setState({
                posts: resp.data.posts
            })
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
            <div>
                {this.props.image && <Header image={this.props.image} />}
                <div className="container">
                <Coins />
                <h1 className="blog-title">Recent Posts</h1>
                { posts.map(post =>
                    <div className="news-article">
                        <Link to={postUrl + post.postid}>
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
            </div>
        )
    }
}
