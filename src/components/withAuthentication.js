import React from 'react'
import { connect } from 'react-redux'

import { firebase } from '../firebase'

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = {
          authUser: null
        }
      }
    
      componentDidMount() {
        const { onSetAuthUser } = this.props

        firebase.auth.onAuthStateChanged(authUser => {
          let dataLayer = window.dataLayer || []
          if (authUser) {
            dataLayer.push({
              'userId': authUser.l
            })
            onSetAuthUser(authUser)
          } else {
            onSetAuthUser(null)
          }
        })
      }

    render() {
      return (
          <Component />
      );
    }
  }

  const mapDispatchToProps = (dispatch) => ({
    onSetAuthUser: (authUser) => dispatch({ type: 'AUTH_USER_SET', authUser }),
  });

  return connect(null, mapDispatchToProps)(WithAuthentication);
}

export default withAuthentication
