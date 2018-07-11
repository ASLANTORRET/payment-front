import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route, Switch} from 'react-router-dom';
import Login from './views/Pages/Login/'
import Page404 from './views/Pages/Page404/'
import Page500 from './views/Pages/Page500/'

// Containers
import Full from './containers/Full/'

const Router = () => 
    (<HashRouter>
        <Switch>
            <Route exact path="/login" name="Login Page" component={Login}/>
            <Route exact path="/404" name="Page 404" component={Page404}/>
            <Route exact path="/500" name="Page 500" component={Page500}/>
            <Route path="/" component={Full}/>
        </Switch>
    </HashRouter>
    )

export default Router