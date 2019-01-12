import React, { Component } from 'react';
import { addInteraction, editOneJob } from '../../../actions'

import { connect } from 'react-redux'

import { SlideDown } from 'react-slidedown'
import "../../../../node_modules/react-slidedown/lib/slidedown.css"

import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { users } from '../../../firebase'

class JobAddInteraction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            type: '',
            showForm: false,
            showCustomInput: false,
            showDate : false,
            selectedDay: undefined,
            dateSanitized: "Interaction date",
            rejectedFlag: false
        }

        this.formReveal = this.formReveal.bind(this)
        this.dateToggle = this.dateToggle.bind(this)
        this.selectDay = this.selectDay.bind(this)
        this.interactionSubmit = this.interactionSubmit.bind(this)
    }

    formReveal () {
        if (this.state.showForm === false) {
            this.setState({
                showForm: true
            })
        } else {
            this.setState({
                showForm: false,
                showCustomInput: false
            })
        }
    }

    selectManage (value) {
        if (document.getElementById('interaction-dropdown').value === "Other") {
            this.setState({
                showCustomInput: true
            })
        } else {
            this.setState({
                showCustomInput: false
            })
        }
        document.getElementById('interaction-type').value = value
        this.setState({
            type: value
        })
    }

    dateToggle () {
        if (this.state.showDate === false) {
            this.setState({
                showDate: true
            })
        } else {
            this.setState({
                showDate: false
            })
        }
    }

    selectDay (day) {
        const months = ["Jan", "Feb", "March", "Apr", "May", "June",
                          "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
        let month = months[day.getMonth()]
    
        let cleanDay = day.getDate() + " " + month + ", " + day.getFullYear()
        let numericDay = Date.parse(day)
        
        this.setState({
          selectedDay: numericDay,
          showDate: false,
          dateSanitized: cleanDay
        })
      }

    interactionSubmit () {
        const { submitInteraction, editOneJob } = this.props

        let id = this.props.id
        let jobId = this.props.jobId
        let ref = this.state.selectedDay
        let interactionType  = this.state.type
        let interactionNotes = document.getElementById('interaction-notes').value
        let data = {
            type: this.state.type,
            date: this.state.dateSanitized,
            notes: interactionNotes
        }

        if ( interactionType === 'Rejected' ) {
            users.getOneJob(id, jobId).then( snapshot => {
                let job = snapshot.val()
                job['inactive'] = true
                editOneJob(id, jobId, job)
            }).catch( (err) => {
                console.log(err.message)
            
            })
        }

        submitInteraction(id, jobId, ref, data)
        
        this.setState({
            showForm: false
        })
    }

    render() {
        const {
            type,
            selectedDay
          } = this.state;
      
        const isInvalid =
            type === '' ||
            selectedDay === undefined

        return (
            <div className="job-add-interaction col-md-12">
                <SlideDown className="job-app-slidedown">
                    {this.state.showForm && 
                    <div className="job-interaction-form">
                        <h4>Interaction</h4>
                        <select id="interaction-dropdown" 
                            name="interaction-dropdown"
                            defaultValue="--"
                            onChange={e => this.selectManage(e.target.value)}>
                            <option value="--" disabled>Interaction type</option>
                            <option value="Email response">Email response</option>
                            <option value="Phone interview">Phone interview</option>
                            <option value="First interview">First in-person interview</option>
                            <option value="Second interview">Second in-person interview</option>
                            <option value="Third interview">Third in-person interview</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Other">Other</option>
                        </select>
                        {this.state.showCustomInput && <input type="text" name="interaction-custom-input" id="interaction-custom-input"
                        className="ui-input"
                        placeholder="Interaction type" 
                        onChange={e => this.selectManage(e.target.value)} />}
                        <input name="interaction-type" id="interaction-type" type="hidden" />
                        <div className="jobs-date-wrap">
                            <button
                            onClick={this.dateToggle}
                                className={"cntrl-link " + (this.state.showDate ? "highlight" : "")}>{this.state.dateSanitized}
                            </button>
                            <SlideDown className="job-app-slidedown">
                                {this.state.showDate && <DayPicker 
                                    onDayClick={this.selectDay}
                                    selectedDays={this.state.selectedDay}
                                    />}
                            </SlideDown>
                        </div>
                        <label htmlFor="interaction-notes">Notes</label>
                        <textarea id="interaction-notes"
                            name="interaction-notes">
                        </textarea>
                        <div className="btn-wrap">
                            <button className="job-interaction-submit"
                                disabled={isInvalid}
                                onClick={this.interactionSubmit}>
                                Submit
                            </button>
                            <div className="job-interaction-btn"
                                onClick={this.formReveal}>
                                Cancel
                            </div>
                        </div>
                    </div>}
                </SlideDown>
                <div className="job-interaction-btn"
                    onClick={this.formReveal}>
                    {this.state.showForm ? "" : "Add timeline event +"}
                </div>
            </div>
        )
    }
}
  
const mapDispatchToProps = (dispatch) => ({
    submitInteraction: (id, jobId, ref, data) => dispatch(addInteraction(id, jobId, ref, data)),
    editOneJob: (id, jobId, data) => dispatch(editOneJob(id, jobId, data))
  });
  
export default connect(null, mapDispatchToProps)(JobAddInteraction);