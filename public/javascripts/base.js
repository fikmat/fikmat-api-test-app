const LED_STRIP_LENGTH = 60;

const LED_PANEL_OFFSET_X = 140;
const LED_PANEL_OFFSET_Y = 160;
const LED_PANEL_PIXEL_SIZE = 5;

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

function drawLED(x, y, color) {
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

const safeColorFromString = (rgb_array) => {
  if (typeof rgb_array === 'string') return "rgb(0, 0, 0)";

  const colors = rgb_array.map((color) => {
    let c = parseInt(color, 10) || 0;
    if (color > 255) {
      c = 255;
    } else if (color < 0) {
      c = 0;
    }
    return c;
  });

  if (colors.length === 1) {
    colors.push(colors[0], colors[0]);
  } else if (colors.length === 2) {
    colors.push(0);
  }

  return `rgb(${colors.slice(0, 3).join(', ')})`;
};

const mapRange = (value, low1, high1, low2, high2) => {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};

const updateLedStripColors = (x, colors) => {
  if (colors.length === 0) return;

  colors.forEach((color, i) => {
    const c = safeColorFromString(color);
    const newPos = Math.floor(mapRange(i, 0, colors.length, 0, LED_STRIP_LENGTH));
    for (let j = 0; j < Math.floor(LED_STRIP_LENGTH / colors.length); j++) {
      drawLED(x, 300 + (newPos + j) * 10, c);
    }
  });
};

const updateLedPanel = (data) => {
  for (let row = 0; row < data.length; row++) {
    for (let col = 0; col < data[row].length; col++) {
      if (data[row][col] === 1) {
        ctx.fillStyle = "red";
      } else {
        ctx.fillStyle = "black";
      }
      ctx.fillRect(LED_PANEL_OFFSET_X + col * LED_PANEL_PIXEL_SIZE,
                   LED_PANEL_OFFSET_Y + row * LED_PANEL_PIXEL_SIZE,
                   LED_PANEL_PIXEL_SIZE,
                   LED_PANEL_PIXEL_SIZE);
    }
  }
};

const renderMachine = () => {
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.rect(110, 290, canvas.width - 220, canvas.height - 290);
  ctx.strokeStyle = "lightgray";
  ctx.stroke();

  ctx.beginPath();
  ctx.rect(130, 310, canvas.width - 260, 200);
  ctx.fillStyle = "blue";
  ctx.fill();

  ctx.beginPath();
  ctx.rect(LED_PANEL_OFFSET_X, LED_PANEL_OFFSET_Y, LED_PANEL_PIXEL_SIZE * 64, LED_PANEL_PIXEL_SIZE * 16);
  ctx.strokeStyle = "lightgray";
  ctx.stroke();

  ctx.font = "20px sans";
  ctx.fillStyle = "lightgray";
  ctx.textAlign = "center";
  ctx.fillText("FIKMAT", canvas.width / 2, 410);
}

$(function() {
  const socket = io();

  const ledStripLeftX = 100;
  const ledStripRightX = canvas.width - 100;

  renderMachine();

  socket.on('action', (params) => {
    if (!params) return;

    console.log('incoming data', params);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (params.led_left) {
      updateLedStripColors(ledStripLeftX, params.led_left);
    }

    if (params.led_right) {
      updateLedStripColors(ledStripRightX, params.led_right);
    }

    if (params.led_panel) {
      updateLedPanel(params.led_panel);
    }

    renderMachine();
  });
});

