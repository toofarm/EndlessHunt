import React, { Component } from 'react';
import * as d3 from 'd3'

const maxMobileWidth = 767

//DIMENSIONS
const width = window.innerWidth > maxMobileWidth ? 385 : 260
const height = window.innerWidth > maxMobileWidth ? 385 : 280
const radius = Math.min(width, height) / 2
const donutWidth = 75
const legendRectSize = 18;
const legendSpacing = 4;

class ConfidencePie extends Component {
    constructor(props) {
        super(props)

        this.state = { 
            data: [],
            flag: true
        }
        
        this.makePie = this.makePie.bind(this)
    }

    makePie (data) {
        var color = d3.scaleOrdinal()
        .range(['#66ccff', '#00aaff',  '#0088cc', '#006699', '#ff3333', "#ff0000", '#cc0000', '#DDD',]);

        var svg = d3.select('#pie-chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')')
        
        const arc = d3.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius)
        
        const pie = d3.pie()
        .value(function(d) { return d.count; })
        .sort(null)
        
        var path = svg.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) {
            return color(d.data.label);
        })                               

        //ADD LEGEND
        var legend = svg.selectAll('.legend')
            .data(color.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset =  height * color.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            })

        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', color)
            .style('stroke', color)

        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) { return d; });

        //ADD TOOLTIPS
        var tooltip = d3.select('.pie-chart-shell')   
            .append('div')                                                
            .attr('class', 'tooltip');                                    
            tooltip.append('div')                                           
            .attr('class', 'label');                                      
            tooltip.append('div')                                           
            .attr('class', 'count');                                      
            tooltip.append('div')                                           
            .attr('class', 'percent');   


        path.on('mouseover', function(d) {                   
            var total = d3.sum(data.map(function(d) {                
                return d.count;                                           
            }))                                                       
            var percent = Math.round(1000 * d.data.count / total) / 10;  
            tooltip.select('.label').html(d.data.label);                
            tooltip.select('.count').html(d.data.count);                
            tooltip.select('.percent').html(percent + '%');             
            tooltip.style('display', 'block');                          
        })

        path.on('mouseout', function() {                              
            tooltip.style('display', 'none');                           
        })

        path.on('mousemove', function(d) {                       
            tooltip.style('top', (d3.event.layerY + 10) + 'px')         
            .style('left', (d3.event.layerX + 10) + 'px');            
        })
    }

    findConfidenceLabel (confidence) {
        let slogan
        switch (Number(confidence)) {
            case 7:
                slogan = "Great!"
                break
            case 6:
                slogan = "Pretty confident"
                break
            case 5:
                slogan = "Okay"
                break
            case 4:
                slogan = "Meh"
                break
            case 3:
                slogan = "Shakey"
                break
            case 2:
                slogan = "It's a long shot"
                break
            case 1:
                slogan = "It's a Hail Mary"
                break
            default:
                slogan = "No confidence score yet"
        }
        return slogan
    }

    componentDidUpdate (newProps) {
        if (Object.keys(newProps.jobs).length > 0 && this.state.flag) {
            let jobs = newProps.jobs
            let obj = {}
            let holder = []
            for (var key in jobs) {
                if (obj.hasOwnProperty(jobs[key].confidence)) {
                    obj[jobs[key].confidence].count += 1
                }  else {
                    obj[jobs[key].confidence] = {
                        count: 1,
                        label: this.findConfidenceLabel(jobs[key].confidence)
                    }
                }         
            }
            for (var key2 in obj) {
                holder.push(obj[key2])
            }
            if (holder !== this.state.data) {
                this.setState({
                    data: holder,
                    flag: false
                }, () => {this.makePie(this.state.data)})
                 
            }
        }
    }

    render() {
        return (
            <div className="stats-visual-wrap pie-chart-shell col-lg-5">
                <h4>Applications by confidence</h4>
                <div id="pie-chart">
                </div>
            </div>
        )
    }
}

export default ConfidencePie