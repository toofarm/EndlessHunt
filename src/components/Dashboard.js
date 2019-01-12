import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import withAuthorization from './withAuthorization'
import JobsPageWrap from './JobsPage/JobsPageWrap'

const Dashboard = ({ authUser }) => 
    <div className="dash-meat-wrap">
        {authUser ? <DashboardWidgets authUser={authUser} />
            : null
        }
    </div>

export class DashboardWidgets extends React.Component {
    constructor(props) {
        super(props);

        this.state = { }
    }

    render() {
        return (
            <div>
               <JobsPageWrap />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser
  });

const mapDispatchToProps = (dispatch) => ({ });

const authCondition = (authUser) => !!authUser

export default compose(
    withAuthorization(authCondition),
    connect(mapStateToProps, mapDispatchToProps)
  )(Dashboard);