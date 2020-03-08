const socket = io();
const speed = 0;
const players = {};
let numPlayers = 0;
socket.on('data', (data) => {
  const pId = data.id || 'solo';
  if (!players[pId]) {
    players[pId] = {id: pId, index: numPlayers};
    numPlayers++;
    const created = new createCar(495, 120, false);
    if (!cars.length) {
      cars.push(created);
    } else if (players[pId].index !== 0) {
      cars.splice(players[pId].index, 0, created);
    }
  }
  players[pId].rotation = data;
  console.log(players, cars);
});
socket.on('gone', (id) => {
  const index = (players[id || 'solo'] || {}).index || 0;
  numPlayers--;
  delete players[id || 'solo'];
  cars.splice(index, 1);
  for (const p in players) {
    if (!p) continue;
    if (players[p].index >= index) players[p].index--;
  }
});
socket.on('connect', () => {
  console.log('Connected');
  socket.emit('identify', 'game');
});

// Nunber of lines
const MAX_ROAD_LINES = 6;
const MAX_TRAFFIC = 7;

let gameOver = false;

// Game globals
var cars = [];
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
  road.bg = new createSprite(40, 0, 910, 540, 0, 'lightgray', road);
  for (var i = 0; i < MAX_ROAD_LINES; i++) {
    road.lines.push(new createSprite(495, i * 98, 10, 50, 0, 'yellow', null));
  }

  // Create user car
  //cars.push(new createCar(495, 300, false));
}

// Car timer
var trafficTimer = 0;

// Constructor for a game object
function createSprite(x, y, width, height, angle, color, obj) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.angle = angle;
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

//  car.sprite = new createSprite(495, 120, 20, 20, null, car);
function createCar(x, y, oncoming) {
  this.sprite = new createSprite(x, y, 128, 128, oncoming ? 90 : 270, null, this);
  this.imgLoaded = false;
  this.img = new Image();
  this.img.src = 'images/car.png';
  this.img.onload = () => {
    this.imgLoaded = true;
  };
  this.oncoming = oncoming;
  this.invalid = false;
  this.anim = () => {
    if (this.oncoming) {
      this.sprite.y += 10;
    } else {
      this.sprite.y -= 10;
    }
    if (this.sprite.y - 64 > 540 || this.sprite.y + 128 < 0) {
      this.invalid = true;
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
  const lastGO = gameOver;
  gameOver = false;
  myGameArea.clear();

  road.bg.update();
  for (var i = 0; i < MAX_ROAD_LINES; i++) {
    road.anim();
    road.lines[i].update();
  }
  let lastI = -1;
  for (const p in players) {
    const player = players[p];
    const i = player.index;
    lastI = i;
    const data = player.rotation;
    cars[i].sprite.angle = -data.alpha;
    const rotated =
        rotateVector(data.gamma / 90, data.beta / 90, data.alpha - 90);
    cars[i].sprite.x += rotated.x * speed;
    cars[i].sprite.y += rotated.y * speed;
    cars[i].sprite.update();
  }
  for (var i = lastI + 1; i < cars.length; i++) {
    for (const p in players) {
      const player = players[p];
      const i2 = player.index;
      if (gameOver || checkOverlapping(cars[i2].sprite, cars[i].sprite)) {
        cars[i].invalid = true;
        cars[i2].sprite.x = 495;
        cars[i2].sprite.y = 120;
        cars[i2].sprite.angle = 275;
        gameOver = true;
      }
    }
    if (cars[i].invalid || gameOver || lastGO) {
      cars.splice(i);
      break;
    } else {
      cars[i].anim();
      cars[i].sprite.update();
    }
  }

  trafficTimer++;
  if (trafficTimer > 50) {
    var oncoming = Math.floor(Math.random() * 2);
    var x = Math.floor(Math.random() * 405 - 128);
    if (oncoming) {
      cars.push(new createCar(x + 128 + 64, -45, true));
    } else {
      cars.push(new createCar(x + 545 + 64 + 64, 585, false));
    }
    trafficTimer = 0;
  }
}
