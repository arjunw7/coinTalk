import React from 'react';
import axios from './axios.js';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getUserProfile } from './actions';
import { Loading } from './loading';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: "initial"
        };
        this.showMenu = this.showMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
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
    componentDidMount() {
        this.props.getUserProfile();
    }
    render() {
        var visibility = "initial";
        if (this.state.showMenu === "show") {
            visibility = "show";
        } else if (this.state.showMenu === "hide") {
            visibility = "hide";
        }
        if (!this.props.loggedUser) {
            return (
                <Loading />
            )
        }
        const loggedUser = this.props.loggedUser;
        console.log('Logged as: ', loggedUser);
        return (
            <div className="header-container">
                <div className="header">
                    <div className="hamburger" onClick={this.showMenu}><hr /><hr /><hr /></div>
                    <div className="logo"><Link to="/"><h1>coinTalk</h1></Link></div>
                    <div className="profile-pic"><Link to="/profile/"><img src={loggedUser.image} /></Link></div>
                </div>
                <div id="menu" className={visibility} onClick={this.hideMenu}>
                    <div className="background">
                    </div>
                    <div className="nav-link"><Link to="/"><div><i className="fa fa-home" aria-hidden="true"></i> Home</div></Link></div>
                    <div className="nav-link"><Link to="/news/"><div><i className="fa fa-newspaper-o" aria-hidden="true"></i> News</div></Link></div>
                    <div className="nav-link"><Link to="/profile/"><div><i className="fa fa-user" aria-hidden="true"></i> Profile</div></Link></div>
                    <div className="nav-link"><Link to="/bookmarks/"><div><i className="fa fa-bookmark-o" aria-hidden="true"></i> Bookmarks</div></Link></div>
                    <div className="nav-link"><Link to="/follows/"><div><i className="fa fa-star-o" aria-hidden="true"></i> Following</div></Link></div>
                    <div className="nav-link"><a href="/logout"><div><i className="fa fa-sign-out" aria-hidden="true"></i> Logout</div></a></div>
                </div>
            </div>
            )
        }
    }

//REDUX INTEGRATION ------------------------------------------------------------
//------------------------------------------------------------------------------

const mapStateToProps = function(state) {
    return {
        loggedUser: state.loggedUser
    }
}

const mapDispatchToProps = function(dispatch) {
    return {
        getUserProfile() {
            dispatch(getUserProfile());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
