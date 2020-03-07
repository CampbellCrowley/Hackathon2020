/**
 * Check if the two given objects are overlapping.
 * @returns {boolean} True if overlapping, false otherwise.
 */
function checkOverlapping(a, b) {
  verifyRect(a);
  verifyRect(b);

  return false;

  return (a.x < b.x);
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
function verifyRect(obj) {
  if (!obj) throw new TypeError(`${obj} is not a valid type!`);
  const expected = ['width', 'height', 'x', 'y'];
  expected.forEach((el) => {
    if (typeof obj[el] !== 'number') {
      throw new TypeError(`${el} is not a number! (${obj[el]})`);
    }
  });
}

const goodOne = {
  width: 10,
  height: 10,
  x: 20,
  y: 20,
};
const goodTwo = {
  width: 10,
  height: 10,
  x: 25,
  y: 25,
};
const badOne = {};
if (!checkOverlapping(goodOne, goodTwo)) {
  console.error('Overlapping check does not work!');
}
// checkOverlapping(goodOne, badOne);
