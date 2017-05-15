Title:   Receiver Operating Curves
Summary: A brief description of my document.
Authors: David Reed
Date:    Feburary 2, 2013
img: roc2.png
mjs: roc.js
mcss: roc.css
data: roc.csv
link: roc

<div id="chart" style="float:right; margin-left: 10px">	
<table class="table">
	<tr>
		<th>Class</th>
		<th>Score</th>
	</tr>
</table>	
</div>

<div id="draw" style="float:right; margin-left: 30px">	
</div>

ROC Curves are used extemely often in classification problems to assess the performance of a given classifier.

In practice, you will never be able to create a classifier that will correctly identify every new sample, and so there is always going to be a tradeoff between the number in which you misclassify and the number in which you correctly classify.

In the interactive example to the right you can see that we have scored 20 samples.  Our classification rule will say that any sample with a score greater than 0.5 is class 1 and everything below is class 0.  The class listed in the left column is the *actual* class, and so anytime you see a class of 1 and score of less than 0.5, then there is an error.  You can click the rows to change the actual class of that sample to see how the ROC changes.  

Some nice edge cases are when all classes <a href="javascript:edge1()">match</a> the score we gave them, this creates a full rectangle and means we have correctly classified 100% of the samples and our Area Under the Curve (AUC) is 1.

<a href="javascript:edge2()">Another</a> case is when we completely screw everything up and say that all scores below 0.5 are class 1 and all above are class 0.  This may appear to be really bad, but in actuality is not since we can just change the labels we have assigned and now have 100% classification rate.  

The worst case is when the ROC curve is <a href="javascript:edge3()">diagonal</a>, this means that we are randomly guessing classes for each sample.

This work was adapted from a tutorial I found [here][1].


[1]: http://home.comcast.net/~tom.fawcett/public_html/papers/ROC101.pdf
[2]: javascript:edge1