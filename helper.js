/**
 * Check if the two given objects are overlapping.
 * @returns {boolean} True if overlapping, false otherwise.
 */
function checkOverlapping(a, b, middle = true) {
  if (middle) {
    a.x = a.x - a.width / 2;
    a.y = a.y - a.height / 2;
  }
  if (a.angle || b.angle) return checkRotatedOverlapping(a, b);
  verifyRect(a);
  verifyRect(b);

  return ((a.x < b.x && a.x + a.width > b.x) ||
          (a.x > b.x && a.x < b.x + b.width)) &&
      ((a.y < b.y && a.y + a.height > b.y) ||
       (a.y > b.y && a.y < b.y + b.height));
}

/**
 * Please call `checkOverlapping()` instead of this function.
 *
 * @link
 * https://stackoverflow.com/questions/10962379/how-to-check-intersection-between-2-rotated-rectangles
 */
function checkRotatedOverlapping(a, b) {
  verifyRect(a, ['angle']);
  verifyRect(b, ['angle']);

  const Amid = {x: a.x + a.width / 2, y: a.y + a.height / 2};
  const Ap = [
    {x: a.x, y: a.y},
    {x: a.x + a.width, y: a.y},
    {x: a.x + a.width, y: a.y + a.height},
    {x: a.x, y: a.y + a.height},
  ].map((el) => rotateAround(el, Amid, a.angle));

  const Bmid = {x: b.x + b.width / 2, y: b.y + b.height / 2};
  const Bp = [
    {x: b.x, y: b.y},
    {x: b.x + b.width, y: b.y},
    {x: b.x + b.width, y: b.y + b.height},
    {x: b.x, y: b.y + b.height},
  ].map((el) => rotateAround(el, Bmid, b.angle));

  for (const p of [Ap, Bp]) {
    for (let i1 = 0; i1 < p.length; i1++) {
      const i2 = (i1 + 1) % p.length;
      const p1 = p[i1];
      const p2 = p[i2];

      const normal = {x: p2.y - p1.y, y: p1.x - p2.x};

      let minA = null;
      let maxA = null;
      for (const p_ of Ap) {
        const projected = normal.x * p_.x + normal.y * p_.y;
        if (minA === null || projected < minA) minA = projected;
        if (maxA === null || projected > maxA) maxA = projected;
      }

      let minB = null;
      let maxB = null;
      for (const p_ of Bp) {
        const projected = normal.x * p_.x + normal.y * p_.y;
        if (minB === null || projected < minB) minB = projected;
        if (maxB === null || projected > maxB) maxB = projected;
      }

      if (maxA < minB || maxB < minA) return false;
    }
  }
  return true;
}

/**
 * Rotate a vector around a certain point.
 * @param {{x: number, y: number}} vec The vector to rotate.
 * @param {{x: number, y: number}} point The point to rotate around.
 * @param {number} angle The angle to rotate by.
 * @returns {{x: number, y: number}} Rotated vector.
 */
function rotateAround(vec, point, angle) {
  const rotated = rotateVector(vec.x - point.x, vec.y - point.y, angle);
  return {x: rotated.x + point.x, y: rotated.y};
}

/**
 * Rotates a vector by an angle.
 * @returns {{x: number, y: number}} Rotated vector.
 */
function rotateVector(gamma, beta, angle) {
  const ang = -angle * (Math.PI / 180);
  const cos = Math.cos(ang);
  const sin = Math.sin(ang);
  return {
    x: Math.round(10000 * (gamma * cos - beta * sin)) / 10000,
    y: Math.round(10000 * (gamma * sin + beta * cos)) / 10000
  };
}

/**
 * Checks if the given object has the data I need.
 */
function verifyRect(obj, add) {
  if (!obj) throw new TypeError(`${obj} is not a valid type!`);
  const expected = ['width', 'height', 'x', 'y'].concat(add || []);
  expected.forEach((el) => {
    if (typeof obj[el] !== 'number') {
      throw new TypeError(`${el} is not a number! (${obj[el]})`);
    }
  });
}

// TEST CASES
const goodOne = {
  width: 10,
  height: 10,
  x: 20,
  y: 20,
  angle: 0,
};
const goodTwo = {
  width: 10,
  height: 10,
  x: 25,
  y: 25,
  angle: 45,
};
const goodThree = {
  width: 10,
  height: 10,
  x: 9,
  y: 10,
  angle: 45,
};
const awayOne = {
  width: 10,
  height: 10,
  x: 0,
  y: 0,
  angle: 0,
};
const badOne = {};
if (!checkOverlapping(goodOne, goodTwo)) {
  console.error('Overlapping check does not work!');
}
if (!checkRotatedOverlapping(goodOne, goodTwo) ||
    !checkRotatedOverlapping(goodOne, goodThree) ||
    checkRotatedOverlapping(goodOne, awayOne)) {
  console.error('Rotated overlapping check does not work!');
}
// checkOverlapping(goodOne, badOne);
