import React, {useEffect } from 'react'
import { Link, useHistory } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { auth, db } from "../firebase"
import * as d3 from "d3";

function DonutChart() {
    const { currentUser, logout, userData, userError } = useAuth()
    let data = []
    useEffect(()=>{
      if(userError){
        data = userError
        let donutCounter = {}
        let donutData = []
        d3.select('#my_donut').selectAll('svg').remove()
    
        data.forEach(doc => {
       
          if(Object.keys(donutCounter).indexOf(doc.data().errType)===-1)
          {
            donutCounter[doc.data().errType] = 1
          }
          else{
            donutCounter[doc.data().errType] += 1
          }
    
        });    
    
        Object.keys(donutCounter).forEach((key)=>{
            donutData.push({
              errorType: key,
              value: donutCounter[key],
              color: '#f8b70a'
            })
          })
          console.log('donut data', donutData)
            // set the dimensions and margins of the graph
        const width = 700
        const height = 450
        const margin = 40
        
        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        var radius = Math.min(width, height) / 2 - margin
        
        // append the svg object to the div called 'my_dataviz'
        var svg = d3.select("#my_donut")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        
        // set the color scale
        var color = d3.scaleOrdinal()
        .domain(Object.keys(donutCounter))
        .range(d3.schemeDark2);
        
        // Compute the position of each group on the pie:
        const pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(function(d) {
            console.log('values..',d[1])
            return d[1]; })
        var data_ready = pie(Object.entries(donutCounter))
    
        // The arc generator
        var arc = d3.arc()
        .innerRadius(radius * 0.5)         // This is the size of the donut hole
        .outerRadius(radius * 0.8)
        
        // Another arc that won't be drawn. Just for labels positioning
        var outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)
        
        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
        .selectAll('allSlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d){ 
    
            return(color(d.data[0])) })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
        
        // Add the polylines between chart and labels:
        svg
          .selectAll('allPolylines')
          .data(data_ready)
          .enter()
          .append('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function(d) {
              var posA = arc.centroid(d) // line insertion in the slice
              var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
              var posC = outerArc.centroid(d); // Label position = almost the same as posB
              var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
              posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
              return [posA, posB, posC]
            })
        
        // Add the polylines between chart and labels:
        svg
          .selectAll('allLabels')
          .data(data_ready)
          .enter()
          .append('text')
            .text( function(d) {  return d.data[0] } )
            .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
      }
    },[userError])
    

    return (
        <div id="my_donut">
      
        </div>
    )
}

export default DonutChart
