
/**
 * Calculate the Euclidean distance between two points
 * @param {Object} p1 - The first point {x, y}
 * @param {Object} p2 - The second point {x, y}
 * @returns {number} The distance between the points
 */
exports.calculateDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * Check if a click is within tolerance of a stored point
 * @param {Object} click - The clicked point {x, y}
 * @param {Object} storedPoint - The stored point {x, y}
 * @param {number} tolerance - The allowed distance in pixels
 * @returns {boolean} Whether the click is within tolerance
 */
exports.isClickWithinTolerance = (click, storedPoint, tolerance = 30) => {
  return exports.calculateDistance(click, storedPoint) <= tolerance;
};
