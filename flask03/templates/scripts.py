import os, sys
import glob
from PIL import Image


def resize_image(dname):
	size = 300, 300

	for infile in glob.glob(os.path.join(dname, '*.jpg')):
		# infile = os.path.join(dname, filename)


		outfile = os.path.splitext(infile)[0] + ".thumbnail"

		outfile = outfile.replace(' ', '_') + '.jpg'

		# print filename

		# if infile != outfile:
		im = Image.open(infile)
		im.thumbnail(size, Image.ANTIALIAS)
		im.save(outfile, "JPEG")
			# try:
			# 	im = Image.open(infile)
			# 	im.thumbnail(size, Image.ANTIALIAS)
			# 	im.save(outfile, "JPEG")
			# except IOError:
			# 	print "cannot create thumbnail for '%s'" % infile