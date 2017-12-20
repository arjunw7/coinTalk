import React from 'react';
import axios from './axios.js';
import { Link } from 'react-router';
import { Loading } from './loading';
import { PicUpload } from './picUpload';

export class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.createBlog = this.createBlog.bind(this);
        this.showAboutMe = this.showAboutMe.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.editAbout = this.editAbout.bind(this);
        this.newBlog = this.newBlog.bind(this);
        this.toggleUpload = this.toggleUpload.bind(this);
    }
    createBlog() {
        this.setState({
            createBlog: !this.state.createBlog
        })
    }
    showAboutMe() {
        this.setState({
            aboutMe: !this.state.aboutMe
        })
    }
    handleChange(name, value) {
    this.setState({
            [name]: value
        })
    }
    toggleUpload() {
        this.setState({
            showUpload: !this.state.showUpload
        })
    }
    editAbout() {
        const about = this.state;
        const data = about;
            axios.post('/about', data)
            .then((resp) => {
                if (resp.data.success) {
                    this.props.setAbout(resp.data.about);
                    this.setState({
                        aboutMe: !this.state.aboutMe
                    })
                    console.log('This is resp.data: ', resp.data);
                }
            })
            .catch((err) => {
                console.log('Error inside handleSubmit Bio: ', err);
            })
    }
    newBlog() {
        const blog_title = this.state;
        const title = blog_title;
        axios.post('/create-blog', title)
        .then((resp) => {
            if (resp.data.success) {
                this.props.setBlogTitle(resp.data.blog_title);
                this.setState({
                    createBlog: !this.state.createBlog
                })
            }
            console.log('Data: ', resp.data);
        })
    }
    componentDidMount() {
        axios.get('/user-posts')
        .then((resp) => {
            this.setState({
                myPosts: resp.data.myPosts
            })
            console.log('Posts: ', resp.data.myPosts);
        })
    }
    render() {
        if (!this.state.myPosts) {
            return (
                <Loading />
            )
        }
        const myPosts = this.state.myPosts;
        const url = '/post/';
        return (
            <div>
            {this.props.blog_title &&
            <div className="add">
                <Link to="/compose/"><span>+</span> New Post</Link>
            </div>}
                <div className="container text">
                    {!this.props.blog_title &&
                        <h2><span onClick={this.createBlog} className="blog-title btn">Create a blog</span></h2>}
                    {this.props.blog_title &&
                    <h2 className="blog-title">{this.props.blog_title}</h2>}
                    { myPosts.map(post =>
                        <div className="news-article">
                            <Link to={url + post.id}>
                                <img src={post.post_picture} className="news-pic" />
                                <div className="news-text">
                                    <h2 className="news-title post">{post.title}</h2>
                                </div>
                            </Link>
                        </div>
                    )}
                    {this.state.createBlog &&
                    <div className="user-profile">
                        <input onChange={(e) => this.handleChange(e.target.name, e.target.value)} type="text" name="blog_title" placeholder="Blog Name" />
                        <button onClick={this.newBlog}>Start Blogging!</button>
                    </div>}
                </div>
                <div className="about-me">
                    <div className="bio-pic">
                        <img src={this.props.image} onClick={this.toggleUpload} />
                        {this.state.showUpload &&
                            <PicUpload setImage={this.props.setImage} />
                        }
                    </div>
                    <div className="user">
                        <h1>{this.props.first_name} {this.props.last_name}</h1>
                        <p className="bio">{this.props.about}</p>
                        <p onClick={this.showAboutMe} className="edit">Edit Bio</p>
                        {this.state.aboutMe &&
                        <div className="bio-update">
                            <textarea name="about" rows="5" cols="80" onChange={(e) => this.handleChange(e.target.name, e.target.value) }></textarea>
                            <button onClick={this.editAbout}>Submit</button>
                        </div>}
                    </div>
                </div>
            </div>
        )
    }
}
