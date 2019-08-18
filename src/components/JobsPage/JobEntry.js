import React, { Component } from 'react';
import JobAddInteraction from './Timeline/JobAddInteraction'
import JobTimeline from './Timeline/JobTimeline'
import { toggleModal } from '../../actions'
import { formatSalary } from '../../constants/utilities'

import { jobPanelDatalayerPush } from '../../constants/utilities'

import { storage, } from '../../firebase';

import { connect } from 'react-redux'

class JobEntry extends Component { 
  constructor(props) {
    super(props);

    this.state = {
      key: '',
      resumeFilename: '',
      clFilename: '',
      salary: "--"
     };

     this.editModalOpen = this.editModalOpen.bind(this)
     this.getResumeLink = this.getResumeLink.bind(this)
     this.getCoverLetterLink = this.getCoverLetterLink.bind(this)
  }

  getResumeLink () {
    let jobId = this.props.id
    let filename = this.state.resumeFilename

    var path = storage.resumes.child(jobId + '/' + filename)

    path.getDownloadURL().then( function (url) {
      var link = document.getElementById(jobId + "dwnldLink")
      link.href = url
    }).catch(err => {
      console.log(err.message)
    })
  }

  getCoverLetterLink () { 
    let jobId = this.props.id
    let filename = this.state.coverLetterFilename

    var path = storage.coverletters.child(jobId + '/' + filename)

    path.getDownloadURL().then( function (url) {
      var link = document.getElementById(jobId + "coverletterdwnldLink")
      link.href = url
    }).catch(err => {
      console.log(err.message)
    })
  }

  editModalOpen () {
    const { toggleModal } = this.props
    let job = this.props.job
    let jobTitle = job.position
    let jobCompany = job.company 
    jobPanelDatalayerPush('Edit Job', jobTitle, jobCompany)
    job['userId'] = this.props.userId
    job['jobId'] = this.props.id
    toggleModal(true, job)
  }

  componentDidMount () {
    this.setState({
      key: this.props.id
    })
    if (this.props.job.resume) {
      let filename = this.props.job.resume.split('/')[2]
      this.setState({
        resumeFilename: filename,
      }, () => {
        this.getResumeLink()
      })
    }
    if (this.props.job.coverLetter) {
      let clFilename = this.props.job.coverLetter.split('/')[2]
      this.setState({
        coverLetterFilename: clFilename
      }, () => {
        this.getCoverLetterLink()
      })
    }
  }

  render() {
    return (
      <div className="single-job-entry">
          <div className="jobs-txt-wrap row">
          <div className="inactive-message col-md-12">
            This job is inactive
          </div>
              <div className="job-item col-md-4">
              <div className="app-date">
                <div className="job-item-label">Application date</div>
                <div className="job-datapoint">
                  {this.props.job.dateSanitized}
                </div>
              </div>
              <div className="job-item-label">Company website</div>
              {this.props.job.companyLink !== "--" ? 
                <div className="job-datapoint">
                  <a href={this.props.job.companyLink} target="_blank">{this.props.job.company}</a> 
                </div> :
                "--"}
                <div className="job-item-label">Location</div>
                <div className="job-datapoint no-break"> 
                    {this.props.job.location === "--" ? 
                        "--" : 
                        <a href={"https://maps.google.com/?q=" + this.props.job.location} target="_blank">{this.props.job.location}
                        </a>} 
                </div>
                <div className="job-item-label">Job source</div>
                <div className="job-datapoint">
                  {this.props.job.source !== undefined ? 
                    this.props.job.source :
                    "--"}
                </div>
                <div className="job-item-label">Job listing</div>
                {this.props.job.postingLink !== "--" ? 
                <div className="job-datapoint">
                  <a href={this.props.job.postingLink} target="_blank">{this.props.job.position}</a> 
                </div> :
                "--"}
              </div>
              <div className="job-item col-md-4">
                <div className="job-item-label">Contact</div>
                <div className="job-datapoint"> 
                  {this.props.job.contact === "" ? "--" : this.props.job.contact} 
                </div>
                <div className="job-item-label">Contact's Email</div>
                <div className="job-datapoint"> 
                  {this.props.job.contactEmail === "" ? "--" : this.props.job.contactEmail} 
                </div>
                <div className="job-item-label">Projected salary</div>
                <div className="job-datapoint"> 
                  $ {formatSalary(this.props.job.salary)} 
                </div>
              </div>
              <div className="job-item col-md-4">
              {this.props.job.resume !== undefined ?
                <div className="resume-link">
                  <a id={this.props.id + "dwnldLink"} className="dummy-link" target="_blank">Resume</a>
                </div> :
                <div className="file-missing">
                  No resume uploaded
                </div>}
                {this.props.job.coverLetter !== undefined ?
                <div className="resume-link">
                  <a id={this.props.id + "coverletterdwnldLink"} className="dummy-link" target="_blank">Cover letter</a>
                </div> :
                <div className="file-missing">
                  No cover letter uploaded
                </div>}
              </div>
              <div className="col-md-12 job-item">
              <div className="job-item-label">Notes</div>
                <div className="job-datapoint no-break"> 
                  {this.props.job.notes === "" ? "--" : this.props.job.notes} 
                </div>
              </div>
              <JobTimeline
                id={this.props.userId}
                jobId={this.props.id}
                />
              <JobAddInteraction 
                id={this.props.userId} 
                jobId={this.props.id} 
                title={this.props.job.position} 
                company={this.props.job.company} />
              <div className="job-btns-wrap">
              <button className="job-entry-btn"
                    onClick={this.editModalOpen}>
                    Edit
                </button>
                <button className="job-entry-btn delete"
                    onClick={this.props.deleteJob}
                    data-id={this.props.id}>Delete
                </button>
              </div>
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  modalState: state.modalState.jobModal
});

const mapDispatchToProps = (dispatch) => ({
  toggleModal: (order, job) => dispatch(toggleModal(order, false, job, null))
});

export default connect(mapStateToProps, mapDispatchToProps)(JobEntry);