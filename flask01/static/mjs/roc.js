var margin = {top: 20, right: 20, bottom: 50, left: 50},
  width = 300 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

var format = d3.format("0.2f");

var x = d3.scale.linear()
  .range([0, width])
  .domain([0, 1]);

var y = d3.scale.linear()
  .range([height, 0])
  .domain([0, 1]);

var xAxis = d3.svg.axis()
  .scale(x)
  .ticks(5)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .ticks(5)
  .orient("left");

var area = d3.svg.area()
  .x(function(d) { return x(d.x); })
  .y0(height)
  .y1(function(d) { return y(d.y); });

var svg = d3.select("#draw")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("TPR");

var darea = svg.append("path")
.attr("class", "area");

d3.csv($DATAFILES[0], function(d, i) {
  d.score = +d.score;
  d.class = +d.class;
  d.index = i;
  return d;
}, function(error, data) {
  window.data = data;
  update();
});

function update() {
  R = roc(window.data);

  var table = d3.select('#chart table')
  .selectAll("tr.data")
  .data(data)

  var rows = table
  .enter()
  .append("tr")
  .classed("data", true)    
  .on("mouseover", function(d) {
    circs.filter(function(f) { return f.index == d.index; }).attr("r", 5);  
    d3.select(this).classed("select", true)
    .classed("class1", function(d) {return d.class == 1; });
  })
  .on("mouseout", function(d) {
    circs.filter(function(f) { return f.index == d.index; }).attr("r", 3);  
    d3.select(this).classed("select", false)
    .classed("class1", function(d) {return d.class == 1; });
  })
  .on("click", function(d) { d.class = +!d.class; update(); });

  table
  .classed("class1", function(d) { return d.class == 1; })
  .html(function(d){ return "<td>"+(d.class)+"</td><td>"+format(d.score)+"</td>";})

  svg.select("path.area")
  .datum(R)
  .attr("d", area);

  var circs = svg.selectAll("circle")
  .data(R)

  circs
  .enter()
  .append("circle")  
  .attr("class", "pt")
  .attr("r", 3)
  .on("mouseover", function(d){
    d3.select(table[0][d.index]).classed("select", true);
    d3.select(this).attr("r", 5)
  })
  .on("mouseout", function(d){
    d3.select(table[0][d.index]).classed("select", false);
    d3.select(this).attr("r", 3)
  });

  circs
  .attr("cx", function(d) { return x(d.x); })
  .attr("cy", function(d) { return y(d.y); })
  
}

function roc(data) {

  var num_pts = data.length,
  f_prev = -10,
  FP = 0,
  TP = 0,
  N = data.filter(function(a){return a.class == 0;}).length
  P = num_pts - N,
  i = 0,
  R = [];

  // Sort data by score, ascending
  data.sort(function(a,b){ return b.score-a.score; });

  while (i < num_pts) {
  	if (data[i].score != f_prev) {
      var tmp = {};
      tmp.x = FP/N;
      tmp.y = TP/P;
      if (i > 0) {
        tmp.index = data[i-1].index;
      }
      R.push(tmp)
  		f_prev = data[i].score;
  	}

  	if (data[i].class == 1) {
  		TP = TP + 1;
  	}
  	else {
  		FP = FP + 1
  	}

  	i++;
  }

  R.push({"x": FP/N, "y": TP/P, "index": data[i-1].index})

  return R;	
}

function edge1(){
  window.data.forEach(function(d){
    d.class = d.score >= 0.5 ? 1 : 0;
    update();
  })
}

function edge2(){
  window.data.forEach(function(d){
    d.class = d.score < 0.5 ? 1 : 0;
    update();
  })
}

function edge3(){
  window.data.forEach(function(d,i){
    d.class = +!(i%2);
    update();
  })
}

(function(){
  data = []
  d3.range(8).map(function(ii){
    data.push({x:-ii+1, class:1})
    data.push({x:ii-1.5, class:0})
  });

  var d2 = data.sort(function(a, b) { return a.x - b.x; });
  window.d2 = d2;

  var tp = 0, fp = 0;
  var d4 = [{x:0, y:0}]
  d2.map(function(d){
    if (d.class) {
      tp += 1;
    } else {
      fp += 1;
    }

    d4.push({x:fp, y:tp})
  });

  var format = d3.format("0.2f");

  var m = {top: 10, right: 20, bottom: 20, left: 50}
  var w = 200, h = 200

  var x2 = d3.scale.linear()
    .range([0, w])
    .domain([0, 8]);

  var y2 = d3.scale.linear()
    .range([h, 0])
    .domain([0, 8]);

  var xAxis = d3.svg.axis()
    .scale(x2)
    .ticks(5)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y2)
    .ticks(5)
    .orient("left");

  var area = d3.svg.area()
    .x(function(d) { return x2(d.x); })
    .y0(h)
    .y1(function(d) { return y2(d.y); });

  var svg2 = d3.select("#roc2")
    .append("svg")
    .attr("width", w + m.left + m.right)
    .attr("height", h + m.top + m.bottom)
    .append("g")
    .attr("transform", "translate(" + m.left + "," + m.top + ")");

  svg2.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis);

  svg2.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("TPR");

  var darea = svg2.append("path")
  .attr("class", "area")
  .attr("d", area(d4))

  var ovcirc = svg2.append("circle")
  .attr("class", "pt");  
  // .attr("fill", "black");

  var margin = {top: 0, right: 5, bottom: 0, left: 5},
    width = 300 - margin.left - margin.right,
    height = 20 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width])
      // .domain(d3.extent(data, function(d){ return d.x; }))
      .domain([-6.5, 6])

  var y = d3.scale.linear()
      .range([height, 0])
      .domain([0, 1]);


  var svg = d3.select("#linegraph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      

  var line = svg.append("line")
  .attr("stroke", "red");

  var left = svg.append("rect")
  .attr("fill", "rgb(73, 129, 199)")
  // .attr("stroke", "rgb(73, 129, 199)")
  .attr("fill-opacity", 0.3)
  .attr("width", width)
  .attr("height", height);

  var right = svg.append("rect")
  .attr("fill", "rgb(73, 129, 199)")
  // .attr("stroke", "rgb(73, 129, 199)")
  .attr("fill-opacity", 0.1)
  .attr("height", height);

  var circs = svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", function(d){ return x(d.x); })
  .attr("cy", function(d){ return y(0.5); })
  .attr("r", 3)
  .attr("fill", function(d) { return d.class ? "rgb(73, 129, 199)" : "white"; })
  .attr("stroke", function(d) { return d.class ? "rgb(255, 255, 255)" : "rgb(73, 129, 199)"; })
  .attr("stroke-width", 1)

  

  var overlay = svg.append("rect")
  .attr("width", width)
  .attr("height", height)
  .attr("fill-opacity", 0)
  .on("mousemove", drawline)
  // .on("mouseout", function(d) { ovcirc.style("display", "None"); })

  var bisect = d3.bisector(function(d) { return d.x; }).left;

  function drawline(){
    pos = d3.mouse(this);
    // console.log(pos)
    xp = x.invert(pos[0]);
    // console.log(xp)
    var ii = bisect(d2, xp);

    left
    .attr("width", x(xp));

    right
    .attr("x", x(xp))
    .attr("width", width - x(xp))

    console.log(x2(d4[ii].x), y2(d4[ii].y))
    ovcirc
    // .style("display", "")
    .attr("r", 4)
    .attr("cx", x2(d4[ii].x))
    .attr("cy", y2(d4[ii].y))

    // line
    // .attr("x1", x(xp))
    // .attr("x2", x(xp))
    // .attr("y1", 0)
    // .attr("y2", height);
  }
})()