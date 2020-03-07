const socket = io();
const speed = 4;
socket.on('data', (data) => {
  car.sprite.angle = -data.alpha;
  const rotated = rotateVector(data.gamma / 90 * speed, data.beta / 90 * speed, -data.alpha);
  car.sprite.x += rotated.x;
  car.sprite.y += rotated.y;
  // car.sprite.x += data.gamma / 90 * speed;
  // car.sprite.y += data.beta / 90 * speed;
});
socket.on('connect', () => {
  console.log('Connected');
  socket.emit('identify', 'game');
});

// Nunber of lines
var MAX_ROAD_LINES = 6;

// Game globals
var car;
var road;

function startGame() {
  myGameArea.start();

  // Create the Road
  road = {
    imgLoaded: false,
    lines: [],
    anim: () => {
      for (var i = 0; i < MAX_ROAD_LINES; i++) {
        road.lines[i].y++;
        if (road.lines[i].y > 540) {
          road.lines[i].y = -48;
        }
      }
    }
  };
  road.bg = new createSprite(40, 0, 910, 540, 'lightgray', road);
  for (var i = 0; i < MAX_ROAD_LINES; i++) {
    road.lines.push(new createSprite(495, i * 98, 10, 50, 'yellow', null));
  }

  // Create the car
  car = {
    imgLoaded: false,
    img: new Image(),
    sprite: null,
    speed: 0,
  };
  car.sprite = new createSprite(495, 120, 20, 20, 'red', car);
  car.img.src = 'images/car.png';
  car.img.onload = function () {
	  car.imgLoaded = true;
  };
}

// Constructor for a game object
function createSprite(x, y, width, height, color, obj) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.angle = 270;
  if (obj === null) {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  } else {
    if (obj.imgLoaded) {
      ctx.drawImage(obj.img, this.x, this.y);
    }
  }
  this.update = () => {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    if (!obj || !obj.imgLoaded) {
      ctx.fillRect(this.x, this.y, this.width, this.height);
    } else {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle * (3.14 / 180));
      ctx.drawImage(obj.img,
        -(obj.img.width / 2),
        -(obj.img.height / 2));
      ctx.restore();
    }
  }
}

// Initializes the canvas
var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 990;
    this.canvas.height = 540;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// Main loop
function updateGameArea() {
  myGameArea.clear();

  road.bg.update();
  for (var i = 0; i < MAX_ROAD_LINES; i++) {
    road.anim();
    road.lines[i].update();
  }

  car.sprite.update();
}
