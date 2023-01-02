import { pattern } from "./asset.js";

function getLetter() {
  return letters[Math.floor(Math.random() * letters.length)];
}

function getAlpha(z) {
  return (z + deltaz) / (2 * deltaz);
}

function DropText(ctx, ch, sz, x, y, z, vx, vy, vz) {
  this.sz = sz;
  this.ch = ch;
  this.x = x;
  this.y = y;
  this.z = z;
  this.vx = vx;
  this.vy = vy;
  this.vz = vz;

  this.draw = () => {
    this.ch = Math.random() > 0.99 ? getLetter() : this.ch;
    this.x += vx;
    this.y += vy;

    this.y %= innerHeight;

    var fillStyle = ctx.fillStyle;
    ctx.fillStyle = `rgba(0,255,255,${getAlpha(this.z)})`;
    var oldfont = ctx.font;
    ctx.font = `bold ${this.sz}px serif`;

    ctx.fillText(this.ch, this.x, this.y);

    ctx.fillStyle = fillStyle;
    ctx.font = oldfont;
  };
}

function ColumnChar(ctx, idx, ch, fontSize, textColumn) {
  this.ch = ch;
  this.idx = idx;
  this.textColumn = textColumn;

  this.getX = () => {
    return this.textColumn.x;
  };

  this.getY = () => {
    return this.textColumn.y + idx * fontSize - innerHeight / 2;
  };

  this.draw = (cond) => {
    this.ch = Math.random() > 0.99 ? getLetter() : this.ch;
    let alpha = getAlpha(this.textColumn.z);
    if (cond) {
      var fillStyle = ctx.fillStyle;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      var oldfont = ctx.font;
      ctx.font = "15px serif";
      ctx.fillText(this.ch, this.getX(), this.getY());
      ctx.fillStyle = fillStyle;
      ctx.font = oldfont;

      //   var fillStyle = ctx.fillStyle;
      //   ctx.fillStyle = `rgba(255, 255, 255, 1)`;
      //   ctx.fillText(this.ch, this.getX(), this.getY());
      //   ctx.fillStyle = fillStyle;
    } else {
      var fillStyle = ctx.fillStyle;
      ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`;
      ctx.fillText(this.ch, this.getX(), this.getY());
      ctx.fillStyle = fillStyle;
    }
  };
}

function marked(column, ch, cursor) {
  return (
    Math.sqrt(
      Math.pow(cursor.x - ch.getX(), 2) + Math.pow(cursor.y - ch.getY(), 2)
    ) < 50 || column.selected == ch.idx
  );
}

function markedKingOfDiamonds(ch, fontSize) {
  let i = Math.floor(ch.getY() / fontSize);
  let j = Math.floor(ch.getX() / fontSize);
  return (
    i >= 0 &&
    j >= 0 &&
    i < pattern.length / 2 &&
    j < pattern[0].length &&
    pattern[i][j] == 0
  );
}

function TextColumn(ctx, numChars, fontSize, x, y, z) {
  const amplitude = 0.00001;

  this.x = x;
  this.y = y;
  this.z = z;

  this.numChars = numChars;
  this.chars = [];
  for (var i = 0; i < this.numChars; ++i) {
    this.chars[i] = new ColumnChar(ctx, i, getLetter(), fontSize, this);
  }

  this.selected = 0;

  var moveDelay = Math.floor(Math.random() * 10) + 1;
  var curDelay = 0;

  this.rotate = (thetax, thetay, thetaz) => {
    [this.x, this.y, this.z] = rotateXAxis(this.x, this.y, this.z, thetax);
    [this.x, this.y, this.z] = rotateYAxis(this.x, this.y, this.z, thetay);
    [this.x, this.y, this.z] = rotateZAxis(this.x, this.y, this.z, thetaz);
  };

  this.draw = (cursor) => {
    this.rotate(
      amplitude * cursor.dy * Math.PI * 2,
      amplitude * cursor.dx * Math.PI * 2,
      0
    );
    for (let i = 0; i < this.chars.length; ++i) {
      this.chars[i].draw(marked(this, this.chars[i], cursor));
      //   this.chars[i].draw(markedKingOfDiamonds(this.chars[i], fontSize));
    }
    if (curDelay == moveDelay) {
      ++this.selected;
      this.selected %= this.chars.length;
      curDelay = 0;
    }
    ++curDelay;
  };
}

const hiragana =
  "あいうえおかきくけこがぎぐげごさしすせそざじずぜぞたちつてとだぢづでどなにぬねのはひふへほばびぶべぼぱぴぷぺぽまみむめもやゆよらりるれろわをん";
const katakana =
  "アイウエオカキクケコガギグゲゴサシスセソザジズゼゾタチツテトダヂヅデドナニヌネノハヒフヘホバビブベボパピプペポマミムメモヤユヨラリルレロワヲン";
const hangul = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘ";
const characters = hiragana + katakana + hangul;
const letters = characters.split("");

const deltaz = 90;

export function makeTextColumn(ctx) {
  var textColumns = [];
  const fontSize = 20;
  const numColumns = innerWidth / fontSize;
  for (var i = 0; i < numColumns; i++) {
    textColumns[i] = new TextColumn(
      ctx,
      innerHeight / fontSize,
      fontSize,
      i * fontSize,
      innerHeight / 2,
      -deltaz + 2 * deltaz * Math.random()
    );
  }
  return textColumns;
}

export function makeDropText(ctx) {
  const numDrops = 10;
  var textDrops = [];
  for (var i = 0; i < numDrops; ++i) {
    let ch = getLetter();
    let x0 = innerWidth * Math.random();
    let z0 = -deltaz + 2 * deltaz * Math.random();
    let dropSpeed = Math.floor(Math.random() * 10);
    let sz = Math.floor(Math.random() * 5) + 10;
    textDrops[i] = new DropText(ctx, ch, sz, x0, 0, z0, 0, dropSpeed, 0);
  }
  return textDrops;
}

const cx = innerWidth / 2;
const cy = innerHeight / 2;
const cz = 0;

function rotateXAxis(x, y, z, angle) {
  let dy = y - cy;
  let dz = z - cz;
  let y0 = dy * Math.cos(angle) - dz * Math.sin(angle);
  let z0 = dy * Math.sin(angle) + dz * Math.cos(angle);
  return [x, y0 + cy, z0 + cz];
}

function rotateYAxis(x, y, z, angle) {
  let dx = x - cx;
  let dz = z - cz;
  let x0 = dz * Math.sin(angle) + dx * Math.cos(angle);
  let z0 = dz * Math.cos(angle) - dx * Math.sin(angle);
  return [x0 + cx, y, z0 + cz];
}

function rotateZAxis(x, y, z, angle) {
  let dx = x - cx;
  let dy = y - cy;
  let x0 = dx * Math.cos(angle) - dy * Math.sin(angle);
  let y0 = dx * Math.sin(angle) + dy * Math.cos(angle);
  return [cx + x0, cy + y0, z];
}
