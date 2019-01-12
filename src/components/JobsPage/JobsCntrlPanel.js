import React, { Component } from 'react';
import SearchForm from './SearchForm'

import { deleteAllJobs, toggleUiPanel } from '../../actions'

import { connect } from 'react-redux'

const INITIAL_STATE = {
  showAddNew: false
}

class JobsCntrlPanel extends Component {
  constructor(props) {
    super(props)

    this.navPanel = React.createRef()

    this.state = { ...INITIAL_STATE };
    this.togglePanels = this.togglePanels.bind(this)
    this.clearJobs = this.clearJobs.bind(this)
    this.checkHeight = this.checkHeight.bind(this)
  }

  togglePanels (order) {
    const { toggleUiPanel } = this.props
    switch (order) {
      case "add": 
        toggleUiPanel('addNew', null)
        break
      case "sort":
        toggleUiPanel('sort', null)
        break
      case "wishlist": 
        toggleUiPanel('wishlist', null)
        break
      case "close":
        toggleUiPanel('close', null)
        break
      default:
        toggleUiPanel('close', null)
    }
  }

  clearJobs () {
    const { clearJobs } = this.props
    let userId = this.props.authUser.uid 

    const message = `Heads up! This will clear all of your job applications and start you over from scratch. 
    
Sure you want to do it?`

    if (window.confirm(message)) {
      clearJobs(userId)
    }
  }

  checkHeight (ref) {
    if (ref.current !== null) {
      let sticky = ref.current.offsetTop
      if (window.pageYOffset >= sticky) {
          ref.current.classList.add("sticky")
      } else {
        ref.current.classList.remove("sticky");
      }
    }
  }

  componentDidMount () {
    let navPanel = this.navPanel
    window.addEventListener('scroll', () => this.checkHeight(navPanel))

  }

  componentWillUnmount () {
    window.removeEventListener('scroll', () => this.checkHeight(null))
  }

  render() {
    return (
        <div className="jobs-cntrl-panel col-md-3">
            <div className="cntrls-wrap" ref={this.navPanel}>
                <SearchForm />
                <h3 className="add-new-job"
                    onClick={() => this.togglePanels("add")}>
                    Add job
                </h3>
                <h3 onClick={() => this.togglePanels("sort")} >
                    Sort jobs
                </h3>
                <h3 onClick={() => this.togglePanels("wishlist")} >
                    Wishlist
                </h3>
                <h3 onClick={this.clearJobs}
                    className="delete-all">Delete jobs
                </h3>
            </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  order: state.controlState.order,
  authUser: state.sessionState.authUser
});

const mapDispatchToProps = (dispatch) => ({
  toggleUiPanel: (order, data) => dispatch(toggleUiPanel(order, data)),
  clearJobs: (userId) => dispatch(deleteAllJobs(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(JobsCntrlPanel);

