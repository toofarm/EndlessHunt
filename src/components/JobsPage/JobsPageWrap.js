import React, { Component } from 'react'

import JobsCntrlPanel from './JobsCntrlPanel'
import JobsCntrlPanelMobile from './JobsCntrlPanelMobile'
import JobsRoll from './JobsRoll'

const INITIAL_STATE = {
  error: null,
  updated: false
}

class JobsPageWrap extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount () {
    document.title = "Jobs | The Endless Hunt"
  }

  render() {
    return (
        <div className="jobs-wrap row">
          <JobsCntrlPanel />
          <JobsCntrlPanelMobile />
          <JobsRoll 
          userId={this.props.userId}
          />
        </div>
    );
  }
}

export default JobsPageWrap;

