import React, { Component } from 'react';
import * as d3 from 'd3'
import { formatSalary } from '../../constants/utilities'

class SalaryBar extends Component {
    constructor(props) {
        super(props)

        this.state = { 
            data: [],
            flag: true
        }
    }

    findPercentage (max, num) {
        return num * 100 / max
    }

    componentDidUpdate (props) {
        if (Object.keys(props.jobs).length > 0 && this.state.flag) {
            let data = []
            for (var key in props.jobs) {
                let obj = {}
                if (props.jobs[key].salary !== undefined &&
                    props.jobs[key].salary !== "--" &&
                    props.jobs[key].salary > 0 ) {
                    obj['position'] = props.jobs[key].position
                    obj['salary'] = Number(props.jobs[key].salary.replace(',',''))
                    data.push(obj)
                }
            }
            if (data.length > 0) {
                data.sort( (a,b) => b.salary - a.salary)
                let maximum = data[0].salary
                d3.select("#bar-chart")
                .selectAll("div")
                .data(data)
                    .enter()
                    .append("div")
                    .style("width", (d) => this.findPercentage(maximum, d.salary) + "%")
                    .text( (d) => "$ " + formatSalary(d.salary) + " - " + d.position)  

                this.setState({
                    flag: false
                })
            }
        }
      }

    render() {
        return (
            <div className="stats-visual-wrap col-lg-6">
                <h4>Applications by salary</h4>
                <div id="bar-chart">
                </div>
            </div>
        )
    }
}

export default SalaryBar