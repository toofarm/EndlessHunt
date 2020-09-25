  import React, { Component } from 'react';
import Modal from 'react-modal';

import { SlideDown } from 'react-slidedown'
import "../../../node_modules/react-slidedown/lib/slidedown.css"

import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { toggleModal, editOneJob, deleteOneJob, updateInteraction, getInteractions } from '../../actions'
import { byPropKey, formatSalary } from '../../constants/utilities'

import { storage, users } from '../../firebase';

import { connect } from 'react-redux'

const INITIAL_STATE = {
    company: '',
    companyLink: '',
    confidence: '',
    contact: '',
    contactEmail: '',
    coverLetter: '',
    dateNumeric: 0,
    dateSanitized: 'Application date?',
    inactive: false,
    location: '',
    notes: '',
    position: '',
    postingLink: '',
    resume: '',
    salary: '',
    source: '',
    sourceHidden: '',
    selectedDay: undefined,
    showDate: false,
    fresh: true,
    timelineRef: '',
    initFlag: false
}

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      width                 : '75%',
      maxHeight             : '90%',
      overflow              : 'scroll',
      border                : '2px solid #5299E5'      
    }
  }

class EditModal extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.resumeFileInput = React.createRef()
    this.coverLetterFileInput = React.createRef()

    this.closeModal = this.closeModal.bind(this)
    this.selectManage = this.selectManage.bind(this)
    this.dateToggle = this.dateToggle.bind(this)
    this.selectDay = this.selectDay.bind(this)
    this.submitResume = this.submitResume.bind(this)
    this.deleteResume = this.deleteResume.bind(this)
    this.submitCoverLetter = this.submitCoverLetter.bind(this)
    this.deleteCoverLetter = this.deleteCoverLetter.bind(this)
    this.deleteApplication = this.deleteApplication.bind(this)
    this.submitEdits = this.submitEdits.bind(this)
    this.formatSalaryCall = this.formatSalaryCall.bind(this)
    this.getFirstInteraction = this.getFirstInteraction.bind(this)
  }

  selectManage (value) {
    this.setState(byPropKey('source', value), () => {
      if (this.state.source === 'other') {
        this.setState({
          showCustomInput: true
        })
      } else {
        this.setState({
          showCustomInput: false
        })
      }
    })
    this.setState(byPropKey('sourceHidden', value))   
  }

  dateToggle () {
    this.state.showDate ?
      this.setState({
        showDate: false
      }) :
      this.setState({
        showDate: true
      })
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

  formatSalaryCall (value) {
    this.setState(byPropKey('salary', formatSalary(value)))
  }

  submitResume (e) {
    e.preventDefault()
    let jobId = this.props.job.jobId
    let userId = this.props.job.userId
    let file = this.resumeFileInput.current.files[0]

    var newPath = storage.resumes.child(jobId + '/' + file.name)

    newPath.put(file).then(snapshot => {
      users.addResume(userId, jobId, newPath.fullPath).then(snapshot => {
        let fileName = newPath.fullPath.split('/')[2]
        this.setState({
          resume: fileName
        })
      }).catch(err => {
        console.log(err.message)
      })
    }).catch(err => {
      console.log(err.message)
    })
  }

  deleteResume () {
    let jobId = this.props.job.jobId
    let userId = this.props.job.userId
    let filename = this.state.resume

    var path = storage.resumes.child(jobId + '/' + filename)

    path.delete().then(() => {
      users.deleteResume(userId, jobId).then(() => {
        console.log('Resume deleted from user object')
      }).catch(err => {
        console.log(err.message)
      })
      this.setState({
        resume: 'Add a resume?'
      })
    }).catch(err => {
      console.log(err.message)
    })
  }

  submitCoverLetter (e) {
    e.preventDefault()
    let jobId = this.props.job.jobId
    let userId = this.props.job.userId
    let file = this.coverLetterFileInput.current.files[0]

    var newPath = storage.coverletters.child(jobId + '/' + file.name)

    newPath.put(file).then(snapshot => {
      users.addCoverLetter(userId, jobId, newPath.fullPath).then(snapshot => {
        let fileName = newPath.fullPath.split('/')[2]
        this.setState({
          coverLetter: fileName
        })
      }).catch(err => {
        console.log(err.message)
      })
    }).catch(err => {
      console.log(err.message)
    })
  }

  deleteCoverLetter () {
    let jobId = this.props.job.jobId
    let userId = this.props.job.userId
    let filename = this.state.coverLetter

    var path = storage.coverletters.child(jobId + '/' + filename)

    path.delete().then(() => {
      users.deleteCoverLetter(userId, jobId).then(() => {
        console.log('Cover letter deleted from user object')
      }).catch(err => {
        console.log(err.message)
      })
      this.setState({
        coverLetter: 'Add a cover letter?'
      })
    }).catch(err => {
      console.log(err.message)
    })
  }

  deleteApplication () {
    const { sendDelete, toggleModal } = this.props
    let jobId = this.props.job.jobId
    let userId = this.props.job.userId  

    if (window.confirm('Sure you want to delete this application?')) {
      sendDelete(userId, jobId)
      toggleModal(false, null)
    }

  }

  // We pull the interactions object because if the user updates the original application date we'll have to update the timeline event to reflect that new data
  getFirstInteraction (userId, jobId) {
    const { getTimelineEvents } = this.props
    getTimelineEvents(userId)
    let interactions = this.props.interactions
    for (var key in interactions) {
      if (key === jobId) {
        for (var key2 in interactions[key]) {
          if (interactions[key][key2].type === "Submitted application") {
            this.setState({
              timelineRef: key2
            })
          }
        }
      }
    }
  }

  submitEdits () {
      const { submitEdits, toggleModal, updateTimelineEvent } = this.props
      let jobId = this.props.job.jobId
      let userId = this.props.job.userId
      // Create new job object with updated values
      let data = {
        company: this.state.company,
        companyLink: this.state.companyLink,
        confidence: this.state.confidence,
        contact: this.state.contact,
        contactEmail: this.state.contactEmail,
        coverLetter: this.state.coverLetter,
        dateNumeric: this.state.dateNumeric,
        dateSanitized: this.state.dateSanitized,
        inactive: this.state.inactive,
        location: this.state.location,
        notes: this.state.notes,
        position: this.state.position,
        postingLink: this.state.postingLink,
        resume: this.state.resume,
        salary: this.state.salary.replace(',', ''),
        source: this.state.sourceHidden, 
        fresh: this.state.fresh
      }
      let timelineData = {
        type: "Submitted application",
        notes: "",
        date: this.state.dateSanitized
      }
      // Update timeline, update job entry, then close the modal
      updateTimelineEvent(userId, jobId, this.state.timelineRef, timelineData)
      submitEdits(userId, jobId, data)
      toggleModal(false, null)
  }

  closeModal () {
    const { toggleModal } = this.props
    toggleModal(false, null)  
  }

  componentDidMount () {
    Modal.setAppElement('#app')
  }

  componentDidUpdate (props) {
    // We use the init flag so that state is not reverted on every input change 
    if (props.job !== null &&
        this.state.initFlag === false) {
        let inactiveState
        let resumeFilename
        let coverLetterFilename
        let userId = props.job.userId
        let jobId = props.job.jobId
        if (props.job.inactive === undefined) inactiveState = false
        else inactiveState = props.job.inactive
        if (props.job.resume) {
          resumeFilename = props.job.resume.split('/')[2]
        } else {
          resumeFilename = 'Add a resume?'
        }
        if (props.job.coverLetter) {
          coverLetterFilename = props.job.coverLetter.split('/')[2]
        } else {
          coverLetterFilename = 'Add a cover letter?'
        }
        this.getFirstInteraction(userId, jobId)
        // Set initial values from existing job data
        this.setState({ 
            position: props.job.position,
            company: props.job.company,
            dateSanitized: props.job.dateSanitized,
            selectedDay: props.job.dateSanitized,
            companyLink: props.job.companyLink,
            confidence: props.job.confidence,
            contact: props.job.contact,
            contactEmail: props.job.contactEmail,
            coverLetter: coverLetterFilename,
            dateNumeric: props.job.dateNumeric,
            location: props.job.location,
            notes: props.job.notes,
            postingLink: props.job.postingLink,
            resume: resumeFilename,
            source: props.job.source,
            sourceHidden: props.job.source,
            inactive: inactiveState,
            salary: formatSalary(props.job.salary),
            fresh: props.job.fresh,
            initFlag: true
        })
    }
  }

  render() {

    const {
        title,
        company,
        selectedDay
      } = this.state;
  
      const isInvalid =
        title === '' ||
        company === '' ||
        selectedDay === undefined

    return (
      <div className="modal-wrap">
        <Modal
            isOpen={this.props.modalState}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Edit Job"
            closeTimeoutMS={200}
            >
            <div className="modal-inner ui-panel-wrap">
                <h2>Make your changes</h2>
                <div className="modal-form-wrap">
                {isInvalid && <div className="ui-info">Job entries need a job title, company name, and application date</div>}
                <label className="inactive-check"
                        htmlFor="inactive">
                        <input type="checkbox" id="inactive" name="inactive" 
                        checked={this.props.job ? this.state.inactive : false}
                        onChange={e => this.setState(byPropKey('inactive', e.target.checked))}
                        />
                        <span className="checkmark"></span>
                        Application closed  
                    </label>
                <div className="job-form">
                <div className="jobs-input-group">
                    <div className="jobs-input-wrapper">
                        <label>Job title{isInvalid && <span className="required">*</span>}</label>
                        <input
                        onChange={event => this.setState(byPropKey('position', event.target.value))}
                        type="text"
                        className="ui-input"
                        value={this.props.job ? this.state.position : ''}
                        />
                    </div>
                    <div className="jobs-input-wrapper">
                        <label>Company name{isInvalid && <span className="required">*</span>}</label>
                        <input
                        onChange={event => this.setState(byPropKey('company', event.target.value))}
                        type="text"
                        className="ui-input"
                        value={this.props.job ? this.state.company : ''}
                        />
                    </div>
                </div>
                <div className="jobs-date-wrap">
                    <span
                    onClick={this.dateToggle}
                        className={"cntrl-link " + (this.state.showDate ? "highlight" : "")}>{this.state.dateSanitized}
                        {isInvalid &&<span className="required">*</span>}
                    </span>
                    <SlideDown className="job-app-slidedown">
                        {this.state.showDate && <DayPicker 
                            onDayClick={this.selectDay}
                            selectedDays={this.state.selectedDay}
                            />}
                    </SlideDown>
                    </div>
                    <div className="jobs-input-group">
                    <div className="jobs-dropdown">
                            <select
                            onChange={e => this.selectManage(e.target.value)}
                            name="jobs-source"
                            id="jobs-source"
                            value={this.props.job ? this.state.source : '--'}>
                            <option value="--" disabled>Job Source</option>
                            <option value="AngelList">AngelList</option>
                            <option value="CraigsList">Craigslist</option>
                            <option value="Indeed">Indeed</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Monster">Monster</option>
                            <option value="Reference">Reference</option>
                            <option value="ZipRecruiter">ZipRecruiter</option>
                            <option value="other">Other</option>
                            </select>
                        </div>
                        {this.state.showCustomInput && <input type="text" name="jobs-source-input" id="jobs-source-input"
                        className="ui-input"
                        placeholder="Where'd you find this job?" 
                        onChange={event => this.setState(byPropKey('sourceHidden', event.target.value))} />}
                        <input name="hiddenVal" id="hiddenVal" type="hidden" />
                    </div>
                    <div className="jobs-input-group">
                        <div className="jobs-input-wrapper">
                            <label htmlFor="job-posting-link">Job posting link</label>
                            <input type="text" name="job-posting-link" id="job-posting-link" className="ui-input"
                            onChange={event => this.setState(byPropKey('postingLink', event.target.value))}
                            value={this.props.job ? this.state.postingLink : ''}/>
                        </div>
                        <div className="jobs-input-wrapper">
                            <label htmlFor="job-company-link">Company link</label>
                            <input type="text" name="job-company-link" id="job-company-link" className="ui-input" 
                            onChange={event => this.setState(byPropKey('companyLink', event.target.value))}
                            value={this.props.job ? this.state.companyLink : ''}/>
                        </div>
                    </div>
                    <div className="jobs-input-group">
                    <div className="jobs-input-wrapper">
                    <label htmlFor="job-contact">Your contact</label>
                        <input type="text" name="job-contact" id="job-contact" className="ui-input" 
                        onChange={event => this.setState(byPropKey('contact', event.target.value))}
                        value={this.props.job ? this.state.contact : ''}/>
                    </div>
                    <div className="jobs-input-wrapper">
                        <label htmlFor="job-contact-email">Contact's email</label>
                        <input type="email" name="job-contact-email" id="job-contact-email" className="ui-input" 
                        onChange={event => this.setState(byPropKey('contactEmail', event.target.value))}
                        value={this.props.job ? this.state.contactEmail : ''}/>
                    </div>
                    </div>
                    <div className="jobs-input-group">
                        <label htmlFor="job-location">Job location</label>
                        <input type="text" name="job-location" id="job-location" className="ui-input" 
                        onChange={event => this.setState(byPropKey('location', event.target.value))}
                        value={this.props.job ? this.state.location : ''} />
                    </div>
                    <div className="jobs-input-group">
                        <label htmlFor="job-salary">Job salary</label> 
                        <span className="ui-input-label">$</span>
                        <input type="text" name="job-salary" id="job-salary" className="ui-input salary-input" placeholder="(annual)" 
                        value={this.state.salary}
                        onChange={e => this.formatSalaryCall(e.target.value)}
                        onBlur={e => this.formatSalaryCall(e.target.value)}
                        />
                    </div>
                    <div className="jobs-input-group">
                    <label htmlFor="jobs-heat-score">Confidence</label>
                    <div className="jobs-dropdown">
                            <select
                            name="jobs-heat-score"
                            id="jobs-heat-score"
                            onChange={event => this.setState(byPropKey('confidence', event.target.value))}
                            value={this.props.job ? this.state.confidence : '--'}>
                                <option value="--" disabled>How do you feel about this one?</option>
                                <option value="7">Great!</option>
                                <option value="6">Pretty confident</option>
                                <option value="5">Okay</option>
                                <option value="4">Meh</option>
                                <option value="3">Shakey</option>
                                <option value="2">It's a long shot</option>
                                <option value="1">It's a Hail Mary</option>
                            </select>
                        </div>
                    </div>
                    <div className="jobs-input-group">
                        <label htmlFor="job-notes">Other notes?</label>
                        <textarea
                        name="jobs-notes"
                        id="jobs-notes"
                        onChange={event => this.setState(byPropKey('notes', event.target.value))}
                        value={this.props.job ? this.state.notes : ''}>
                        </textarea>
                    </div>
                    <div className="jobs-input-group">
                    <div className="ui-file-input">
                        <label htmlFor="add-job-resume"
                        className="file-input-label">
                        {this.state.resume}
                        </label>
                        <input id="add-job-resume" 
                        type="file" 
                        ref={this.resumeFileInput}
                        onChange={this.submitResume} />
                        {this.state.resume !== 'Add a resume?' &&
                        <span className="delete-file"
                            onClick={this.deleteResume}>x</span>}
                    </div>
                        <div className="ui-file-input">
                          <label htmlFor="add-job-coverLetter"
                          className="file-input-label">
                              {this.state.coverLetter}
                          </label>
                          <input id="add-job-coverLetter" 
                          type="file" 
                          onChange={this.submitCoverLetter} 
                          ref={this.coverLetterFileInput} />
                          {this.state.coverLetter !== 'Add a cover letter?' &&
                          <span className="delete-file"
                              onClick={this.deleteCoverLetter}>x</span>}
                        </div>
                    </div>
                    <div className="jobs-input-group">
                      <button className="modal-delete-btn"
                        onClick={this.deleteApplication}>
                        Delete application
                      </button>
                    </div>
                </div>
                <div className="btn-wrap">
                    <button className="modal-submit-btn" disabled={isInvalid}
                        onClick={this.submitEdits}>Confirm</button>
                    <button className="modal-cancel-btn" 
                        onClick={this.closeModal}>Cancel</button>
                </div>
            </div>
        </div>
        </Modal> 
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  modalState: state.modalState.jobModal,
  job: state.modalState.job,
  interactions: state.interactionsState.interactions
});

const mapDispatchToProps = (dispatch) => ({
  toggleModal: (order, job) => dispatch(toggleModal(order, false, job, null)),
  submitEdits: (id, jobId, data) => dispatch(editOneJob(id, jobId, data)),
  sendDelete: (userId, jobId) => dispatch(deleteOneJob(userId, jobId)),
  getTimelineEvents: (id) => dispatch(getInteractions(id)),
  updateTimelineEvent: (userId, jobId, ref, data) => dispatch(updateInteraction(userId, jobId, ref, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(EditModal);
