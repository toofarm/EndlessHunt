import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faPencilAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { deleteInteraction, toggleModal } from '../../../actions'

import { connect } from 'react-redux'

import { SlideDown } from 'react-slidedown'
import "../../../../node_modules/react-slidedown/lib/slidedown.css"

class TimelineEvent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showNotes: false
        }

        this.notesReveal = this.notesReveal.bind(this)
        this.deleteEvent = this.deleteEvent.bind(this)
        this.edit = this.edit.bind(this)
    }
    
    notesReveal () {
        if (this.state.showNotes === false) {
            this.setState({
                showNotes: true
            })
        } else {
            this.setState({
                showNotes: false
            })
        }
    }

    deleteEvent () {
        const { deleteThisInteraction } = this.props

        let id = this.props.userId
        let application = this.props.jobId
        let ref = this.props.reference

        let c = window.confirm('Delete this interaction?')

        if (c === true) deleteThisInteraction(id, application, ref)
    }

    edit () {
        const { toggleModal } = this.props
        let ourInteraction = {}
        ourInteraction['type'] = this.props.type
        ourInteraction['date'] = this.props.date
        ourInteraction['notes'] = this.props.notes
        ourInteraction['userId'] = this.props.userId
        ourInteraction['jobId'] = this.props.jobId
        ourInteraction['ref'] = this.props.reference
        toggleModal(true, ourInteraction)
    }

    render() { 
        return (
            <div className="job-timeline-entry">
                <span className="timeline-dot">
                    <FontAwesomeIcon icon={faCircle} />
                </span>
                <ul className="timeline-basics"
                    onClick={this.notesReveal}>
                    <li>{this.props.type}</li>
                    <li className="timeline-divider"> — </li>
                    <li className="timeline-date">{this.props.date}</li>
                    {this.props.type !== "Submitted application" && <li className="timeline-cntrls">
                        <span className="timeline-cntrl"
                            onClick={this.edit}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                        <span className="timeline-cntrl"
                            onClick={this.deleteEvent}>
                            <FontAwesomeIcon icon={faTimesCircle} />
                        </span>
                    </li>}
                </ul>
                <SlideDown className="job-app-slidedown">
                    {this.state.showNotes && <div>
                            <div className="timeline-notes">{this.props.notes}</div>
                            {this.props.type !== "Submitted application" && <li className="timeline-cntrls cntrls-mobile">
                            <span className="timeline-cntrl"
                                onClick={this.edit}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                            <span className="timeline-cntrl"
                                onClick={this.deleteEvent}>
                                <FontAwesomeIcon icon={faTimesCircle} />
                            </span>
                        </li>}
                    </div>}
                </SlideDown>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    deleteThisInteraction: (id, application, ref) => dispatch(deleteInteraction(id, application, ref)),
    toggleModal: (order, interaction) => dispatch(toggleModal(false, order, null, interaction))
});

export default connect(null, mapDispatchToProps)(TimelineEvent);