import React from 'react';
import axios from './axios';
import { Link, browserHistory } from 'react-router';
import { Loading } from './loading';
import { Header } from './header';

export class OtherUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.follow = this.follow.bind(this);
        this.unFollow = this.unFollow.bind(this);
    }
    componentDidMount() {
    axios.get(`/other-user/${this.props.params.id}`)
        .then(({ data }) => {
            if (data.isLoggedInUser) {
                location.replace('/#/profile/');
            } else {
                if (data.results.author) {
                    this.setState({
                        following: true
                    })
                }
                this.setState({
                    userPosts: data.userPosts,
                    profile: data.results
                })
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }
    follow() {
        axios.post(`/follow-request/${this.props.params.id}`)
        .then((resp) => {
            if (resp.data.success) {
                this.setState({
                    following: !this.state.following
                })
            }
        })
    }
    unFollow() {
        axios.post(`/unfollow-request/${this.props.params.id}`)
        .then((resp) => {
            if (resp.data.success) {
                this.setState({
                    following: !this.state.following
                })
            }
        })
    }
    render() {
        if (!this.state.userPosts) {
            return (
                <Loading />
            )
        }
        const userPosts = this.state.userPosts;
        const profile = this.state.profile;
        const postUrl = '/post/';
        return (
            <div>
                <Header image={this.props.image} />
                <div className="container text">
                    <h2 className="blog-title">{profile.blog_title}</h2>
                    { userPosts.map(post =>
                        <div className="news-article">
                            <Link to={postUrl + post.id}>
                                <img src={post.post_picture} className="news-pic" />
                                <div className="news-text">
                                    <h2 className="news-title post">{post.title}</h2>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
                <div className="about-me">
                    <div className="others-bio-pic">
                        <img src={profile.image} />
                    </div>
                    <div className="user">
                        {!this.state.following && <button className="follow" onClick={this.follow}>Follow</button>}
                        {this.state.following && <button className="follow" onClick={this.unFollow}>Stop Following</button>}
                        <h1>{profile.first_name} {profile.last_name}</h1>
                        <h2>About Me:</h2>
                        <p className="bio">{profile.about}</p>
                    </div>
                </div>
            </div>
        )
    }
}
