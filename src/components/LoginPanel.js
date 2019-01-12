import React, { Component } from 'react';

import SignIn from './SignIn'
import SignUpForm from './SignUpForm'

const INITIAL_STATE = {
    error: null,
    userAction: 'signIn'
}

export class LoginPanel extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE }
    }

    togglePanels (order) {
        if (order === 'in') {
            this.setState({
                userAction: 'signIn'
            })
        } else {
            this.setState({
                userAction: 'signUp'
            })
        }
    }

    render() {

        return (
            <div className="login-panel-wrap">
                <ul className="panel-nav">
                    <li
                        className={this.state.userAction === 'signIn' ? 
                            'active' : ''}
                        onClick={() => this.togglePanels('in')}>
                        sign in
                    </li>
                    <li
                        className={this.state.userAction === 'signUp' ? 
                        'active' : ''}
                        onClick={() => this.togglePanels('up')}>
                        sign up
                    </li>
                </ul>
                <div className="login-panel-inner">
                    {this.state.userAction === 'signIn' ?
                        <SignIn /> :
                        <SignUpForm />}
                </div>
            </div>
        )
    }
}

export default LoginPanel


