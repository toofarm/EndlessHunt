import React, { Component } from "react";
import { connect } from "react-redux";
import { getInteractions, editOneJob } from "../../actions";

import { one_day, jobPanelDatalayerPush } from '../../constants/utilities'

import JobEntry from "./JobEntry";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleUp } from "@fortawesome/free-solid-svg-icons";

import { SlideDown } from "react-slidedown";
import "../../../node_modules/react-slidedown/lib/slidedown.css";

class JobEntryWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFullEntry: false,
      dotColor: {
        backgroundColor: "#DDD"
      },
      arrowColor: {
        color: "#82C91D"
      },
      flag: false,
      fresh: true,
      interval: 0,
      counter: 0,
      heatCondition: false
    };
    this.toggleEntry = this.toggleEntry.bind(this);
    this.checkInteractionDate = this.checkInteractionDate.bind(this)
    this.handleNudgeResponse = this.handleNudgeResponse.bind(this)
  }

  toggleEntry() {
    let jobTitle = this.props.job.position 
    let jobCompany = this.props.job.company
    if (this.state.showFullEntry === false) {
      jobPanelDatalayerPush('Open Job Accordion', jobTitle, jobCompany)
      this.setState({
        showFullEntry: true
      });
    } else {
      jobPanelDatalayerPush('Close Job Accordion', jobTitle, jobCompany)
      this.setState({
        showFullEntry: false
      });
    }
  }

  checkInteractionDate(interactions) {
    let data = this.props.job
    // First, find the interval between the latest entry and the present
    let now = new Date(Date.now());
    let latest = 0
    for (var key in interactions) {
        if (key > latest) latest = key
    }
    let ourInterval = now - latest
    ourInterval = Math.round(ourInterval/one_day)
    // Then, if we haven't had any interactions in the past 35 days, the application isn't inactive, and the user hasn't turned off nudges for this entry, ping the user
    if (ourInterval > 35 &&
        data.inactive === false &&
        data.fresh === true) {
        this.setState({
            fresh: false,
            interval: ourInterval
        })
    } else {
        this.setState({
            fresh: true
        })
    }
    // Check for jobs with multiple interactions. Mark these with the 'active' icon and set appropriate color
    if (Object.keys(interactions).length > 1 &&
        data.inactive === false) {
        this.setState({
          heatCondition: true
        })
        if (Object.keys(interactions).length > 3) {
          this.setState({
            arrowColor: { color: 'rgb(67, 109, 5)' }
          })
        } else if (Object.keys(interactions).length > 2) {
          this.setState({
            arrowColor: { color: 'rgb(103, 165, 9)' }
          })
        }
      }
  }

  handleNudgeResponse (e, order) {
    // Stop propagation to prevent drawer from opening
    e.stopPropagation()
    let jobTitle = this.props.job.position 
    let jobCompany = this.props.job.company
    let userAction = order === 'inactive' ? 'Deactivate' : 'Dismiss'
    let jobPanelAction = `Address Nudge - ${userAction}`
    jobPanelDatalayerPush(jobPanelAction, jobTitle, jobCompany)
    const { editJob } = this.props
    let id = this.props.userId
    let jobId = this.props.id
    let data = this.props.job
    if (order === 'inactive') data.inactive = true
    else data.fresh = false
    editJob(id, jobId, data)
  }

  componentDidMount() {
    const { getTimelineEvents } = this.props;
    let id = this.props.userId;

    let confidence = Number(this.props.job.confidence);
    let color;

    switch (confidence) {
      case 7:
        color = { backgroundColor: "#cc0000" };
        break;
      case 6:
        color = { backgroundColor: "#ff0000" };
        break;
      case 5:
        color = { backgroundColor: "#ff3333" };
        break;
      case 4:
        color = { backgroundColor: "#006699" };
        break;
      case 3:
        color = { backgroundColor: "#0088cc" };
        break;
      case 2:
        color = { backgroundColor: "#00aaff" };
        break;
      case 1:
        color = { backgroundColor: "#66ccff" };
        break;
      default:
        color = { backgroundColor: "#DDD" };
    }

    this.setState({
      dotColor: color
    });

    // Get timeline events so we can see how long it's been since last entry
    getTimelineEvents(id)
  }

  // Instantiate the interactions object
  componentDidUpdate(prevProps, props) {

    if (prevProps !== props) {
      let jobId = this.props.id;

      if (props.data) {
        if (props.data.inactive === true) {
          this.setState({
            heatCondition: false
          })
        }
      }

      if (props.interactions) {
        let allInteractions = props.interactions;
        for (var key in allInteractions) {
          if (key === jobId) {
            this.setState(
              {
                interactions: allInteractions[key],
                flag: true
              },
              () => this.checkInteractionDate(this.state.interactions)
            );
          }
        }
      }
    }   
    
  }

  render() {
    return (
      <div
        className={
          "single-job-entry-wrap " +
          (this.props.job.inactive ? "inactive " : "")
        }
      >
        <div className="job-entry-header" onClick={this.toggleEntry}>
          <span className="confidence-dot" style={this.state.dotColor} />
          {this.state.heatCondition && 
          <FontAwesomeIcon icon={faAngleDoubleUp} className="dbl-up-icon" 
            style={this.state.arrowColor} />}
          <span className="job-position">{this.props.job.position}</span>
          <span className="divider"> / </span>
          <span className="job-company">{this.props.job.company}</span>
          <div className="job-entry-chrono">
            {this.state.fresh === true ? <span className="job-entry-date">
              {this.props.job.dateSanitized}
            </span> :
            <span className="job-entry-date">
                <span className="freshness-msg">
                    No interactions for {this.state.interval} days 
                </span>
                <div className="inactive-btns-wrap">
                    <span className="inactive-btn"
                    onClick={(e) => this.handleNudgeResponse(e, 'inactive')}>
                        Mark as inactive
                    </span>
                    &nbsp;
                    <span className="inactive-btn"
                    onClick={(e) => this.handleNudgeResponse(e, 'fresh')}>
                        Dismiss nudge
                    </span>
                </div>    
            </span>}
          </div>
        </div>
        <SlideDown className="job-app-slidedown">
          {this.state.showFullEntry && (
            <JobEntry
              id={this.props.id}
              userId={this.props.userId}
              job={this.props.job}
              deleteJob={this.props.deleteJob}
              editJob={this.props.editJob}
            />
          )}
        </SlideDown>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  interactions: state.interactionsState.interactions
});

const mapDispatchToProps = dispatch => ({
  getTimelineEvents: id => dispatch(getInteractions(id)),
  editJob: (id, jobId, data) => dispatch(editOneJob(id, jobId, data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobEntryWrapper);
