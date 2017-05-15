import sys
sys.path.insert(0, '/home/dreed/webapps/flask01')
#sys.path.insert(0, '/home/dreed/webapps/flask02')
from flask01 import app as application
#from flask02 import app as application
application.debug = True
