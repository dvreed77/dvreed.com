


var margin = {top: 10, bottom:10, left: 10, right: 10},
width = 300,
height = 300;

// axis scales
var x = d3.scale.linear()
.range([0, width])
.domain([0, 1]);

var y = d3.scale.linear()
.range([height, 0])
.domain([0, 1]);

var svg = d3.select("#draw")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom);

var click_txt = svg.append("text")
.style("text-anchor", "middle")
.attr("x", 150)
.attr("y", 150)
.text("Click Me!")
.attr("fill", "#ddd")
.style("font-size", "40px");

var draw = svg.append("g")
.attr("transform", "translate{" + margin.left + "," + margin.top + ")");

var mean_pt = draw.append("circle")
.attr("class", "mean")
.style({'fill': 'red'});

var ellipse = draw.append("ellipse")
.style({'fill': 'orange', 'stroke': 'orange', 'fill-opacity': 0.3});

var g = svg.append("g")
.attr("transform", "translate{" + margin.left + "," + margin.top + ")");

var overlay = g.append("rect")
.attr("class", "overlay")
.style({'fill-opacity': 0.1})
.attr("width", width)
.attr("height", height)
.on("click", function(d) {
  data.push({
    t: new Date(),
    x: x.invert(d3.mouse(this)[0]), 
    y: y.invert(d3.mouse(this)[1])
  });
  update();
});

var data = [];  

function update() {
  click_txt
  .attr("display", "none");
  
  var pts = draw.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .style({'fill': 'black'})
  .attr("cx", function(d) { return x(d.x); })
  .attr("cy", function(d) { return y(d.y); })
  .attr("r", 3);

  var mean = {
    x: d3.mean(data, function(d) { return d.x; }),
    y: d3.mean(data, function(d) { return d.y; })
  };

  ellipse
  .attr("cx", function(d) { return x(mean.x); })
  .attr("cy", function(d) { return y(mean.y); });    

  $.getJSON($SCRIPT_ROOT + '/getdata', {
        x: data.map(function(d){ return d.x; }),
        y: data.map(function(d){ return d.y; })
      }, function(data) {
        ellipse                
        .attr("rx", x(data.result.width/2))
        .attr("ry", x(data.result.height/2))
        .attr("transform", "rotate(-" + data.result.theta + ", " + x(mean.x) + ", " + y(mean.y) + ")");
      });

  mean_pt
  .attr("cx", function(d) { return x(mean.x); })
  .attr("cy", function(d) { return y(mean.y); })
  .attr("r", 3);

  var blob = new Blob([JSON.stringify(data)], {type: "application/json"});
  d3.select("#get_data a")
  .attr("href", URL.createObjectURL(blob));
}
