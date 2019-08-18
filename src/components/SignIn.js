import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import PasswordForgetForm from './PasswordForget';
import { auth } from '../firebase';
import * as routes from '../constants/routes';
import { byPropKey } from '../constants/utilities'

const SignInPage = ({ history }) =>
  <div>
    <h2>Sign In</h2>
    <SignInForm history={history} />
  </div>

const INITIAL_STATE = {
  email: '',
  password: '',
  showPwForget: false,
  error: null
}

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.showPwForm = this.showPwForm.bind(this)
  }

  showPwForm (e) {
    e.preventDefault()
    if (this.state.showPwForget === false) {
      this.setState({
        showPwForget: true
      })
    } else {
      this.setState({
        showPwForget: false
      })
    }
  }

  submitCredentials = (e) => {
    e.preventDefault();

    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then((e) => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.ACCOUNT);
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
      <div>
        {!this.state.showPwForget ? 
        <form onSubmit={this.submitCredentials} className="login-form">
          { error && <p className="ui-info">{error.message}</p> }
          <label htmlFor="email">Email address</label>
          <input
            value={email}
            onChange={event => this.setState(byPropKey('email', event.target.value))}
            type="text"
            id="email"
            name="email"
          /><br/>
          <label htmlFor="password">Password</label>
          <input
            value={password}
            onChange={event => this.setState(byPropKey('password', event.target.value))}
            type="password"
            id="password"
            name="password"
          /><br/>
          <button disabled={isInvalid} type="submit">
            Sign In
          </button>
          <p className="pw-forget-link">
            <a
            onClick={(e) => this.showPwForm(e)}>Forgot your password?</a>
          </p>
        </form> :
        <div>
          <PasswordForgetForm />
          <p className="pw-forget-link">
            <a
            onClick={(e) => this.showPwForm(e)}>Back to Sign In</a>
          </p>
        </div> }
      </div>
    );
  }
}

export default withRouter(SignInPage);

export {
  SignInForm,
};