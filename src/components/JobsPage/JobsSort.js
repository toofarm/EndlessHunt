import React, { Component } from 'react';

import { reorderJobs, toggleUiPanel, getJobs, toggleInactiveState } from '../../actions'

import { connect } from 'react-redux'

const INITIAL_STATE = {
  error: null,
  changesMade: false,
  sortOrder: '',
  radioLabel1: '',
  radioLabel2: '',
  radioVal1: '',
  radioVal2: '',
  showRadioBtns: false
}

class JobsSort extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.closePanel = this.closePanel.bind(this)
    this.reset = this.reset.bind(this)
    this.toggleJobsOrderRadio = this.toggleJobsOrderRadio.bind(this)
  }

  toggleJobParam (val) {
    let radios = document.getElementsByName('sort-order')
    switch (val) {
      case "company":
        this.setState({
          radioLabel1: 'A - Z',
          radioLabel2: 'Z - A',
          radioVal1: 'alpha-company-asc',
          radioVal2: 'alpha-company-desc',
          showRadioBtns: true
        })
        break
      case "position":
        this.setState({
          radioLabel1: 'A - Z',
          radioLabel2: 'Z - A',
          radioVal1: 'alpha-position-asc',
          radioVal2: 'alpha-position-desc',
          showRadioBtns: true
        })
        break
      case "Application date":
        this.setState({
          radioLabel1: 'Most recent first',
          radioLabel2: 'Least recent first',
          radioVal1: 'chrono-desc',
          radioVal2: 'chrono-asc',
          showRadioBtns: true
        })
        break
      case "confidence":
        this.setState({
          radioLabel1: 'Most confident first',
          radioLabel2: 'Least confident first',
          radioVal1: 'confidence-desc',
          radioVal2: 'confidence-asc',
          showRadioBtns: true
        })
        break
      case "salary":
        this.setState({
          radioLabel1: 'Highest to lowest',
          radioLabel2: 'Lowest to highest',
          radioVal1: 'salary-desc',
          radioVal2: 'salary-asc',
          showRadioBtns: true
        })
        break
      default: 
        this.setState({
          showRadioBtns: false
        })
        document.getElementById('select-param').value = "--"
    }
    radios.forEach( (radio) => {
      radio.checked = false
    })
  }

  toggleJobsOrderRadio () {
    const { reorderJobs } = this.props
    
    var orders = document.getElementsByName('sort-order')
    let id = this.props.userId
    let jobs = this.props.jobs

    orders.forEach( (btn, index) => {
      if (btn.checked) {
        reorderJobs(id, btn.value, jobs)
        this.setState({
          sortOrder: btn.value,
          changesMade: true
        })
      }
    })
  }

  inactiveToggle (e) {
    const { changeInactive } = this.props
    let order = e.target.value
    changeInactive(order)
  } 

  reset() {
    const { getUserJobs } = this.props
    let id = this.props.userId
    getUserJobs(id)
    this.toggleJobParam("--")
    this.setState({
      changesMade: false
    })
  }

  closePanel() {
    const { togglePanel } = this.props
    togglePanel('close', null)
  }

  render() {

    return (
      <div className="ui-panel-wrap sort-panel">
        <h3>Sort by...</h3>
        <div className="row">
          <div className="col-md-5 sort-group-left">
            <div className="sort-group-wrap">
              <select id="select-param"
                defaultValue="--"
                name="select-param"
                onChange={(e) => this.toggleJobParam(e.target.value)}>
                <option value="--" disabled>Sort parameter</option>
                <option value="Application date">Application date</option>
                <option value="confidence">Confidence</option>
                <option value="company">Company</option>
                <option value="position">Position</option>
                <option value="salary">Salary</option>
              </select>
            </div>
            {this.state.showRadioBtns && <fieldset className="sort-group-wrap"
              id="radio-holder"
              onChange={(e) => this.toggleJobsOrderRadio(e)}>
              <label htmlFor="radio-1"><input type="radio" name="sort-order" id="radio-1" value={this.state.radioVal1} />{this.state.radioLabel1}</label>
              <label htmlFor="radio-2"><input type="radio" name="sort-order" id="radio-2" value={this.state.radioVal2} />{this.state.radioLabel2}</label>
            </fieldset>}
          </div>
          <div className="sort-group-wrap col-md-5"
              onChange={(e) => this.inactiveToggle(e)}>
              <label className="label-inline" htmlFor="hide-inactive">
                <input type="radio" name="inactive-toggle-state" id="hide-inactive"
                    checked={this.props.inactive === "hideInactive"}
                    value="hideInactive" />
                Hide inactive
              </label>
              <label className="label-inline" htmlFor="inactive-only">
                <input type="radio" name="inactive-toggle-state" id="inactive-only"
                    checked={this.props.inactive === "inactiveOnly"}
                    value="inactiveOnly" />
                Inactive only
              </label>
              <label className="label-inline" htmlFor="show-all">
                <input type="radio" name="inactive-toggle-state" id="show-all"
                      checked={this.props.inactive === "showAll"}
                      value="showAll" />
                Show all
              </label>
          </div>
        </div>
        <div className="btns-wrap">
          {this.state.changesMade && <button className="job-entry-btn reset"
            onClick={this.reset}>Reset
          </button>}
          <button className="job-entry-btn"
            onClick={this.closePanel}
          >Close
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  jobs: state.jobsState.jobs,
  inactive: state.inactiveState.inactiveState
});

const mapDispatchToProps = (dispatch) => ({
  reorderJobs: (id, order, jobs) => dispatch(reorderJobs(id, order, jobs)),
  getUserJobs: (id) => dispatch(getJobs(id)),
  changeInactive: (order) => dispatch(toggleInactiveState(order)),
  togglePanel: (order, data) => dispatch(toggleUiPanel(order, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(JobsSort);

