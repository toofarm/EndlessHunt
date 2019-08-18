import React, { Component } from 'react';
import { connect } from 'react-redux'
import { getJobs, getSomeJobs } from '../../actions'
import { onceGetUserJobs } from '../../firebase/db/users'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

class SearchForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            searchEntered: false,
            noResults: false,
            searchTerm: '',
            inactiveNudge: false
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
        let dataLayer = window.dataLayer || []
        let matches = []
        let id = this.props.authUser.uid
        let term = this.state.searchTerm.toLowerCase()
        let jobs 
        onceGetUserJobs(id).then(snapshot => {
            jobs = snapshot.val()
            for (var key in jobs) {
                for (var item in jobs[key]) {
                    if ( typeof jobs[key][item] === "string" ) {
                        console.log(jobs[key][item].toLowerCase().includes(term))
                        if (jobs[key][item].toLowerCase().includes(term)) matches.push(key)
                    }
                }
            }

            if ( matches.length ) {
                searchJobs(id, matches)
                this.setState({
                    noResults: false
                })
                if (this.props.inactive !== 'showAll') {
                    this.setState({
                        inactiveNudge: true
                    })   
                }
            } else {
                this.setState({
                    inactiveNudge: false,
                    noResults: true
                })
            }

            //Count the number of matches, which we push to the datalayer
            var matchCount = {};
            for (var i = 0; i < matches.length; i++) {
                matchCount[matches[i]] = 1 + (matchCount[matches[i]] || 0);
            }
            dataLayer.push({
                'event': 'Search',
                'searchTerm': term,
                'matches': Object.keys(matchCount).length
            })
        }).catch(err => {
            console.log(err)
        })
        this.setState({
            searchEntered: true
        })
    }

    reset (e) {
        e.preventDefault()
        const { getUserJobs } = this.props
        let id = this.props.authUser.uid
        getUserJobs(id)
        this.setState({
            searchEntered: false,
            noResults: false,
            searchTerm: '',
            inactiveNudge: false
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
                            <div className="search-btn">
                                <FontAwesomeIcon icon={faSearch} /> 
                            </div> : 
                            <div className="search-btn"
                                onClick={(e) => this.reset(e)}>
                                <FontAwesomeIcon icon={faTimes} /> 
                            </div> }
                    <input type="text" id="jobs-search" name="jobs-search" 
                        placeholder="Search jobs"
                        onChange={(e) => this.setSearchValue(e)} value={this.state.searchTerm} />
                </form>
                {this.state.noResults && <div className="results-msg">
                    Nothing in your job applications matched that search
                </div>}
                {this.state.inactiveNudge && <div className="results-msg">
                    Some results maybe be hidden because of the active sorting preferences
                </div>}            
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    jobs: state.jobsState.jobs,
    authUser: state.sessionState.authUser,
    inactive: state.inactiveState.inactiveState
  });
  
  const mapDispatchToProps = (dispatch) => ({
    getUserJobs: (id) => dispatch(getJobs(id)),
    searchJobs: (id, jobIds) => dispatch(getSomeJobs(id, jobIds))
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
  