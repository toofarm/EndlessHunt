import React, { Component } from 'react';
import * as d3 from 'd3'

import { one_day } from '../../constants/utilities'

const maxMobileWidth = 1025
const margin = {top: 20, right: 20, bottom: 30, left: 40}
const startingWidth = window.innerWidth >= maxMobileWidth ?
                        960 - margin.left - margin.right : 210
const startingHeight = window.innerWidth >= maxMobileWidth ?
                        500 - margin.top - margin.bottom : 250 

const width = startingWidth 
const height = startingHeight
const xLabelHeight = window.innerWidth >= maxMobileWidth ?
                        445 : 240

// Set up X axis
var xValue = function(d) { return d.confidence},
    xScale = d3.scaleLinear().range([0, width]),
    xMap = function(d) { return xScale(xValue(d))},
    xAxis = d3.axisBottom(xScale)

// Set up Y axis
var yValue = function(d) { return d.days}, 
    yScale = d3.scaleLinear().range([height, 0]), 
    yMap = function(d) { return yScale(yValue(d));},
    yAxis = d3.axisLeft(yScale)

// Find fill color
var mapColor = function (d) { return cValue[d.confidence] }

var cValue = {
    1 : '#66ccff',
    2 : '#00aaff',
    3 : '#0088cc',
    4 : '#006699',
    5 : '#ff3333',
    6 : "#ff0000",
    7 : '#cc0000'
}

class ConfidenceScatterPlot extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            flag: true
        }
    
        this.makeScatterPlot = this.makeScatterPlot.bind(this)
      }
    
      makeScatterPlot (data) {
    
        // add the graph canvas to the body of the webpage
        var svg = d3.select("#confidence-scatter").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        // add the tooltip area to the webpage
        var tooltip = d3.select(".scatter-plot-shell").append("div")
            .attr("class", "tooltip-sp")
            .style("opacity", 0);
    
        // change string into number format
        data.forEach(function(d) {
            d.confidence = +d.confidence
            d.days = +d.days
        })
    
        // don't want dots overlapping axis, so add in buffer to data domain
        xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1])
        yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1])
    
        // x-axis
        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
        
        // x-axis label        
        svg.append("text")
                .attr("class", "label-sp")
                .attr("x", width)
                .attr("y", xLabelHeight)
                .style("text-anchor", "end")
                .text("Confidence");
    
        // y-axis
        svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
    
        // y-axis label        
        svg.append("text")
                .attr("class", "label-sp")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Days until first response");
    
        // draw dots
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 7)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", mapColor) 
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.position + "<br/> <span class='sp-tp-label'>(Confidence: " + xValue(d) 
                + ", Days: " + yValue(d) + ")</span>")
                    .style("left", (d3.event.pageX + 20) + "px")
                    .style("top", (d3.event.pageY - 955) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
      }
    
      componentDidUpdate (props) {
        if (Object.keys(props.jobs).length > 1 && 
            Object.keys(props.interactions).length > 1 && 
            this.state.flag) {
            var ourJobs = {}
            var finalJobs = []
            for (var key in props.jobs) {
                let newJob = {}
                newJob["position"] = props.jobs[key].position
                newJob["confidence"] = Number(props.jobs[key].confidence)
                newJob["days"] = 0
                ourJobs[key] = newJob
            }
            for (var key2 in props.interactions) {
                let timesHolder = []    
                for (var key3 in props.interactions[key2]) {
                    timesHolder.push(key3)
                }
                timesHolder.sort()
                if (timesHolder.length > 1) {
                    let interval = timesHolder[1] - timesHolder[0]
                    interval = Math.round(interval/one_day)
                    if (ourJobs.hasOwnProperty(key2)) ourJobs[key2]['days'] = interval
                } else {
                    delete ourJobs[key2]
                }
            }
            for (var key4 in ourJobs) {
                finalJobs.push(ourJobs[key4])
            }
            this.makeScatterPlot(finalJobs)
            this.setState({
                flag: false
            })
        }
      }
    
    render() {
        return (
            <div className="stats-visual-wrap scatter-plot-shell col-lg-12">
                <h4>Confidence v. Time to First Response</h4>
                <div id="confidence-scatter">
                </div>
            </div>
        )
    }
}

export default ConfidenceScatterPlot