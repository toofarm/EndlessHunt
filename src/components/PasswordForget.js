import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { byPropKey } from '../constants/utilities'

import { auth } from '../firebase'

const PasswordForgetPage = () =>
  <div>
    <PasswordForgetForm />
  </div>
  
const INITIAL_STATE = {
  email: '',
  error: null,
  emailSent: false
}

class PasswordForgetForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }))
        this.setState(byPropKey('emailSent', true))
      })
      .catch(error => {
        this.setState(byPropKey('error', error))
      });

    event.preventDefault()
  }

  render() {
    const {
      email,
      error,
      emailSent
    } = this.state;

    const isInvalid = email === ''

    return (
      <form onSubmit={this.onSubmit} className="login-form">
        { emailSent &&
        <div className="ui-info">
            Check your email for a link to reset your password
        </div>}
        <label htmlFor="reset-email">Enter the email address you used to create your account</label>
        <input
          value={this.state.email}
          onChange={event => this.setState(byPropKey('email', event.target.value))}
          type="text"
          placeholder="Email Address"
          id="reset-email"
          name="reset-email"
        /><br/>
        <button disabled={isInvalid} type="submit">
          Reset My Password
        </button>
        { error && <p className="error">{error.message}</p> }
      </form>
    )
  }
}

const PasswordForgetLink = () =>
  <p className="pw-forget-link">
    <Link to="/pw-forget">Forgot Password?</Link>
  </p>

export default PasswordForgetPage

export {
  PasswordForgetForm,
  PasswordForgetLink,
}