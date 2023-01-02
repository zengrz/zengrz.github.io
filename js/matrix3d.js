import { makeTextColumn, makeDropText } from "./util.js";

const cursor = {
  x: innerWidth / 2,
  y: innerHeight / 2,
  dx: 0,
  dy: 0,
};

addEventListener("mousemove", (e) => {
  cursor.dx = e.clientX - cursor.x;
  cursor.dy = e.clientY - cursor.y;
  cursor.x = e.clientX;
  cursor.y = e.clientY;
});

addEventListener("resize", (e) => {
  canvas.height = innerHeight;
  canvas.width = innerWidth;

  textColumns = makeTextColumn(ctx);
  textDrops = makeDropText(ctx);
});

// set up the canvas and context
var canvas = document.createElement("canvas");
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

// dimensions
// var h = document.documentElement.clientHeight;
// var w = document.documentElement.clientWidth;
canvas.height = innerHeight;
canvas.width = innerWidth;

// set up the animation loop
var timeDelta = 0,
  timeLast = 0;

var textColumns = makeTextColumn(ctx);
var textDrops = makeDropText(ctx);

requestAnimationFrame(loop);

function loop(timeNow) {
  // calculate the time difference
  let timeDelta = timeNow - timeLast;
  var timeLast = timeNow;

  // background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  // ctx.reset();

  // text lines
  ctx.fillStyle = "#0f0";
  for (let text of textColumns) {
    text.draw(cursor);
  }
  cursor.dy = 0;
  cursor.dx = 0;

  // for (let drop of textDrops) {
  //   drop.draw();
  // }

  requestAnimationFrame(loop);
}
