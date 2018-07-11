import React, { Component } from 'react';
import {Provider} from 'react-redux'
import Auth from './auth'
import store from './store'
import ReactDOM from 'react-dom'
// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss'
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss'
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render( 
  <Provider store={store}>
    <Auth/>
  </Provider>
 , document.getElementById('root'));
 registerServiceWorker()
