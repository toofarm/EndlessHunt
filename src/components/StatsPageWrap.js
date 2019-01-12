import React, { Component } from 'react';
import { connect } from 'react-redux'
import { getJobs, getInteractions } from '../actions'
import { compose } from 'recompose'

import withAuthorization from './withAuthorization'

import JobsCount from './Visualizations/JobsCount'
import ConfidencePie from './Visualizations/JobsConfidencePie'
import SalaryBar from './Visualizations/JobsSalaryBar'
import ConfidenceScatterPlot from './Visualizations/JobsConfidenceScatterPlot'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'

import spinner from '../static/img/spin-loader.png'

const maxMobileWidth = 767

const INITIAL_STATE = {
    error: null,
    userId: '',
    loading: true,
    flag: true
}

export class StatsPageWrap extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE }
    }

    componentDidMount () {
        const { getUserJobs, getTimelineEvents } = this.props
        document.title = "Stats | The Endless Hunt"

        if (this.props.authUser) {
            let id = this.props.authUser.uid
            this.setState({
                userId: id
            })
            getUserJobs(id)
            getTimelineEvents(id)
            this.setState({
                loading: false
            })
        }
    }
    
    componentDidUpdate (prevProps) {
        const { getUserJobs, getTimelineEvents } = this.props
        if (this.props.authUser && 
            this.state.flag) {
            let id = this.props.authUser.uid
            this.setState({
                userId: id,
                flag: false
            })
            getUserJobs(id)
            getTimelineEvents(id)
        }
        if (this.props.jobs !== prevProps.jobs) {
            this.setState({
                loading: false
            })
        }
    }
    
    render() {
        return ( 
            <div className="stats-wrap">
                {this.state.loading ?
                <div className="loader">
                    <div className="welcome-msg">
                        Sharpening protractors, drawing up charts...
                    </div>
                    <img src={spinner} alt="Loading..." className="spin-loader" />
                </div> :
                <div>
                    {!!this.props.interactions &&
                     !!this.props.jobs ? 
                        <div className="row">
                            <JobsCount 
                                jobs={this.props.jobs} />
                            {window.innerWidth >= maxMobileWidth && <ConfidencePie 
                                jobs={this.props.jobs} />}
                            <SalaryBar 
                                jobs={this.props.jobs} />
                            <ConfidenceScatterPlot
                                jobs={this.props.jobs}
                                interactions={this.props.interactions} />
                        </div> :
                    <div className="welcome-msg">
                        Check back once you've added some applications
                        <FontAwesomeIcon icon={faThumbsUp} 
                        className="welcome-icon" /> 
                    </div>}
                </div>}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
    jobs: state.jobsState.jobs,
    interactions: state.interactionsState.interactions
});

const mapDispatchToProps = (dispatch) => ({
    getUserJobs: (id) => dispatch(getJobs(id)),
    getTimelineEvents: (id) => dispatch(getInteractions(id))
})

const authCondition = (authUser) => !!authUser

export default compose(
    withAuthorization(authCondition),
    connect(mapStateToProps, mapDispatchToProps)
  )(StatsPageWrap);


