from flask import Flask, jsonify, render_template, request
from flask import Markup

import json
import markdown
import os
import glob
from dateutil import parser

import numpy as np

app = Flask(__name__)

dname = os.path.dirname(__file__)


@app.route("/favicon.ico")
def favicon():
    return app.send_static_file('favicon.ico')


def get_ellipse_parms(x, y):

    x = np.asarray(x)
    y = np.asarray(y)

    def eigsorted(cov):
        vals, vecs = np.linalg.eigh(cov)
        order = vals.argsort()[::-1]
        return vals[order], vecs[:, order]

    cov = np.cov(x, y)

    vals, vecs = eigsorted(cov)
    theta = np.degrees(np.arctan2(*vecs[:, 0][::-1]))

    width, height = 2 * 1 * np.sqrt(vals)

    return {"theta": theta, "width": width, "height": height}


@app.route("/")
def index():
    articles = []
    for fname in glob.glob(os.path.join(dname, 'content', '*.md')):
        with open(fname) as fid:
            md = markdown.Markdown(extensions=['codehilite', 'meta'])
            Markup(md.convert(fid.read()))
            md.Meta['date'][0] = parser.parse(md.Meta['date'][0])

            articles.append(md.Meta)

    articles = sorted(articles, key=lambda x: x['date'], reverse=True)
    return render_template('frontpage.html', articles=articles)


@app.route("/<tut_name>")
def tutorial(tut_name):
    with open(os.path.join(dname, "content/" + tut_name + ".md")) as fid:
        md = markdown.Markdown(extensions=['codehilite', 'meta'])
        content = Markup(md.convert(fid.read()))
    return render_template('tut.html', content=content, meta=md.Meta)

# @app.route("/kalman")
# def kalman():
#     return render_template('kalman.html')


@app.route('/json')
def get_current_user():
    return jsonify(data='dave', data2=[1, 2, 3])


@app.route('/_add_numbers')
def add_numbers():
    a = request.args.get('a', 0, type=int)
    b = request.args.get('b', 0, type=int)
    return jsonify(result=a + b)


@app.route('/getdata')
def get_data():
    x = request.args.getlist('x[]', float)
    y = request.args.getlist('y[]', float)

    # print "Dave", x, y
    return jsonify(result=get_ellipse_parms(x, y))


@app.route('/painting')
@app.route('/painting/<int:paint_id>', endpoint='paintings')
def painting(paint_id=None):
    with open(os.path.join(dname, 'paintings.json')) as fid:
        data = json.load(fid)

    if paint_id is None:
        return render_template('paintings.html', data=data)
    else:
        d = data[paint_id]
        d['description'] = Markup(markdown.markdown(d['description']))
        return render_template('painting.html', data=d)


if __name__ == "__main__":
    app.debug = True
    app.run()
