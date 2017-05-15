Title:   AJAX w/ Flask and D3
Summary: A brief description of my document.
Authors: David Reed
Date:    October 25, 2013
img: gaussian_ajax.png
mjs: gaussian_ajax.js
mcss:
data:
link: gaussian_ajax

<div id="draw" style="float:right; margin-left: 30px">	
</div>

I love d3, but sometimes you are going to have to do some calculations that require you to offload the work to the server.  The reason for this is sometimes because the computational complexity is too much for the client, but more often than not I find I want to do this because I have libraries in Python, server side, that could do exactly what I want.  This is a little example showing this.

To the right is a little applet, clicking creates points and after 2 or 3 an error ellipse comes up.  The calculation of this ellipse is easy in Python with the use of Numpy and its eigen decomposition functions.  These don't exist in Javascript (or I have not found them).  In any case, the point of this isn't to say that Javascript can't handle this or that, but to show how do push data over to the server and get something back to show to the user.

To get started, lets look at the javascript code that will interface with our server side Python code.  I am using the jquery function getJSON, which takes 3 parameters: the url, the data we are sending, and the function to handle the data we are receiving.  Here is the code:

    :::javascript

    $.getJSON($SCRIPT_ROOT + '/getdata', {
      x: d3.range(20).map( function(d){ return Math.random(); }),
      y: d3.range(20).map( function(d){ return Math.random(); })
    }, function(data) {
      ellipse                
      .attr("rx", x(data.result.width/2))
      .attr("ry", x(data.result.height/2))
      .attr("transform", "rotate(-" + data.result.theta + ", " + x(mean.x) + ", " + y(mean.y) + ")");
    });

The Python code in the flask application is broken up into two pieces, the interface to the client, which accepts the raw JSON and the function which actually computes the values we want. Flask has an excellent [tutorial][1] on this, but I found it a bit difficult to find out how to pass lists.

    :::python
    @app.route('/getdata')
	def get_data():
	    x = request.args.getlist('x[]', float)
	    y = request.args.getlist('y[]', float)

	    return jsonify(result=get_ellipse_parms(x, y))

Below is the code that takes the x, y coordinates and sends back the parameters needed by the SVG Ellipse object.

    :::python

    def get_ellipse_parms(x, y):

		x = np.asarray(x)
		y = np.asarray(y)

		def eigsorted(cov):
			vals, vecs = np.linalg.eigh(cov)
			order = vals.argsort()[::-1]
			return vals[order], vecs[:,order]

		cov = np.cov(x, y)

		vals, vecs = eigsorted(cov)
		theta = np.degrees(np.arctan2(*vecs[:,0][::-1]))

		width, height = 2 * np.sqrt(vals)

		return {"theta": theta, "width": width, "height": height};


[1]: http://flask.pocoo.org/docs/patterns/jquery/