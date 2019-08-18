import React, { Component } from 'react';
import { createOneJob, deleteOneJob, addInteraction, toggleUiPanel, deleteWishlistItem } from '../../actions'
import { formatSalary, byPropKey, controlPanelDatalayerPush } from '../../constants/utilities'

import { connect } from 'react-redux'

import { users, storage } from '../../firebase'

import { SlideDown } from 'react-slidedown'
import "../../../node_modules/react-slidedown/lib/slidedown.css"

import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

const INITIAL_STATE = {
  error: null,
  title: '',
  company: '',
  authUser: false,
  showDate : false,
  selectedDay: undefined,
  dateSanitized: 'Application date',
  showCustomInput: false,
  source: '--',
  posting: '--',
  companyLink: '--',
  jobContact: '--',
  jobContactEmail: '--',
  location: '--',
  salary: '--',
  confidence: '--',
  notes: '--',
  newRef: undefined,
  resumeFilename: 'Add a resume',
  coverLetterFilename: 'Add a cover letter'
}

class JobAddNew extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.addNewJob = this.addNewJob.bind(this)
    this.dateToggle = this.dateToggle.bind(this)
    this.selectDay = this.selectDay.bind(this)
    this.closePanel = this.closePanel.bind(this)
    this.setJobId = this.setJobId.bind(this)
    this.submitResume = this.submitResume.bind(this)
    this.submitCoverLetter = this.submitCoverLetter.bind(this)
    this.deleteFile = this.deleteFile.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  addNewJob = (e) => {
    e.preventDefault() 

    const { createJob, submitInteraction, deleteWishlistEntry } = this.props

    let id = this.props.authUser.uid
    let ref = this.state.newRef

    let timelineData = {
      type: "Submitted application",
      date: this.state.dateSanitized,
      notes: "--"
    }
    submitInteraction(id, ref, this.state.selectedDay, timelineData)
    
    let data = {}
    data['title'] = this.state.title
    data['company'] = this.state.company
    data['dateNumeric'] = this.state.selectedDay
    data['dateSanitized'] = this.state.dateSanitized
    data['source'] = this.state.source
    data['posting'] = this.state.posting
    data['companyLink'] = this.state.companyLink
    data['jobContact'] = this.state.jobContact
    data['jobContactEmail'] = this.state.jobContactEmail
    data['location'] = this.state.location
    data['salary'] = this.state.salary.replace(',', '')
    data['confidence'] = this.state.confidence
    data['notes'] = this.state.notes
    data['inactive'] = false
    data['fresh'] = true
    data['heatScore'] = 0
    createJob(id, ref, data)

    controlPanelDatalayerPush(
      'Add Job Panel', 
      'Create New Job', 
      `${this.state.title} / ${this.state.company}`, 
      data 
    )

    if ( document.getElementById('add-job-resume').files[0] ){
      let resumeFile = document.getElementById('add-job-resume').files[0]
      let newResumePath = storage.resumes.child(ref + '/' + resumeFile.name)

      users.addResume(id, ref, newResumePath.fullPath)
    }
    if ( document.getElementById('add-job-coverLetter').files[0] ){
      let coverLetterFile = document.getElementById('add-job-coverLetter').files[0]
      let newCoverLetterPath = storage.coverletters.child(ref + '/' + coverLetterFile.name)

      users.addCoverLetter(id, ref, newCoverLetterPath.fullPath)
    }



    // Check if the posting was created from a wishlist item; if so, delete the wishlist item as the new job entry is created
    if (this.props.data) {
      deleteWishlistEntry(id, this.props.data.ref)
    }

    this.closePanel()
    
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

  selectManage (value) {
    this.setState(byPropKey('source', value))
    if (document.getElementById('jobs-source').value === 'other') {
      this.setState({
        showCustomInput: true
      })
    } else {
      this.setState({
        showCustomInput: false
      })
    }
  }

  formatSalaryCall (value) {
    document.getElementById('job-salary').value = formatSalary(value)
  }

  submitResume () {
    let jobId = this.state.newRef

    if (document.getElementById('add-job-resume').files[0]) {

      this.setState({
        resumeFilename: "Uploading resume..."
      })

      let file = document.getElementById('add-job-resume').files[0]

      var newPath = storage.resumes.child(jobId + '/' + file.name)

      newPath.put(file).then(snapshot => {
          let fileName = newPath.fullPath.split('/')[2]
          this.setState({
            resumeFilename: fileName
          })
        }).catch(err => {
          console.log(err.message)
        })
    }
  }

  submitCoverLetter () {
    let jobId = this.state.newRef

    if (document.getElementById('add-job-coverLetter').files[0]){

      this.setState({
        coverLetterFilename: "Uploading cover letter..."
      })

      let file = document.getElementById('add-job-coverLetter').files[0]

      var newPath = storage.coverletters.child(jobId + '/' + file.name)

      newPath.put(file).then(snapshot => {
          let fileName = newPath.fullPath.split('/')[2]
          this.setState({
            coverLetterFilename: fileName
          })
        }).catch(err => {
          console.log(err.message)
        })
    }
  }

  deleteFile (type) {
    let id = this.props.authUser.uid
    let application = this.state.newRef

    if ( type === "resume" ) {
      users.deleteResume(id, application).then(() => {
        this.setState({
          resumeFilename: 'Add a resume'
        })
      })
    } else {
      users.deleteCoverLetter(id, application).then(() => {
        this.setState({
          coverLetterFilename: 'Add a cover letter'
        })
      })
    }
  }

  cancel () {
    const { sendDelete } = this.props

    let userId = this.props.authUser.uid
    let jobId = this.state.newRef
    
    sendDelete(userId, jobId)
    controlPanelDatalayerPush(
      'Add Job Panel',
      'Cancel Job Application', 
      this.state.title,
      this.state.company
    )
    this.closePanel()
  }

  setJobId (id) {
    let newJobObj = users.doCreateJobRef(id)
    let newJobRef = newJobObj.path.pieces_[3]

    this.setState({
      newRef: newJobRef
    })
  }

  closePanel () {
    const { closeControlPanels } = this.props
    closeControlPanels('close', null)
  }

  componentDidUpdate (props) {
    if (props.authUser &&
        this.state.authUser === false) {
        this.setJobId(props.authUser.uid)
        this.setState({
            authUser: true
        })
    }
  }

  componentDidMount () {  
    if (this.props.data) {
      this.setState({
        company: this.props.data.company,
        title: this.props.data.title,
        posting: this.props.data.url
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
        <div className="ui-panel-wrap job-add-new-panel">
            {isInvalid && <div className="ui-info">Job entries need a job title, company name, and application date</div>}
            <div className="job-form">
              <div className="main-fields">
                <label>Job title{isInvalid && <span className="required">*</span>}</label>
                <input
                onChange={event => this.setState(byPropKey('title', event.target.value))}
                type="text"
                className="ui-input"
                value={this.state.title}
                />
                 <label>Company name{isInvalid && <span className="required">*</span>}</label>
                <input
                onChange={event => this.setState(byPropKey('company', event.target.value))}
                type="text"
                className="ui-input"
                value={this.state.company}
                />
              </div>
              <div className="jobs-date-wrap">
                <button
                  onClick={this.dateToggle}
                    className={"cntrl-link " + (this.state.showDate ? "highlight" : "")}>{this.state.dateSanitized}
                    {isInvalid &&<span className="required">*</span>}
                </button>
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
                          defaultValue="--">
                          <option value="--" disabled>Job Source</option>
                          <option value="AngelList">AngelList</option>
                          <option value="CraigsList">Craigslist</option>
                          <option value="Indeed">Indeed</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Monster">Monster</option>
                          <option value="Reference">Reference</option>
                          <option value="ZipRecruiter">Ziprecruiter</option>
                          <option value="other">Other</option>
                        </select>
                    </div>
                    {this.state.showCustomInput && <input type="text" name="jobs-source-input" id="jobs-source-input"
                      className="ui-input"
                      placeholder="Where'd you find this job?" 
                      onChange={e => this.selectManage(e.target.value)} />}
                </div>
                <div className="jobs-input-group">
                  <div className="jobs-input-wrapper">
                    <label htmlFor="job-posting-link">Job posting link</label>
                    <input type="text" name="job-posting-link" id="job-posting-link" className="ui-input"
                    onChange={event => this.setState(byPropKey('posting', event.target.value))} 
                    value={this.state.posting} />
                  </div>
                  <div className="jobs-input-wrapper">
                    <label htmlFor="job-company-link">Company link</label>
                    <input type="text" name="job-company-link" id="job-company-link" className="ui-input" 
                    onChange={event => this.setState(byPropKey('companyLink', event.target.value))} />
                  </div>
                </div>
                <div className="jobs-input-group">
                 <div className="jobs-input-wrapper">
                  <label htmlFor="job-contact">Your contact</label>
                    <input type="text" name="job-contact" id="job-contact" className="ui-input" 
                    onChange={event => this.setState(byPropKey('jobContact', event.target.value))}/>
                  </div>
                  <div className="jobs-input-wrapper">
                    <label htmlFor="job-contact-email">Contact's email</label>
                    <input type="email" name="job-contact-email" id="job-contact-email" className="ui-input" 
                    onChange={event => this.setState(byPropKey('jobContactEmail', event.target.value))} />
                  </div>
                </div>
                <div className="jobs-input-group">
                  <label htmlFor="job-location">Job location</label>
                  <input type="text" name="job-location" id="job-location" className="ui-input"
                  onChange={event => this.setState(byPropKey('location', event.target.value))} />
                </div>
                <div className="jobs-input-group">
                  <label htmlFor="job-salary">Job salary</label> 
                  <span className="ui-input-label">$</span>
                  <input type="text" name="job-salary" id="job-salary" className="ui-input salary-input" placeholder="(annual)"
                  onBlur={e => this.formatSalaryCall(e.target.value)} 
                  onChange={event => this.setState(byPropKey('salary', event.target.value))} />
                </div>
                <div className="jobs-input-group">
                  <label htmlFor="jobs-heat-score">Confidence</label>
                  <div className="jobs-dropdown">
                        <select
                          name="jobs-heat-score"
                          id="jobs-heat-score"
                          defaultValue="--"
                          onChange={event => this.setState(byPropKey('confidence', event.target.value))} >
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
                      onChange={event => this.setState(byPropKey('notes', event.target.value))} >
                    </textarea>
                </div>
                <div className="jobs-input-group">
                  <div className="ui-file-input">
                    <label htmlFor="add-job-resume"
                      className="file-input-label">
                      {this.state.resumeFilename}
                    </label>
                    <input id="add-job-resume" 
                      type="file" 
                      onChange={this.submitResume} />
                      {this.state.resumeFilename !== 'Add a resume' &&
                      <span className="delete-file"
                        onClick={() => this.deleteFile("resume")}>x</span>}
                  </div>
                    <div className="ui-file-input">
                      <label htmlFor="add-job-coverLetter"
                      className="file-input-label">
                        {this.state.coverLetterFilename}
                      </label>
                      <input id="add-job-coverLetter" 
                      type="file" 
                      onChange={this.submitCoverLetter} />
                      {this.state.coverLetterFilename !== 'Add a cover letter' &&
                      <span className="delete-file"
                        onClick={() => this.deleteFile("coverletter")}>x</span>}
                    </div>
                </div>
                <div className="btns-wrap">
                  <button disabled={isInvalid} 
                    onClick={this.addNewJob}
                    type="submit"
                    className="btn-submit">
                  Add job
                  </button>
                  <button 
                    className="btn-standard"
                    onClick={this.cancel}>
                  Cancel
                  </button>
                </div>
            </div>
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  order: state.controlState.order,
  data: state.controlState.data
});

const mapDispatchToProps = (dispatch) => ({
  createJob: (id, ref, data) => dispatch(createOneJob(id, ref, data)),
  closeControlPanels: (order, data) => dispatch(toggleUiPanel(order, data)),
  sendDelete: (userId, jobId) => dispatch(deleteOneJob(userId, jobId)),
  submitInteraction: (id, jobId, ref, data) => dispatch(addInteraction(id, jobId, ref, data)),
  deleteWishlistEntry: (id, ref) => dispatch(deleteWishlistItem(id, ref))
});

export default connect(mapStateToProps, mapDispatchToProps)(JobAddNew);

