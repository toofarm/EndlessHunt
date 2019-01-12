import React, { Component } from 'react';
import { connect } from 'react-redux'
import { getJobs, getSomeJobs } from '../../actions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

class SearchForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            searchEntered: false,
            noResults: false,
            searchTerm: ''
        }
        this.setSearchValue = this.setSearchValue.bind(this)
        this.doSearch = this.doSearch.bind(this)
        this.reset = this.reset.bind(this)
        this.searchCheck = this.searchCheck.bind(this)
    }

    setSearchValue (e) {
        let val = e.target.value
        this.setState({
            searchTerm: val
        })
    }

    doSearch (e) {
        const { searchJobs } = this.props
        e.preventDefault()
        let matches = []
        let id = this.props.authUser.uid
        let term = this.state.searchTerm.toLowerCase()
        let jobs = this.props.jobs
        this.setState({
            searchEntered: true
        })
        for (var key in jobs) {
            for (var item in jobs[key]) {
                if ( typeof jobs[key][item] === "string" ) {
                    if (jobs[key][item].toLowerCase().includes(term)) matches.push(key)
                }
            }
        }

        if ( matches.length > 0 ) {
            searchJobs(id, matches)
            this.setState({
                noResults: false
            })
        } else {
            this.setState({
                noResults: true
            })
        }

    }

    reset (e) {
        e.preventDefault()
        const { getUserJobs } = this.props
        let id = this.props.authUser.uid
        getUserJobs(id)
        this.setState({
            searchEntered: false,
            noResults: false,
            searchTerm: ''
        })
    }

    searchCheck () {
        if (this.state.noResults === true) {
            this.setState({
                noResults: false
            })
        }
    }

    render () {
        return (
            <div className="search-wrap">
                <form className="search-form"
                    onChange={this.searchCheck}
                    onSubmit={(e) => this.doSearch(e)}>
                        {!this.state.searchEntered ?
                            <button className="search-btn">
                                <FontAwesomeIcon icon={faSearch} /> 
                            </button> : 
                            <button className="search-btn"
                                onClick={(e) => this.reset(e)}>
                                <FontAwesomeIcon icon={faTimes} /> 
                            </button> }
                    <input type="text" id="jobs-search" name="jobs-search" 
                        placeholder="Search jobs"
                        onChange={(e) => this.setSearchValue(e)} />
                </form>
                {this.state.noResults && <div className="results-msg">
                    Uh-oh! Noting in your job apps matched that search
                </div>}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    jobs: state.jobsState.jobs,
    authUser: state.sessionState.authUser
  });
  
  const mapDispatchToProps = (dispatch) => ({
    getUserJobs: (id) => dispatch(getJobs(id)),
    searchJobs: (id, jobIds) => dispatch(getSomeJobs(id, jobIds))
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
  