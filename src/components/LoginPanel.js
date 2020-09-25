import React, { useState } from 'react';

import SignIn from './SignIn'
import SignUpForm from './SignUpForm'

export default function LoginPanel() {
    const [userAction, setUserAction] = useState("signIn")

    return (
        <div className="login-panel-wrap">
            <ul className="panel-nav">
                <li
                    className={userAction === 'signIn' ? 
                        'active' : ''}
                    onClick={() => setUserAction('signIn')}>
                    sign in
                </li>
                <li
                    className={userAction === 'signUp' ? 
                    'active' : ''}
                    onClick={() => setUserAction('signUp')}>
                    sign up
                </li>
            </ul>
            <div className="login-panel-inner">
                {userAction === 'signIn' ?
                    <SignIn /> :
                    <SignUpForm />}
            </div>
        </div>
    )

}
