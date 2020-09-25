import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux'
import { deleteInteraction, toggleModal } from '../../../actions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faPencilAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { SlideDown } from 'react-slidedown'
import "../../../../node_modules/react-slidedown/lib/slidedown.css"

export default function TimelineEvent(props) {
    let id, application, ref, order, interaction
    const [showNotes, setShowNotes] = useState(false)
    const dispatch = useDispatch()
    const deleteThisInteraction = useCallback(
        (id, application, ref) => {dispatch(deleteInteraction(id, application, ref))},
        [dispatch, id, application, ref]
      )
    const toggleModal = useCallback(
        (order, interaction) => {dispatch(toggleModal(false, order, null, interaction))},
        [dispatch, order, interaction]
      )

    const deleteEvent = () => { 
        const { deleteThisInteraction } = this.props

        let id = props.userId
        let application = props.jobId
        let ref = props.reference

        let c = window.confirm('Delete this interaction?')

        if (c === true) deleteThisInteraction(id, application, ref)
    }

    const edit = () => {
        const { toggleModal } = this.props

        let ourInteraction = {}
        ourInteraction['type'] = props.type
        ourInteraction['date'] = props.date
        ourInteraction['notes'] = props.notes
        ourInteraction['userId'] = props.userId
        ourInteraction['jobId'] = props.jobId
        ourInteraction['ref'] = props.reference
        toggleModal(true, ourInteraction)
    }

    return (
        <div className="job-timeline-entry">
            <span className="timeline-dot">
                <FontAwesomeIcon icon={faCircle} />
            </span>
            <ul className="timeline-basics"
                onClick={setShowNotes(!showNotes)}>
                <li>{props.type}</li>
                <li className="timeline-divider"> — </li>
                <li className="timeline-date">{props.date}</li>
                {props.type !== "Submitted application" && <li className="timeline-cntrls">
                    <span className="timeline-cntrl"
                        onClick={edit}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </span>
                    <span className="timeline-cntrl"
                        onClick={deleteEvent}>
                        <FontAwesomeIcon icon={faTimesCircle} />
                    </span>
                </li>}
            </ul>
            <SlideDown className="job-app-slidedown">
                {showNotes && <div>
                        <div className="timeline-notes">{props.notes}</div>
                        {props.type !== "Submitted application" && <li className="timeline-cntrls cntrls-mobile">
                        <span className="timeline-cntrl"
                            onClick={edit}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                        <span className="timeline-cntrl"
                            onClick={deleteEvent}>
                            <FontAwesomeIcon icon={faTimesCircle} />
                        </span>
                    </li>}
                </div>}
            </SlideDown>
        </div>
    )
}
