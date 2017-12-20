import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, browserHistory, Redirect } from 'react-router';

//REDUX-------------------------------------------------------------------------
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import { Provider } from 'react-redux';
import { reducer } from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
export var store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

//Components--------------------------------------------------------------------
//------------------------------------------------------------------------------
import { App } from './app';
import { Guest } from './guest';
import { Home } from './home';
import { News } from './news';
import { Register } from './register';
import { Profile } from './profile';
import { Compose } from './compose';
import { OtherUser } from './otherUsers';
import { Post } from './post';
import { Bookmarks } from './bookmarks';
import { Following } from './following';

let router;

const loggedInRouter =  (
    <Provider store={store} >
        <Router history={hashHistory}>
            <Route path='/' component={App}>
                <Route path='/follows/' component={Following} />
                <Route path='/bookmarks/' component={Bookmarks} />
                <Route path='/post/:id' component={Post} />
                <Route path='/user/:id' component={OtherUser} />
                <Route path='/news/' component={News} />
                <Route path='/profile/' component={Profile} />
                <Route path='/compose/' component={Compose} />
                <IndexRoute component={Home} />
                <Redirect from='*' to='/' />
            </Route>
        </Router>
    </Provider>
);

const notLoggedInRouter = (
    <Router history={hashHistory}>
        <Route path='/' component={Guest}>
            <Route path='/register/' component={Register} />
            <Route path='/news/' component={News} />
            <IndexRoute component={Home} />
        </Route>
    </Router>
);

if (location.pathname == '/welcome/') {
    router = notLoggedInRouter;
} else {
    router = loggedInRouter;
}

ReactDOM.render(
    router,
    document.querySelector('main')
);
