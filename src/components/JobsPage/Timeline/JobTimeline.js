import React, { Component } from 'react';
import TimelineEvent from './TimelineEvent'
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
        const { getTimelineEvents } = this.props
        let id = this.props.id
        getTimelineEvents(id)
    }

    componentWillReceiveProps (props) {
        let jobId = this.props.jobId
        
        if (props.interactions) {
            let allInteractions = props.interactions
            for (const key in allInteractions) {
                if (key === jobId) {
                    let orderedInteractions = []
                    for (const interaction in allInteractions[key]) {
                        orderedInteractions.push(allInteractions[key][interaction])
                    }
                    orderedInteractions.sort((a, b) => {
                        return new Date(a.date) - new Date(b.date)
                    })
                    this.setState({
                        interactions: orderedInteractions
                    })
                }
            }
        }
    }

    render() {
        return (
            <div className="timeline-wrap col-md-12">
                <div className="job-item-label">Timeline</div>
                {!!this.state.interactions ?
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