import React, { Component } from 'react';
import { connect } from 'react-redux'
import { getUser } from '../actions'
import { compose } from 'recompose'

import withAuthorization from './withAuthorization'

import PasswordChange from './PasswordChange'
import PasswordForget from './PasswordForget'
import UsernameChange from './UsernameChange'

import spinner from '../static/img/spin-loader.png'

const INITIAL_STATE = {
    error: null,
    authUser: false,
    showPw: false,
    showForgotPw: false,
    showUsernameChange: false
}


export class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE }

        this.showPwChange = this.showPwChange.bind(this)
        this.showPwForgot = this.showPwForgot.bind(this)
        this.showUserChange = this.showUserChange.bind(this)
    }

    showPwChange() {
        if (this.state.showPw === false) {
            this.setState({
                showPw: true,
                showForgotPw: false,
                showUsernameChange: false
            })
        } else {
            this.setState({
                showPw: false
            })
        }
    }

    showPwForgot() {
        if (this.state.showForgotPw === false) {
            this.setState({
                showPw: false,
                showForgotPw: true,
                showUsernameChange: false
            })
        } else {
            this.setState({
                showForgotPw: false
            })
        }
    }

    showUserChange() {
        if (this.state.showUsernameChange === false) {
            this.setState({
                showPw: false,
                showForgotPw: false,
                showUsernameChange: true
            })
        } else {
            this.setState({
                showUsernameChange: false
            })
        }
    }

    componentDidMount (props, prevProps) {
        const { getOurUser } = this.props
        document.title = "Profile | The Endless Hunt"

        if (this.props.user) {
           // No op 
        } else if (this.props.authUser &&
            this.state.authUser === false) {
            getOurUser(this.props.authUser.uid)
            this.setState({
                authUser: true
            })
        }
    }

    render() {
        return (
            <div className="row">
                {this.props.user ?
                    <div className="profile-wrap col-md-10 offset-md-1">
                        <h2 className="profile-header">Hello, {this.props.user.username}</h2>
                        <div className="dashboard-wrap">
                            <div className="dash-input-holder">
                                <h3 onClick={this.showPwChange}
                                    className={this.state.showPw ? "selected-input" : ""}>Change password</h3>
                                {this.state.showPw && <PasswordChange />}
                            </div>
                            <div className="dash-input-holder">
                                <h3 onClick={this.showPwForgot}
                                    className={this.state.showForgotPw ? "selected-input" : ""}>Forgot password</h3>
                                {this.state.showForgotPw && <PasswordForget />}
                            </div>
                            <div className="dash-input-holder">
                                <h3 onClick={this.showUserChange}
                                    className={this.state.showUsernameChange ? "selected-input" : ""}>Update Username</h3>
                                {this.state.showUsernameChange && <UsernameChange userId={this.props.user.id}
                                    sendNameChange={this.handleUserNameChange} />}
                            </div>
                        </div>
                    </div>
                    :
                    <div className="loader">
                        <img src={spinner} alt="Loading..." className="spin-loader" />
                    </div>}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.userState.user,
    authUser: state.sessionState.authUser
});

const mapDispatchToProps = (dispatch) => ({
    getOurUser: (id) => dispatch(getUser(id))
});

// export default connect(mapStateToProps, mapDispatchToProps)(Profile)

const authCondition = (authUser) => !!authUser

export default compose(
    withAuthorization(authCondition),
    connect(mapStateToProps, mapDispatchToProps)
  )(Profile);


