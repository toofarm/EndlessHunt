import React, { Component } from 'react';

class JobsCount extends Component {
    constructor(props) {
        super(props)

        this.state = { 
            count: '',
            days: 0,
            ratio: '',
            flag: true
        }
    }

    componentDidUpdate (props) {
        if (Object.keys(props.jobs).length > 0 && this.state.flag) {
            let numJobs = Object.keys(props.jobs).length
            let numInactive = 0
            let dates = []
            for (var key in props.jobs) {
                dates.push(props.jobs[key].dateNumeric)
                if (props.jobs[key].inactive === true) numInactive++
            }
            dates.sort()
            let current = new Date()
            let currentUtc = Date.parse(current)
            let timeSpan = currentUtc - dates[0]
            let one_day = 1000*60*60*24
            timeSpan = Math.round(timeSpan/one_day)
            let ratio = '' + numInactive + ' / ' + numJobs + ''
            this.setState({
                count: numJobs,
                days: timeSpan,
                flag: false,
                ratio
            })
        }
    }

    render() {
        return (
            <div className="stats-visual-wrap top-item-wrap col-md-12">
                <h3>
                    You've applied to <span className="count">{this.state.count}</span> job{this.state.count > 1 ?
                        's' :
                        ''} in <span className="count">{this.state.days}</span> day{this.state.days > 1 ?
                            's' :
                            ''}.
                </h3>
                <div className="inactive-ratio">
                    Inactive v. active ratio: <span className="ratio-text">{this.state.ratio}</span>
                </div>
            </div>
        )
    }
}

export default JobsCount;