import React, { Component } from 'react'
import { Link,
        withRouter } from 'react-router-dom'

import SignOutButton from './SignOut'
import * as routes from '../constants/routes'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

class NavigationAuthMobile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showFullNav: false
        }

        this.menuToggle = this.menuToggle.bind(this)
    }

    menuToggle () {
        if (this.state.showFullNav) {
            this.setState({
                showFullNav: false
            })
        } else {
            this.setState({
                showFullNav: true
            })
        }
    }

    render () {
        const { location } = this.props

        return (
            <div className="nav-mobile-wrap">
                <div className="mobile-nav-header">
                    <h1 id="app-title-mobile"><Link to={routes.LANDING}><span className="header-spice">The</span>Endless Hunt</Link></h1>
                    {this.state.showFullNav ? <FontAwesomeIcon icon={faTimes} 
                        className="mobile-nav-icon"
                        onClick={this.menuToggle} /> : 
                        <FontAwesomeIcon icon={faBars}
                        className="mobile-nav-icon" 
                        onClick={this.menuToggle} /> }
                </div>
                    {this.state.showFullNav && <ul className="main-nav mobile col-md-12">
                        <li className="mobile-nav-close"> 
                            <FontAwesomeIcon icon={faTimes} 
                            className="mobile-nav-icon"
                            onClick={this.menuToggle} />
                        </li>
                        <li className={this.props.location.pathname === "/jobs" ? "current-page" : 
                            location.pathname === "/" ? "current-page" : "" }
                            onClick={this.menuToggle}>
                            <Link to={routes.ACCOUNT}>
                                Jobs
                            </Link>
                        </li>
                        <li className={this.props.location.pathname === "/stats" ? "current-page" : 
                            location.pathname === "/" ? "current-page" : "" }
                            onClick={this.menuToggle}>
                            <Link to={routes.STATS}>
                                Stats
                            </Link>
                        </li>
                        <li className={location.pathname === "/profile" ? "current-page" : ""} onClick={this.menuToggle}>
                            <Link to={routes.PROFILE}>
                                Profile
                            </Link>
                        </li>
                        <li
                        onClick={this.menuToggle}>
                            <SignOutButton />
                        </li>
                    </ul>}
            </div>
        )
    }

}

export default withRouter(NavigationAuthMobile)