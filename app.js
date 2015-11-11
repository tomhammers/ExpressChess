
var canvas = document.getElementById('game'); 
if (canvas.getContext) {
	var context = canvas.getContext('2d');
} else {
	// unsupported canvas
}

var width = canvas.scrollWidth; // responsive width
var height = canvas.scrollHeight; // responsive height
var rows = 8;
var columns = 8;
var blah = 0;

var widthIncrement = width / columns;


for(var i = 0; i < rows; i++) {
	
	context.strokeRect(blah+0.5, 0+0.5, widthIncrement, 20);
	//console.log(i * widthIncrement);
	console.log(i * widthIncrement);
	blah +=20;
}
context.stroke();

canvas.style.border   = "1px solid";
