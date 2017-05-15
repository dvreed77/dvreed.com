Title:   Boston Landfill
Summary: A brief description of my document.
Authors: David Reed
Date:    2015-10-08
img: landfill.png
mjs: landfill.js
mcss: landfill.css
data: story_data.json 
    landfill.json
link: landfill

<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-geo-projection/0.2.9/d3.geo.projection.min.js"></script>
<script src="//d3js.org/queue.v1.min.js"></script>
<script src="static/js/textures.min.js"></script>

<div class="row">
<div id="A">
  <div id="map"></div>
  <div id="text"></div>
</div>
<div id="B">
  <div>
    
  </div>
  <div id="year">1780</div>
  <div id="timeline"></div>
  <div class="playPause" id="playMins">Play</div>
</div>
</div>

If you didn't know, Boston was once a tiny peninsula. 

Starting in the early 19th century Boston started to take shape into what you see now. 

I was inspired to create this app when a friend of mine posted a GIF she found from Boston College, which can be found [here][1]. I became frustrated because it was moving too fast for me to see all the changes that were taking place and I wanted to be able to scrub through the animation.

[1]: http://www.bc.edu/bc_org/avp/cas/fnart/fa267/sequence.html