import React, { Component } from "react";
import { getJobs, deleteOneJob } from "../../actions";

import JobEntryWrapper from "./JobEntryWrapper";
import JobAddNew from "./JobAddNew";
import JobsSort from "./JobsSort";
import EditModal from "./EditModal";
import InteractionEditModal from "./Timeline/InteractionEditModal";
import WishlistPanel from "./Wishlist/WishlistPanel";
import spinner from "../../static/img/spin-loader.png";

import { connect } from "react-redux";
import { SlideDown } from "react-slidedown";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

import "../../../node_modules/react-slidedown/lib/slidedown.css";

const INITIAL_STATE = {
  error: null,
  title: "",
  company: "",
  jobs: null,
  userId: "",
  updated: false,
  loading: true
};

class JobsRoll extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.deleteJob = this.deleteJob.bind(this);
  }

  deleteJob(e) {
    const { sendDelete } = this.props;

    let jobId = e.target.dataset.id;
    let userId = this.state.userId;

    if (window.confirm("Sure you want to delete this applictation?")) {
      sendDelete(userId, jobId);
    }
  }

  componentDidMount() {
    const { getUserJobs } = this.props;
    let id = this.props.authUser.uid;
    this.setState({
      userId: id
    })
    getUserJobs(id)
    if (
      this.props.jobs === null ||
      this.props.jobs
    ) {
      this.setState({
        loading: false
      })
    }
  }

  componentWillReceiveProps(props) {
    if (props.jobs) {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    return (
      <div className="jobs-roll col-lg-9">
        <EditModal />
        <InteractionEditModal />
        <SlideDown className="job-app-slidedown">
          {this.props.order === "addNew" ? (
            <JobAddNew />
          ) : this.props.order === "sort" ? (
            <JobsSort userId={this.state.userId} />
          ) : this.props.order === "wishlist" ? (
            <WishlistPanel userId={this.state.userId} />
          ) : (
            ""
          )}
        </SlideDown>
        {this.state.loading ? (
          <div className="loader">
            <img src={spinner} alt="Loading..." className="spin-loader" />
          </div>
        ) : (
          <div
            className={
              "jobs-flow " +
              (this.props.inactive === "hideInactive"
                ? "hide-inactive"
                : this.props.inactive === "inactiveOnly"
                ? "inactive-only"
                : "")
            }
          >
            {!!this.props.jobs ? (
              Object.keys(this.props.jobs).map(key => (
                <JobEntryWrapper
                  key={key}
                  id={key}
                  userId={this.state.userId}
                  job={this.props.jobs[key]}
                  deleteJob={this.deleteJob}
                />
              ))
            ) : (
              <div className="welcome-msg">
                Add some applications to get started!
                <FontAwesomeIcon icon={faThumbsUp} className="welcome-icon" />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  jobs: state.jobsState.jobs,
  authUser: state.sessionState.authUser,
  order: state.controlState.order,
  inactive: state.inactiveState.inactiveState
});

const mapDispatchToProps = dispatch => ({
  getUserJobs: id => dispatch(getJobs(id)),
  sendDelete: (userId, jobId) => dispatch(deleteOneJob(userId, jobId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobsRoll);
