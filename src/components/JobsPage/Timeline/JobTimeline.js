import React, { Component } from 'react';
import TimelineEvent from './TimelineEvent'
// import TimelineEvent from './TimelineEventHooks'
import { getInteractions } from '../../../actions'

import spinner from '../../../static/img/spin-loader.png'

import { connect } from 'react-redux'

class JobTimeline extends Component {
    constructor(props) {
        super(props)

        this.state = {
            interactions: {}
        }
    }

    componentDidMount() {
        let jobId = this.props.jobId
        let allInteractions = this.props.interactions
        let ourInteractions = {}
        for (const key in allInteractions) {
            if (key === jobId) {
                ourInteractions = allInteractions[key]
            }
        }
        this.setState({
            interactions: ourInteractions
        }, () => console.log(this.state.interactions))
    }

    componentDidUpdate (prevProps) {

        if (prevProps !== this.props) {
            let jobId = this.props.jobId
            let allInteractions = this.props.interactions
            let ourInteractions = {}
            for (const key in allInteractions) {
                if (key === jobId) {
                    ourInteractions = allInteractions[key]
                }
            }
            this.setState({
                interactions: ourInteractions
            }, () => console.log(this.state.interactions))
        }
    }

    render() {
        return (
            <div className="timeline-wrap col-md-12">
                <div className="job-item-label">Timeline</div>
                {this.state.interactions ?
                    <div>
                        {Object.keys(this.state.interactions).map(key =>
                            <TimelineEvent key={key}
                                type={this.state.interactions[key].type}
                                date={this.state.interactions[key].date}
                                notes={this.state.interactions[key].notes}
                                reference={key}
                                jobId={this.props.jobId}
                                userId={this.props.id} />
                        )}
                    </div> :
                    <div className="loader">
                        <img src={spinner} alt="Loading..." className="spin-loader" />
                    </div>}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    interactions: state.interactionsState.interactions
});

const mapDispatchToProps = (dispatch) => ({
    getTimelineEvents: (id) => dispatch(getInteractions(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(JobTimeline);