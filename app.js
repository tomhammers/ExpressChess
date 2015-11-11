
var canvas = document.getElementById('game'); 
if (canvas.getContext) {
	var context = canvas.getContext('2d');
} else {
	// unsupported canvas
}

var width = canvas.width; // responsive width
var height = canvas.height; // responsive height
var rows = 8;
var columns = 8;


var widthIncrement = width / columns;
var heightIncrement = height / rows;

for(var i = 0; i < 8; i++) {
	for(var j = 0; j < 8; j++) {
		context.strokeRect(i * widthIncrement, j * heightIncrement, widthIncrement, heightIncrement);
		context.stroke();

		console.log(i * widthIncrement);
		console.log(width);
	}
}




//canvas.style.border   = "1px solid";
