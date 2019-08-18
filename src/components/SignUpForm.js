import React, { Component } from 'react'
import { 
    withRouter,
} from 'react-router-dom'
import { byPropKey } from '../constants/utilities'

import { auth, users } from '../firebase'
import * as routes from '../constants/routes'


const SignUpPage = ({ history }) =>
  <div>
    <h2>Sign Up</h2>
    <SignUpForm history={history} />
  </div>

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null
}

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = {...INITIAL_STATE}
  }

  onSubmit = (event) => {
    const {
        username,
        email,
        passwordOne,
      } = this.state;

      const {
        history
      } = this.props

      let dataLayer = window.dataLayer || []
      dataLayer.push({
        'event': 'Login',
        'loginAction': 'SignUp'
      })
  
      auth.doCreateUserWithEmailAndPassword(email, passwordOne)
        .then(authUser => {
          users.doCreateUser(authUser.user.uid, username, email)
          .then(() => { 
            this.setState(() => ({ ...INITIAL_STATE }))
            history.push(routes.ACCOUNT)
          })
          .catch(error => {
            this.setState(byPropKey('error', error))
          })
        })
        .catch(error => {
          this.setState(byPropKey('error', error))
        });
  
      event.preventDefault();
  }

  render() {
    const {
        username,
        email,
        passwordOne,
        passwordTwo,
        error
    } = this.state

    const pwMatch =
      passwordOne === passwordTwo

    const pwWrongFormat =
      passwordOne.length < 8 ||
      passwordOne.search(/\d/) === -1

    const isInvalid =
      !pwMatch ||
      passwordOne === '' ||
      email === '' ||
      username === ''

    return (
      <div>
        { !isInvalid && pwWrongFormat && <div className="ui-info">
              Your password must be at least 8 characters long and contain at least one number
          </div>}
          { !pwMatch && <div className="ui-info">
                Your passwords do not match
            </div> }
          <form onSubmit={this.onSubmit} className="login-form">
            <input
              value={username}
              onChange={event => this.setState(byPropKey('username', event.target.value))}
              type="text"
              placeholder="Username"
            /><br/>
            <input
              value={email}
              onChange={event => this.setState(byPropKey('email', event.target.value))}
              type="text"
              placeholder="Email Address"
            /><br/>
            <input
              value={passwordOne}
              onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
              type="password"
              placeholder="Password"
            /><br/>
            <input
              value={passwordTwo}
              onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
              type="password"
              placeholder="Confirm Password"
            /><br/>
            <button disabled={isInvalid || pwWrongFormat} type="submit">
              Sign Up
            </button>
            { error && <p className="ui-info">{error.message}</p> }
          </form> 
        </div>
    );
  }
}

export default withRouter(SignUpPage);

export {
  SignUpForm
}