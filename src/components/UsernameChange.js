import React, { Component } from 'react';
import { connect } from 'react-redux';
import { resetUsername } from '../actions'
import { byPropKey } from '../constants/utilities'

const INITIAL_STATE = {
  error: null,
  resetSuccess: false,
  username: ''
}

class UsernameChange extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (e) => {
    const { sendNewUsername } = this.props
    e.preventDefault()

    let id = this.props.authUser.uid
    let username = this.state.username

    sendNewUsername(id, username)

    this.setState({
      resetSuccess: true
    })
  
  }

  render() {
    const {
      username
    } = this.state;

    const isInvalid =
      username === ''

    return (
      <form onSubmit={this.onSubmit} className="login-form">
        {this.state.resetSuccess && <div className="ui-info">Username updated!</div>}
        {this.state.error && <div className="error">Something went wrong in updating your username.</div>}
        <input
          onChange={event => this.setState(byPropKey('username', event.target.value))}
          type="text"
          placeholder="New username"
        />
        <button disabled={isInvalid} type="submit">
          Change username
        </button>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser
});

const mapDispatchToProps = (dispatch) => ({
  sendNewUsername: (email, id, username) => dispatch(resetUsername(email, id, username))
});

export default connect(mapStateToProps, mapDispatchToProps)(UsernameChange);