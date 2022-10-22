let canvasWidth = 700;
let canvasHeight = 300;
let canvas = null;
let bounds = null;
let ctx = null;
let hasLoaded = false;

let startX = 0;
let startY = 0;
let mouseX = 0;
let mouseY = 0;
let isDrawing = false;
let existingLines = [];
let result = [];
let existingPoints = [];
let allPoints = [];

function draw(e) {//draw lines and points
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.strokeStyle = "while";
	ctx.lineWidth = 2;
	ctx.beginPath();
    
	for (let i = 0; i < existingLines.length; i++) {
		let line = existingLines[i];
		ctx.moveTo(line.startX, line.startY);
		ctx.lineTo(line.endX, line.endY);   
    }
	
	ctx.stroke();
	
	if (isDrawing) {
		ctx.strokeStyle = "black";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(mouseX, mouseY);
		ctx.stroke();
        
        for (let i = 0; i < existingLines.length; i++) {
            let line = existingLines[i]; 
            result = checkLineIntersection(line.startX, line.startY, line.endX, line.endY, startX, startY, mouseX, mouseY)
            drawPoint(result.x, result.y, result.onLine1, result.onLine2)
            console.log(result); //for ease of tracking       
        }                 
	}
    let sum = 0;
    if(!isDrawing) {
        for (let i = 0; i < existingLines.length; i++) {
            let line = existingLines[i]; 
            result = checkLineIntersection(line.startX, line.startY, line.endX, line.endY, startX, startY, mouseX, mouseY);
            
            let b;
            if(result.onLine1 && result.onLine2 && result.onLine1 && result.onLine2) {
                sum++;
                console.log(result);
                    b = existingPoints[sum] = ({
                        x: result.x,
                        y: result.y,
                        onLine1: result.onLine1,
                        onLine2: result.onLine2
                    });
                    allPoints.push(b);    
            }
        }
    }
    if(allPoints) {
        for(let i = 0; i < allPoints.length; i++) {
            drawPoint(allPoints[i].x, allPoints[i].y, allPoints[i].onLine1, allPoints[i].onLine2);
        } 
    } 
}


let sumClick = 1;
function onclick(e) {
    sumClick += 1;

    if(sumClick % 2 !== 0) {
        if (hasLoaded && e.button === 0) {
            if (isDrawing) {
                existingLines.push({
                    startX: startX,
                    startY: startY,
                    endX: mouseX,
                    endY: mouseY
                });

                isDrawing = false;
   
            }
            draw();
        }     
    } else {
        if (hasLoaded && e.button === 0) {
            if (!isDrawing) {
                startX = e.clientX - bounds.left;
                startY = e.clientY - bounds.top;
                isDrawing = true;
            }           
        }
    }
}

function onmousemove(e) {
	if (hasLoaded) {
		mouseX = e.clientX - bounds.left;
		mouseY = e.clientY - bounds.top;
		
		if (isDrawing) { 
			draw();
		}
	}
}

window.onload = function() {
	canvas = document.getElementById("canvas");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
    canvas.oncontextmenu = function(e){
        isDrawing = false;  
        open('').close();
        onclick(e);
    }
	canvas.onclick = onclick;
	canvas.onmousemove = onmousemove;
	bounds = canvas.getBoundingClientRect();
	ctx = canvas.getContext("2d");
	hasLoaded = true;
	
	draw();
}
    
//calculation and location of intersection points
function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {   
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));

    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }

    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    return result;
};

function drawPoint(x, y, onLine1, onLine2) {
    if(onLine1 === true && onLine2 === true) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI, true);
        ctx.fill();   
    }
};

function middleSegment(x1, y1, x2, y2) {
    let c1 = (x1 + x2) / 2;
    let c2 = (y1 + y2) / 2;
    let result = [c1, c2];
    return result;
}

let results = [];

let button = document.querySelector("#button");
button.addEventListener("click", function() {
    //finding the midpoint of segments
    for(let i = 0; i < existingLines.length; i++) {
        results.push(middleSegment(existingLines[i].startX, existingLines[i].startY, existingLines[i].endX, existingLines[i].endY));
    }

    //animation
    for(let i = 0; i < existingLines.length; i++) {
        let points = [
            {x: existingLines[i].startX, y: existingLines[i].startY},
            {x: results[i][0], y: results[i][1]}
        ]

        let points2 = [
            {x: existingLines[i].endX, y: existingLines[i].endY},
            {x: results[i][0], y: results[i][1]}
        ]

        function createCoords(points) {
            const coords = [];
        
            for (let i = 1; i < points.length; i++) {
            const
                p0 = points[i - 1],
                p1 = points[i],
                dx = p1.x - p0.x,
                dy = p1.y - p0.y,
                steps = Math.max(Math.abs(dx), Math.abs(dy)) / 2;
        
            for (let j = 0; j < steps; j++) {
                coords.push({
                x: p0.x + dx * j / steps,
                y: p0.y + dy * j / steps,
                });
            }
            }
        
            return coords;
        }
        function animates(points) {
            (function animate(coords, index) {
                if (index === coords.length) {
                return;
                }
            
                ctx.strokeStyle = 'white';
                ctx.lineCap = 'round';
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(coords[index - 1].x, coords[index - 1].y);
                ctx.lineTo(coords[index].x, coords[index].y);
                ctx.stroke();
            
                requestAnimationFrame(animate.bind(null, coords, index + 1));
            })(createCoords(points),  1);
        }
        animates(points);
        animates(points2);
    }
    //clearing the workspace after 1.5 seconds
    const delay = async (ms) => await new Promise(resolve => setTimeout(resolve, ms));
    delay(1500).then(() => ctx.clearRect(0, 0, 700, 300), existingLines = [], existingPoints = [], allPoints = [], results = []);
});
