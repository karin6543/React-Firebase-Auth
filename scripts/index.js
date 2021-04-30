  
// DOM elements
const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');


const setupUI = (user) => {
  if (user) {
    // toggle user UI elements
    const signInEmail = `
      <div>Logged in as: ${user.email}</div>
    `;
    accountDetails.innerHTML = signInEmail
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    // toggle user elements
    accountDetails.innerHTML = ''
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
};
// setup guides
const setupGuides = (data) => {


  if (data.length) {
    const parsedData = []
    data.forEach(d => {
      parsedData.push(d.data())})  
      parsedData.sort(function(a,b){
        return new Date(a.date) - new Date(b.date);
      })
    let html = '';

    parsedData.forEach(doc => {
      const li = `
        <li>
          <div class="collapsible-header grey lighten-4"> ${doc.date} </div>
          <div class="collapsible-body white"> ${doc.qType} </div>
        </li>
      `;
      html += li;
      parsedData['columns'] = Object.keys(doc)
    });
    html+=`<svg class='bar-chart'> Chart Area </svg>`
    let svgWidth = 500, svgHeight = 300, barPadding =5;
    let barWidth = (svgWidth / data.length);
    
    guideList.innerHTML = html
    
   
console.log('extract final', parsedData)
    // set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 50},
width = 800
height = 300

d3.select('#my_dataviz').selectAll('svg').remove()
// append the svg object to the body of the page
svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data

var subgroups = ['qNumFail' ,'qNumPass']

  // List of groups = species here = value of the first column called group -> I show them on the X axis
var groups = d3.map(parsedData, function(d){return(d.date)}).keys()

// Add X axis
var x = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding([0.2])
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).tickSizeOuter(0));

// Add Y axis
var y = d3.scaleLinear()
  .domain([0, 10])
  .range([ height, 0 ]);
 
svg.append("g")
  .call(d3.axisLeft(y));

// color palette = one color per subgroup
var color = d3.scaleOrdinal()
  .domain(subgroups)
  .range(['#DD6168','#50B883'])

//stack the data? --> stack per subgroup
var stackedData = d3.stack()
  .keys(subgroups)
  (parsedData)

svg.append("g")
  .selectAll("g")
  // Enter in the stack data = loop key per key = group per group
  .data(stackedData)
  .enter().append("g")
    .attr("fill", function(d) { return color(d.key); })
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.date); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width",x.bandwidth())

  } else {
    guideList.innerHTML = '<h5 class="center-align">Add your practice data</h5>';
  }
  

};

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});