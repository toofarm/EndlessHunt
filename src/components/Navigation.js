import React from 'react'
import { connect } from 'react-redux'
import { Link,
        withRouter } from 'react-router-dom'

import SignOutButton from './SignOut'
import NavigationAuthMobile from './NavigationAuthMobile'
import * as routes from '../constants/routes'

const maxMobileWidth = 1024

const Navigation = ({ authUser, location }) => 
    <header> 
        {authUser ?
            <nav>
                <h1 id="app-title" className="desktop"><Link to={routes.LANDING}><span className="header-spice">The</span> Endless Hunt</Link></h1>
                {window.innerWidth >= maxMobileWidth ? 
                <NavigationAuth location={location} /> :
                <NavigationAuthMobile />}
            </nav>
            :
            <nav>
                <h1 id="app-title"><Link to={routes.LANDING}><span className="header-spice">The</span> Endless Hunt</Link></h1>
            </nav>
        }
    </header>

const NavigationAuth = ({ location }) => 
        <ul className="main-nav desktop">
            <li className={location.pathname === "/jobs" ? "current-page" : 
                location.pathname === "/" ? "current-page" : "" }><Link to={routes.ACCOUNT}>Jobs</Link></li>
            <li className={location.pathname === "/stats" ? "current-page" : ""}><Link to={routes.STATS}>Stats</Link></li>
            <li className={location.pathname === "/profile" ? "current-page" : ""}><Link to={routes.PROFILE}>Profile</Link></li>
            <li><SignOutButton /></li>
        </ul>

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
  });
  
  export default withRouter(connect(mapStateToProps)(Navigation));
