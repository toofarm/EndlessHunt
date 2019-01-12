import React, { Component } from 'react';
import SearchForm from './SearchForm'

import { deleteAllJobs, toggleUiPanel } from '../../actions'

import { connect } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'

import { SlideDown } from 'react-slidedown'
import "../../../node_modules/react-slidedown/lib/slidedown.css"

const INITIAL_STATE = {
  showCntrlPanel: false
}

class JobsCntrlPanelMobile extends Component {
  constructor(props) {
    super(props)

    this.state = { ...INITIAL_STATE };
    this.togglePanels = this.togglePanels.bind(this)
    this.toggleCntrlsPanel = this.toggleCntrlsPanel.bind(this)
    this.clearJobs = this.clearJobs.bind(this)
  }

  toggleCntrlsPanel () {
    let order
    if (this.state.showCntrlPanel) {
      order = false
    } else {
      order = true
    }
    this.setState({
      showCntrlPanel: order
    })
  }

  togglePanels (order) {
    const { toggle } = this.props

    switch (order) {
      case "add": 
        toggle('addNew', null)
        break
      case "sort":
        toggle('sort', null)
        break
      case "wishlist": 
        toggle('wishlist', null)
        break
      case "close":
        toggle('close', null)
        break
      default:
        toggle('close', null)
    }
    // Scroll to top of page after click button
    document.body.scrollTop = 0 // For Safari
    document.documentElement.scrollTop = 0
  }

  clearJobs () {
    const { clearJobs } = this.props
    let userId = this.props.authUser.uid

    const message = `Heads up! This will clear all of your job applications and start you over from scratch. 
    
Sure you want to do it?`

    if (window.confirm(message)) {
      clearJobs(userId)
    }
    this.toggleCntrlsPanel()
  }

  render() {
    return (
      <div className="cntrl-mobile-bar">
        <div className="cntrls-initiator">
          <FontAwesomeIcon icon={faChevronUp}
          className={'cntrls-chev ' + 
                    (this.state.showCntrlPanel ? 'flip ' : '')}
          onClick={this.toggleCntrlsPanel} /> 
        </div>
        <SlideDown className="job-app-slidedown">
          {this.state.showCntrlPanel && <div className="cntrl-mobile col-md-12">
              <div className="cntrls-wrap-mobile">
                  <SearchForm />
                  <ul>
                    <li className="add-new-job"
                        onClick={() => this.togglePanels("add")}>
                        Add
                    </li>
                    <li onClick={() => this.togglePanels("sort")} >
                        Sort
                    </li>
                    <li onClick={() => this.togglePanels("wishlist")} >
                        Wishlist
                    </li>
                    <li onClick={this.clearJobs}
                        className="delete-all">
                        Delete
                    </li>
                  </ul>
              </div>
          </div>}
        </SlideDown>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  order: state.controlState.order,
  authUser: state.sessionState.authUser
});

const mapDispatchToProps = (dispatch) => ({
  clearJobs: (userId) => dispatch(deleteAllJobs(userId)),
  toggle: (order, data) => dispatch(toggleUiPanel(order, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(JobsCntrlPanelMobile);

