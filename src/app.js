import React from 'react';
import axios from './axios.js';
import { Footer } from './footer';
import { connect } from 'react-redux';
import Header from './header';

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.setAbout = this.setAbout.bind(this);
        this.setBlogTitle = this.setBlogTitle.bind(this);
        this.setImage = this.setImage.bind(this);
    }
    setAbout(about) {
        this.setState({
            about: about
        })
    }
    setImage(image) {
        this.setState({
            image: image
        })
    }
    setBlogTitle(blog_title) {
        this.setState({
            blog_title: blog_title
        })
    }
    componentDidMount() {
        axios.get('/profile')
        .then(({ data }) => {
            this.setState(data.results);
        })
        .catch((err) => {
            console.log(err);
        })
    }
    render() {
        if(!this.state) {
            return (
                <Loading />
            );
        }
        const { id, first_name, last_name, image, about , blog_title } = this.state;
        const children = React.cloneElement(this.props.children, {
            id,
            first_name,
            last_name,
            image,
            about,
            blog_title,
            setAbout: this.setAbout,
            setImage: this.setImage,
            setBlogTitle: this.setBlogTitle
        });
        return (
            <div>
                <Header />
                { children }
                <Footer />
            </div>
        )
    }
}
