function openUpload() {
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('paintApp').style.display = 'none';
}

function openPaintApp() {
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('paintApp').style.display = 'block';
}

const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let tool = 'pen';
let color = '#000000';
let drawingHistory = [];
let currentAction = null;

document.getElementById('colorPicker').addEventListener('change', function () {
    color = this.value;
});

let isDrawing = false;
let startX, startY;
let lastX, lastY;

canvas.addEventListener('mousedown', function (e) {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
    lastX = startX;
    lastY = startY;

    if (tool === 'fill') {
        fillCanvas(startX, startY, color);
    }
});

canvas.addEventListener('mousemove', function (e) {
    if (!isDrawing) return;

    const currentX = e.offsetX;
    const currentY = e.offsetY;

    switch (tool) {
        case 'pen':
            drawLine(lastX, lastY, currentX, currentY);
            lastX = currentX;
            lastY = currentY;
            break;
        case 'line':
            redrawCanvas();
            drawLine(startX, startY, currentX, currentY);
            break;
        case 'rectangle':
            redrawCanvas();
            drawRectangle(startX, startY, currentX, currentY);
            break;
        case 'circle':
            redrawCanvas();
            drawCircle(startX, startY, currentX, currentY);
            break;
        case 'eraser':
            erase(currentX, currentY);
            break;
        default:
            break;
    }
});

canvas.addEventListener('mouseup', function () {
    if (isDrawing) {
        saveToHistory();
        currentAction = null;
    }
    isDrawing = false;
});

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
}

function drawRectangle(x1, y1, x2, y2) {
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    ctx.fillStyle = color;
    ctx.fillRect(x1, y1, width, height);
}

function drawCircle(x1, y1, x2, y2) {
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    ctx.beginPath();
    ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function fillCanvas(x, y, fillColor) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const targetColor = getPixelColor(pixels, x, y);

    if (colorsMatch(targetColor, hexToRgb(fillColor))) {
        return;
    }

    floodFill(pixels, canvas.width, canvas.height, x, y, targetColor, hexToRgb(fillColor));

    ctx.putImageData(imageData, 0, 0);
}

function getPixelColor(pixels, x, y) {
    const index = (y * canvas.width + x) * 4;
    return [
        pixels[index],
        pixels[index + 1],
        pixels[index + 2],
        pixels[index + 3]
    ];
}

function setPixelColor(pixels, x, y, color) {
    const index = (y * canvas.width + x) * 4;
    pixels[index] = color[0];
    pixels[index + 1] = color[1];
    pixels[index + 2] = color[2];
    pixels[index + 3] = color[3];
}

function colorsMatch(color1, color2) {
    return color1[0] === color2[0] &&
        color1[1] === color2[1] &&
        color1[2] === color2[2] &&
        color1[3] === color2[3];
}

function erase(x, y) {
    ctx.clearRect(x - 10, y - 10, 20, 20);
}

function redrawCanvas() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function floodFill(pixels, width, height, x, y, targetColor, fillColor) {
    const queue = [[x, y]];

    while (queue.length > 0) {
        const [cx, cy] = queue.shift();

        if (colorsMatch(getPixelColor(pixels, cx, cy), targetColor)) {
            setPixelColor(pixels, cx, cy, fillColor);

            if (cx > 0) queue.push([cx - 1, cy]);
            if (cx < width - 1) queue.push([cx + 1, cy]);
            if (cy > 0) queue.push([cx, cy - 1]);
            if (cy < height - 1) queue.push([cx, cy + 1]);
        }
    }
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.substring(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b, 255];
}

function setTool(selectedTool) {
    tool = selectedTool;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingHistory = [];
}

function undo() {
    if (drawingHistory.length > 0) {
        drawingHistory.pop();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawingHistory.forEach(item => {
            const imageData = new ImageData(new Uint8ClampedArray(item.imageData.data), item.imageData.width, item.imageData.height);
            ctx.putImageData(imageData, 0, 0);
        });
    }
}
function saveToHistory() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    drawingHistory.push({
        tool,
        startX,
        startY,
        endX: lastX,
        endY: lastY,
        color,
        imageData: {
            data: imageData.data.slice(),
            width: imageData.width,
            height: imageData.height
        }
    });
    redoStack = [];
}
function showFileName() {
    var input = document.getElementById('fileInput');
    var fileName = input.files[0].name;
    document.getElementById('fileName').innerText = fileName;
}
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            const recommendationsDiv = document.getElementById('recommendations');
            recommendationsDiv.innerHTML = '';
            data.recommendations.forEach((rec, index) => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'recommendation-item';
                const img = document.createElement('img');
                img.src = '/images/' + rec;
                imgContainer.appendChild(img);

                const price = document.createElement('div');
                price.className = 'price';
                const randomPrice = Math.floor(Math.random() * (1000 - 600 + 1)) + 400;
                price.innerText = `₹${randomPrice}`;
                imgContainer.appendChild(price);

                recommendationsDiv.appendChild(imgContainer);
            });
            document.getElementById('orderSection').style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function saveDrawing() {
    const canvas = document.getElementById('drawingCanvas');
    const dataURL = canvas.toDataURL('image/png');
    fetch('/upload_canvas', {
        method: 'POST',
        body: JSON.stringify({ image: dataURL }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            const recommendationsDiv = document.getElementById('recommendations');
            recommendationsDiv.innerHTML = '';
            data.recommendations.forEach((rec, index) => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'recommendation-item';
                const img = document.createElement('img');
                img.src = '/images/' + rec;
                imgContainer.appendChild(img);

                const price = document.createElement('div');
                price.className = 'price';
                const randomPrice = Math.floor(Math.random() * (1000 - 600 + 1)) + 400;
                price.innerText = `₹${randomPrice}`;
                imgContainer.appendChild(price);

                recommendationsDiv.appendChild(imgContainer);
            });
            document.getElementById('orderSection').style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function openChatbot() {
    window.location.href = '/chatbot';
}
