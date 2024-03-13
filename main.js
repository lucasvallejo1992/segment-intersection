const A = { x: 220, y: 100 }
const B = { x: 150, y: 250 }
const C = { x: 50, y: 100 }
const D = { x: 250, y: 200 }

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

const mouse = { x: 0, y: 0 };
document.onmousemove = (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
}

let angle = 0;
animate();

function animate() {
    const radius = 50;
    A.x = mouse.x + Math.cos(angle) * radius;
    A.y = mouse.y + Math.sin(angle) * radius;
    B.x = mouse.x + Math.cos(angle + Math.PI) * radius;
    B.y = mouse.y + Math.sin(angle + Math.PI) * radius;
    angle += 0.02;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLine(A, B);
    drawLine(C, D);

    drawDot(A, 'A');
    drawDot(B, 'B');
    drawDot(C, 'C');
    drawDot(D, 'D');

    const I = getIntersection(A, B, C, D);
    if (I) {
        drawDot(I, 'I', true);
    }

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

function getIntersection(A, B, C, D) {
    /*
        Ix = Ax + (Bx - Ax)t = Cx + (Dx - Cx)u
        Iy = Ay + (By - Ay)t = Cy + (Dy - Cy)u

        First equation:
        Ax + (Bx - Ax)t = Cx + (Dx - Cx)u | -Cx to both sides
        (Ax - Cx) + (Bx - Ax)t = (Dx - Cx)u | / (Dx - Cx) might be 0 if the segment is vertical

        Second ecuation:
        Ay + (By - Ay)t = Cy + (Dy - Cy)u | -Cy to both sides
        (Ay - Cy) + (By - Ay)t = (Dy - Cy)u | / (Dy - Cy) might be 0 if the segment is horizontal
                                            / * (Dx - Cx) to both sides

        (Dx - Cx) * (Ay - Cy) + (Dx - Cx) * (By - Ay)t = (Dy - Cy) * (Dx - Cx)u | (Dx - Cx)u can be replace by (Ax - Cx) + (Bx - Ax)t  as it is in the equation above
        (Dx - Cx) * (Ay - Cy) + (Dx - Cx) * (By - Ay)t = (Dy - Cy) * (Ax - Cx) + (Dy - Cy) * (Bx - Ax)t | - (Dy - Cy) * (Ax - Cx) to both sides
                                                                                                        | - (Dx - Cx) * (By - Ay)t to both sides

        (Dx - Cx) * (Ay - Cy) - (Dy - Cy) * (Ax - Cx) = (Dy - Cy) * (Bx - Ax)t - (Dx - Cx) * (By - Ay)t | factor out t
        (Dx - Cx) * (Ay - Cy) - (Dy - Cy) * (Ax - Cx) = t * ((Dy - Cy) * (Bx - Ax) - (Dx - Cx) * (By - Ay)) | divide by that side to get the value of t

        Final equation:
        t = ((Dx - Cx) * (Ay - Cy) - (Dy - Cy) * (Ax - Cx)) / ((Dy - Cy) * (Bx - Ax) - (Dx - Cx) * (By - Ay))

        Top part = (Dx - Cx) * (Ay - Cy) - (Dy - Cy) * (Ax - Cx)
        Bottom part = (Dy - Cy) * (Bx - Ax) - (Dx - Cx) * (By - Ay)
        t = top / bottom
    */
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: linearInterpolation(A.x, B.x, t),
                y: linearInterpolation(A.y, B.y, t),
                offset: t
            }
        }
    }

    return null;
}