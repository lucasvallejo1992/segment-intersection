const A = { x: 220, y: 100 }
const B = { x: 150, y: 250 }
const C = { x: 50, y: 100 }
const D = { x: 250, y: 200 }

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

let t = -1;
animate();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLine(A, B);
    drawLine(C, D);

    drawDot(A, 'A');
    drawDot(B, 'B');
    drawDot(C, 'C');
    drawDot(D, 'D');

    const M = {
        x: linearInterpolation(A.x, B.x, t),
        y: linearInterpolation(A.y, B.y, t),
    }

    const N = {
        x: linearInterpolation(C.x, D.x, t),
        y: linearInterpolation(C.y, D.y, t),
    }
    
    drawDot(M, 'M', t < 0 || t > 1);
    drawDot(N, 'N', t < 0 || t > 1);

    t += 0.005;

    requestAnimationFrame(animate);
}

function drawLine(start, end) {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}

function drawDot(point, label, isRed = false) {
    ctx.beginPath();
    ctx.fillStyle = isRed ? "red" : "white";
    ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = isRed ? "white" : "black";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = "bold 14px Arial";
    ctx.fillText(label, point.x, point.y);
}

// Linear interpolation when t = 0.5 you are moving half way from the start point to the end point
function linearInterpolation(start, end, t) {
    return start + (end - start) * t;
}