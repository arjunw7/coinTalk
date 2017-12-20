import React from 'react';
import axios from './axios';
import { Link } from 'react-router';
import { Loading } from './loading';

export class Following extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios.get('/following/')
        .then(({ data }) => {
            this.setState({
                authors: data.results
            })
        })
    }
    render() {
        if (!this.state.authors) {
            return (
                <Loading />
            )
        }
        const authors = this.state.authors;
        const userUrl = '/user/';
        return (
            <div className="container">
                <h1 className="blog-title">Following</h1>
                { authors.map(author =>
                    <div className="news-article following">
                        <Link to={userUrl + author.id}>
                            <img src={author.image} className="news-pic" />
                            <div className="news-text">
                                <h2 className="news-title post">@ {author.blog_title}</h2>
                                <h3>By: {author.first_name} {author.last_name}</h3>
                                <p className="description">{author.about}</p>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        )
    }
}
