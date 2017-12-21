import React from 'react';
import axios from './axios.js';
import { Link } from 'react-router';
import { Loading } from './loading';
import { Coins } from './coinQtes';
import { Header } from './header';

export class News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios.get('https://newsapi.org/v2/top-headlines?sources=crypto-coins-news&apiKey=7f77fcf3170f4af595c26d4f27c2ad71')
        .then((resp) => {
            this.setState({
                articles: resp.data.articles
            })
            console.log(resp.data);
        })
    }
    render() {
        const articles = this.state.articles;
        if (!this.state.articles) {
            return (
                <div>
                    <Loading />
                </div>
            )
        }
        return (
            <div>
                {this.props.image && <Header image={this.props.image} />}
                <div className="container">
                    <Coins />
                    <h1 className="blog-title">Latest News</h1>
                    { articles.map(article =>
                        <div className="news-article">
                            <a href={article.url} target="_blank">
                                <img src={article.urlToImage} className="news-pic" />
                                <div className="news-text">
                                    <h2 className="news-title">{article.title}</h2>
                                    <p className="description">{article.description}</p>
                                    <p>Source: {article.source.name}</p>
                                </div>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
