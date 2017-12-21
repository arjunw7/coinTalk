import React from 'react';
import axios from './axios.js';
import { Link } from 'react-router';

export class GuestHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: "initial"
        };
        this.toggleLogin = this.toggleLogin.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    toggleLogin() {
        this.setState({
            showLogin: !this.state.showLogin
        })
    }
    showMenu() {
        this.setState({
            showMenu: "show"
        })
    }
    hideMenu() {
        this.setState({
            showMenu: "hide"
        })
    }
    handleChange(name, value) {
        this.setState({
            [name]: value
        })
    }
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            const { email, password } = this.state;
            const data = {email, password};
            axios.post('/login', data)
            .then((resp) => {
                if (resp.data.success) {
                    location.replace('/');
                    console.log('Login successfull: ', resp.data);
                }
            })
        }
    }
    render() {
        var visibility = "initial";
        if (this.state.showMenu === "show") {
            visibility = "show";
        } else if (this.state.showMenu === "hide") {
            visibility = "hide";
        }
        return (
            <div className="header-container">
                <div className="header">
                    <div className="hamburger" onClick={this.showMenu}><hr /><hr /><hr /></div>
                    <div className="logo"><Link to="/"><h1>coinTalk</h1></Link></div>
                    {!this.state.showLogin &&
                    <ul>
                        <li><Link to="/register/">Register</Link></li>
                        <li>/</li>
                        <li onClick={this.toggleLogin}>Login</li>
                    </ul>}
                    {this.state.showLogin &&
                        <ul className="login-form">
                            <li><input onKeyPress={this.handleKeyPress} onChange={(e) => this.handleChange(e.target.name, e.target.value) } name="email" type="email" placeholder="Email" /></li>
                            <li><input onKeyPress={this.handleKeyPress} onChange={(e) => this.handleChange(e.target.name, e.target.value) } name="password" type="password" placeholder="Password" /></li>
                            <li onClick={this.toggleLogin} className="close-btn">X</li>
                        </ul>}
                </div>
                <div id="menu" className={visibility} onClick={this.hideMenu}>
                    <div className="background">
                    </div>
                    <div className="nav-link"><Link to="/"><div><i className="fa fa-home" aria-hidden="true"></i> Home</div></Link></div>
                    <div className="nav-link"><Link to="/news/"><div><i className="fa fa-newspaper-o" aria-hidden="true"></i> News</div></Link></div>
                </div>
            </div>
            )
        }
    }
