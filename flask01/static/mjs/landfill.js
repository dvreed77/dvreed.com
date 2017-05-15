// Map stuff
var w2 = 300;
var h2 = 300;

var vis = d3.select("#map")
.append("svg")
.attr("width", w2)
.attr("height", h2);

var projection = d3.geo.satellite()
.scale(1)
.translate([0,0])
.tilt(0);

// Time bars
var width = 300;
var height = 120;

var colors = d3.scale.category10();

var colors= d3.scale.linear()
  .domain([0, 13])
  .range(["#3A7F39", "#22CC1E"]);

var svg = d3.select('#timeline').append('svg')
.attr('width', width+30)
.attr('height', height+50)
.append('g')
.attr('transform', 'translate(15,20)'); 

var t = textures.lines()
.size(4)
.strokeWidth(1)
.stroke("#22CC1E")
.background("#3A7F39");

vis.call(t);

// svg.append("circle")
//   .style("fill", t.url());

queue()
  .defer(d3.json, $DATAFILES[0])
  .defer(d3.json, $DATAFILES[1])
  .await(ready);
var play = true;
d3.select('#playMins').on('click', function() {
  play = !play;
});

function ready(error, data, map) {
  window.map = map;
  var path = d3.geo.path().projection(projection);
  var bounds = path.bounds(map);

  // automatically adjust bounds
  var scale = .95 / Math.max((bounds[1][0] - bounds[0][0]) / w2,
      (bounds[1][1] - bounds[0][1]) / h2);
  var transl = [(w2 - scale * (bounds[1][0] + bounds[0][0])) / 2,
      (h2 - scale * (bounds[1][1] + bounds[0][1])) / 2];
  projection.scale(scale).translate(transl);

  var mapData = d3.nest()
  .key(function(d) { return d.properties.region; })
  .key(function(d) { return d.properties.layer; })
  .entries(map.features);

  data.forEach(function(d, i) {
    if (d.stop == 'now') {
      d.stop = new Date(1940, 0, 1);
    } else {
      d.stop = new Date(+d.stop, 0, 1);
    }
    d.date = new Date(+d.date, 0, 1);
    d.slides = d.slide.split('-').map(function(d){ return +d; }).reverse();

    d.color = colors(i);
    
    var ltmp = mapData.filter(function(d1) { 
      return d1.key == d.text.toLocaleLowerCase().replace(' ', '_')
    })[0].values;

    d.scale = d3.time.scale()
    .domain([d.date, d.stop])
    .range([1, ltmp.length]);

    console.log(d.scale.range())

    d.layers = vis
    .selectAll("g.zone-"+i)
    .data(ltmp)
    .enter()
    .append("g")
    .attr("class", function(d){ 
      return "zone-"+i
    })
    .selectAll("path")
    .data(function(d){ return d.values; })
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", colors(i))
    .style("stroke", "none")
    .on("mouseover", function() {
      // console.log(this)
      d3.select(this)
      .style("fill", t.url())

      d3.select('#text')
      .html(d.text)
    })
    .on("mouseout", function(d) {
      // console.log(this)
      d3.select(this)
      .style("fill", colors(i))
      d3.select('#text')
      .html('')
    });       
  });

  console.log(data)

  // window.layers = layers;

  // var minDate = d3.min(data, function(d) { return d.date; })
  var minDate = new Date(1780,0,1);
  // var maxDate = d3.max(data, function(d) { return d.stop; })
  var maxDate = new Date(1950,0,1);

  var xScale = d3.time.scale()
  .range([0, width])
  .domain([minDate, maxDate]);

  var yScale = d3.scale.ordinal()
  .rangeRoundBands([0, height], .1)
  .domain(d3.range(data.length));

  var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient('bottom')
  .tickSize(3)
  .tickPadding(8);

  svg.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0, ' + (height) + ')')
  .call(xAxis);

  var rects = svg.selectAll('rects').data(data)
  .enter()
  .append('rect')
  .attr({
    'width': function(d,i) { return xScale(d.stop) - xScale(d.date); },
    'height': yScale.rangeBand(),
    'x': function(d,i) { return xScale(d.date); },
    'y': function(d,i) { return yScale(i); },
    'fill': function(d,i) { return d.color; },
  })

  var brush = d3.svg.brush()
  .x(xScale)
  .extent([0, 0])
  .on("brush", brushed)
  // .on("brushend", brushend);

  var slider = svg.append("g")
  .attr("class", "slider")
  .call(brush);

  slider.selectAll(".extent,.resize")
  .remove();

  slider.select(".background")
  .attr("height", height)
  .attr("cursor", "ew-resize");

  var handle = slider.append("line")
  .attr("class", "handle")
  // .attr("transform", "translate(0," + height / 2 + ")")
  .attr({
    // width: 4,
    // height: height,
    y0: 0,
    y1: height,
    stroke: 'brown',
    "stroke-width": 2,
    "stroke-opacity": 0.75,
  });

  var n_ticks = 600,
  dt = (maxDate - minDate)/n_ticks;

  var ix = 0

  // var play = true;
  playTime();
  function playTime() {
    setInterval(function(d) {
      var v = new Date(minDate.getTime() + ((ix++)%n_ticks)*dt);
      if (play) {
        // var v = brush.extent()[0]
        slider
        .call(brush.extent([v, v]))
        .call(brush.event)
      }        
    }, 10)
  }    

  function brushed() {
    if (d3.event.sourceEvent) { // not a programmatic event
      play = false;
      var v = xScale.invert(d3.mouse(this)[0]);
      brush.extent([v, v]);
      data.forEach(function(d) {
        var s = Math.floor(d.scale(v));          
        d.layers.classed("off", function(d1) {
          // console.log(d1)
          if (s>d.scale.range()[1]){
            return false
          } else 
          if (d1.properties.layer==s) {
            return false;
          } else {
            return true;
          }
        })
      })
      handle
      .attr("x1", xScale(v))
      .attr("x2", xScale(v));

      d3.select('#year')
      .html(v.getFullYear())
    } else {
      var v = brush.extent()[0];
      data.forEach(function(d) {
        var s = Math.floor(d.scale(v));          
        d.layers.classed("off", function(d1) {
          // console.log(d1)
          if (s>d.scale.range()[1]){
            return false
          } else 
          if (d1.properties.layer==s) {
            return false;
          } else {
            return true;
          }
        })
      })
      handle
      .attr("x1", xScale(v))
      .attr("x2", xScale(v));

      d3.select('#year')
      .html(v.getFullYear());

      // console.log(v)
    }

    



    // handle.attr("x", xScale(value));
  }
  function brushend() {
    console.log('brushend')
  }

  var basemap = mapData.filter(function(d1) { 
    return d1.key == 'base'
  })[0].values[0].values;

  console.log(basemap)
  

  vis.selectAll("path.basemap")
  .data(basemap)
  .enter()
  .append("path")
  .attr("class", '"basemap')
  .attr("d", path)
  .style("fill", "darkseagreen")
  .style("stroke", "darkgreen");
}
