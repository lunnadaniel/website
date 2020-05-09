// ------ CONSTANTS ----------------------------------------
var numberOfClouds = 100;
var factor = 1.8;
var lastTouchedPoint = new Point(view.center.x, view.center.y); // Point (x,y)
console.log(lastTouchedPoint);
// ---------------------------------------------------------
var cloud = new Path('M42.65,19.05l6.3,0.7l4.9,2.8l1.4,4.2l4.2,-2.1l2.8,-0.7h1.4l6.3,1.4l2.8,1.4l2.1,2.1l2.1,4.9l5.6,2.8l3.5,4.2l1.4,6.3l-0.7,7l-4.9,4.2l-7,2.1l-4.9,-0.7l-3.5,-1.4l-2.1,2.8l-2.8,2.1l-2.8,1.4l-4.9,1.4l-5.6,-1.4l-4.2,-2.8l-2.8,-4.2l-2.8,2.1l-3.5,1.4h-4.9l-4.2,-2.1l-4.2,-4.2l-2.1,-7l1.4,-6.3l4.2,-4.9l4.9,-2.1v-7l1.4,-2.1l1.4,-2.1l4.2,-2.8z');
cloud.fillColor = 'white';
cloud.scale(0.7,0.7);

for (var i = 0; i < numberOfClouds; i++) {
	var obj = cloud.clone();
	var center = Point.random() * view.size;
	obj.position = center;
	obj.scale(i / numberOfClouds);
}
//cloud.remove();
// ------ CREATION OF THE MAIN OBJECT: HELICOPTER --------
//CABIN

var cabin1P = new Path.RegularPolygon(view.center, 3, 20);
cabin1P.fillColor = 'green';
cabin1P.position.y += 5;
cabin1P.position.x -= 31;
cabin1P.rotate(-90);

var cabin2P = new Path.RegularPolygon(view.center, 4, 24);
cabin2P.fillColor = 'green';
cabin2P.position.x += 12;
cabin2P.scale(1.71,1);

var cabin4P = new Path.RegularPolygon(view.center, 50, 16.8);
cabin4P.fillColor = 'green';
cabin4P.position.x += 41;

var cabin = new Group([cabin1P, cabin2P, cabin4P]);

// TOP PROPELLER

var baseRotor = new Path.RegularPolygon(view.center, 3, 10);
baseRotor.fillColor = 'black';
baseRotor.position.y -= 22;
baseRotor.position.x += 14;
baseRotor.scale(1.2,1);


var propeller = new Path.RegularPolygon(view.center, 100, 3);
propeller.fillColor = 'black';
propeller.position.y -= 33;
propeller.position.x += 14;
propeller.scale(13,1);

var topPropeller = new Group([propeller, baseRotor]);

//TAIL PROPELLER

var triangleTail = new Path.RegularPolygon(view.center, 3, 15);
triangleTail.fillColor = 'green';
triangleTail.position.y += 4;
triangleTail.position.x -= 40;
triangleTail.rotate(-90);
triangleTail.scale(4,1);

var tailPropeller1 = new Path.RegularPolygon(view.center, 100, 2);
tailPropeller1.fillColor = 'black';
tailPropeller1.position.x -= 86;

var tailPropeller2 = new Path.RegularPolygon(view.center, 4, 3);
tailPropeller2.fillColor = 'black';
tailPropeller2.position.x -= 86;
tailPropeller2.position.y -= 12;
tailPropeller2.scale(4,1);
tailPropeller2.rotate(90);

var tailPropeller3 = new Path.RegularPolygon(view.center, 4, 3);
tailPropeller3.fillColor = 'black';
tailPropeller3.position.x -= 86;
tailPropeller3.position.y += 12;
tailPropeller3.scale(4,1);
tailPropeller3.rotate(90);

var tailPropeller = new Group([tailPropeller1, tailPropeller2, tailPropeller3]);

var helicopter = new Group([cabin, triangleTail, tailPropeller, topPropeller]);
helicopter.position = view.center;
helicopter.applyMatrix = false
var step = 10;

viewWith = view.size.width;
viewHeight = view.size.height;

function rotateHelicopter(event){
	// Rotate the Helicopter towards that direction
	ax = event.point.x-helicopter.position.x; // x component of vector A
	ay = event.point.y-helicopter.position.y; // y component of vector A
	aH = Math.pow((Math.pow(ax,2)+Math.pow(ay,2)),0.5);
	// Vector B is always the unitary positive vector of x (1,0)
	// Dot product between A * B = (ax*bx+ay*by)
	dot = (ax*1+ay*0);
	angle = Math.acos(dot/aH)*(180/Math.PI)*Math.sign(ay);
	helicopter.rotation = angle;
}
function helicopterDistance(point){
	// compute chopper distance to the point
	dx = point.x-helicopter.position.x;
	dy = point.y-helicopter.position.y;
	distance = Math.pow((Math.pow(dx,2)+Math.pow(dy,2)),0.5);
	return [dx, dy, distance]; // 0, 1 ,2
}

function moveHelicopter(){
	currentDistance = helicopterDistance(lastTouchedPoint);
	if (currentDistance[2] > 10){
		dx = currentDistance[0]/Math.pow(currentDistance[2],1/factor);
		dy = currentDistance[1]/Math.pow(currentDistance[2],1/factor);
		helicopter.position = {x: helicopter.position.x + dx,
							   y: helicopter.position.y + dy
							   }
		//lastTouchedPoint = new Point(lastTouchedPoint.x+dx,lastTouchedPoint.y+dy);
	}
}
// ======================== EVENTS ===============================
function onResize(event) {
	// Whenever the window is resized, recenter the path:
	//helicopter.position = view.center;
	helicopter.position.y = helicopter.position.y*view.size.height/viewHeight;
	helicopter.position.x = helicopter.position.x*view.size.width/viewWith;
	lastTouchedPoint = helicopter.position;
	for (var i = 0; i < numberOfClouds; i++) {
		var item = project.activeLayer.children[i];
		item.position.y = item.position.y*view.size.height/viewHeight;
		item.position.x = item.position.x*view.size.width/viewWith;
	}
	viewWith = view.size.width;
	viewHeight = view.size.height;
}
function onFrame(event) {
	tailPropeller.rotate(50);
	for (var i = 0; i < numberOfClouds; i++){
		var item = project.activeLayer.children[i];
		item.position.x -= item.bounds.width / 20;
		if (item.bounds.right < 0) 
		{
				item.position.x = view.size.width+item.bounds.width;
		}
	}
	moveHelicopter();
}
function onKeyDown(event) {
	if(event.key == 'up'){
		helicopter.position.y -= step;
	}
	if(event.key == 'down'){
		helicopter.position.y += step;
	}
	if(event.key == 'left'){
		helicopter.position.x -= step;
	}
	if(event.key == 'right'){
		helicopter.position.x += step;
	}
}
function onMouseDown(event) {
	rotateHelicopter(event);
	lastTouchedPoint = event.downPoint;
}
function onMouseDrag(event){
	rotateHelicopter(event);
	lastTouchedPoint = event.lastPoint;
}
console.log(helicopter);