import React, { Component } from 'react';

import { setUserJobs, reorderJobs, toggleUiPanel, updateInactiveState, updateSortState, getJobs, getSortState, getInactiveState } from '../../actions'

import { controlPanelDatalayerPush } from '../../constants/utilities'

import { connect } from 'react-redux'

const INITIAL_STATE = {
  error: null,
  changesMade: false,
  sortOrder: '',
  radioLabel1: '',
  radioLabel2: '',
  radioVal1: '',
  radioVal2: '',
  showRadioBtns: false,
  inactiveState: null
}

class JobsSort extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    this.closePanel = this.closePanel.bind(this)
    this.reset = this.reset.bind(this)
    this.toggleJobsOrderRadio = this.toggleJobsOrderRadio.bind(this)
    this.checkForChanges = this.checkForChanges.bind(this)
  }

  // Handle changes to sort order
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
    const { updateSortState } = this.props
    
    let id = this.props.userId
    var orders = document.getElementsByName('sort-order')
    var sortParameter = document.getElementById('select-param').value

    orders.forEach( (btn, index) => {
      if (btn.checked) {
        updateSortState(id, btn.value)
        this.setState({
          sortOrder: btn.value,
          changesMade: true
        }, () => {
          controlPanelDatalayerPush(
            'Sort Jobs',
            'Toggle Jobs Order',
           `${sortParameter} / ${this.state.sortOrder}`
          )
        })
      }
    })
  }

  inactiveToggle (e) {
    const { changeInactive } = this.props
    let order = e
    let id = this.props.userId
    changeInactive(id, order)
    this.setState({
      changesMade: true
    })
    controlPanelDatalayerPush(
      'Sort Jobs',
      'Toggle Inaction',
      order
    )
  } 

  reset() {
    const { getJobs, updateSortState, updateInactiveState } = this.props
    let id = this.props.userId
    updateInactiveState(id, "showAll")
    updateSortState(id, null)
    getJobs(id)
    this.toggleJobParam("--")
    controlPanelDatalayerPush(
      'Sort Jobs',
      'Reset Sort Order',
      null
    )
    this.setState({
      changesMade: false
    })
  }

  closePanel() {
    const { togglePanel } = this.props
    togglePanel('close', null)
    controlPanelDatalayerPush(
      'Sort Jobs',
      'Close Panel',
      null
    )
  }

  checkForChanges () {
    if (this.props.sort ||
      this.props.inactive !== 'showAll') {
      this.setState({
        changesMade: true
      })
    } else {
      this.setState({
        changesMade: false
      })
    }
  }

  // If the sort order updates, call the jobs again to get the new order
  componentDidUpdate (prevProps, props) {
    if (prevProps !== props) {
      if (prevProps.sort !== this.props.sort) {
        const { setUserJobs } = this.props
        setUserJobs(this.props.jobs, this.props.sort)
      }
      if (prevProps.sort !== this.props.sort ||
          prevProps.inactive !== this.props.inactive) {
        this.checkForChanges()
      }
    }
  }

  componentDidMount () {
    const { getSortState, getInactiveState } = this.props
    let id = this.props.userId
    getSortState(id)
    getInactiveState(id)
    if (this.props.sort ||
      this.props.inactive !== 'showAll') {
      this.setState({
        changesMade: true
      })
    }
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
              onChange={(e) => this.inactiveToggle(e.target.value)}>
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
  inactive: state.inactiveState.inactiveState,
  sort: state.sortState.sortOrder
});

const mapDispatchToProps = (dispatch) => ({
  reorderJobs: (id, order, jobs) => dispatch(reorderJobs(id, order, jobs)),
  setUserJobs: (jobs, sort) => dispatch(setUserJobs(jobs, sort)),
  changeInactive: (id, order) => dispatch(updateInactiveState(id, order)),
  togglePanel: (order, data) => dispatch(toggleUiPanel(order, data)),
  updateSortState: (id, data) => dispatch(updateSortState(id, data)),
  getJobs: (id) => dispatch(getJobs(id)),
  getSortState: (id) => dispatch(getSortState(id)),
  getInactiveState: (id) => dispatch(getInactiveState(id)),
  updateInactiveState: (id, order) => dispatch(updateInactiveState(id, order))
});

export default connect(mapStateToProps, mapDispatchToProps)(JobsSort);

