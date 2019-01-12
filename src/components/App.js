import React, { Component } from 'react';
import { BrowserRouter as Router,
         Route,
         } from 'react-router-dom'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'

import '../styles/App.css'

import Navigation from './Navigation'
import Dashboard from './Dashboard'
import Profile from './Profile'
import Landing from './Landing'
import StatsPageWrap from './StatsPageWrap'
import withAuthentication from './withAuthentication'

import * as routes from '../constants/routes'

const App = ({ authUser }) => 
  <Router>
  <div className="meta-wrap" id="app">
    <Navigation />
    <div className="main-wrap">
      <Route
        exact path={routes.LANDING}
        component={(authUser) =>  authUser ? <Dashboard /> :
        <Landing />}
      />
      <Route
        exact path={routes.HOME}
        component={() => <Landing />}
      />
      <Route
        exact path={routes.ACCOUNT}
        component={() => <Dashboard />}
      />
      <Route
        exact path={routes.PROFILE}
        component={({location}) => <Profile />}
      />
      <Route
        exact path={routes.STATS}
        component={() => <StatsPageWrap />}
      />
    </div>
  </div>
  </Router>

export default withAuthentication(App);
