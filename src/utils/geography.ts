


import { isPoint, Point, Rectangle } from '../hardware-types';

export default class GeographyUtilities {

  public static contains(polygonPoints: Point[], p: number | Point, py?: number) {
    py = isPoint(p) ? p.y : py;
    p = isPoint(p) ? p.x : p;

    return GeographyUtilities.pointContainsPolygon(polygonPoints, {
      x: p,
      y: py
    });
  }



  /*
     Return the angle between two vectors on a plane
     The angle is from vector 1 to vector 2, positive anticlockwise
     The result is between -pi -> pi
  */
  /*public static Angle2D(polygon[0], polygon[1]) {
    const TWOPI = Math.PI * 2;
    let dtheta;
    let theta1;
    let theta2;

    theta1 = atan2(polygon[0].y, polygon[0].x);
    theta2 = atan2(polygon[1].y, polygon[1].x);

    dtheta = theta2 - theta1;

    while (dtheta > PI)
      dtheta -= TWOPI;
    while (dtheta < -PI)
      dtheta += TWOPI;

    return dtheta;
  }*/

  public static area(point1: Point, point2: Point, point3: Point) {
    return Math.abs((point1.x * (point2.y - point3.y) + point2.x * (point3.y - point1.y) + point3.x * (point1.y - point2.y)) / 2.0);
  }

  // https://math.stackexchange.com/questions/190111/how-to-check-if-a-point-is-inside-a-rectangle
  // https://math.stackexchange.com/questions/571762/how-to-find-out-if-a-point-lie-in-rectangle
  // https://stackoverflow.com/questions/2752725/finding-whether-a-point-lies-inside-a-rectangle-or-not
  // http://www.cse.unsw.edu.au/~cs4128/18s1/lectures/9-comp-geom.pdf

  /**
   * Returns true if the point p lies inside the polygon with n vertices.
   * 
   * @url https://www.geeksforgeeks.org/how-to-check-if-a-given-point-lies-inside-a-polygon
   * @param {Point[]} polygon
   * @param {Point} point
   * @returns {boolean}
   */
  public static pointContainsPolygon(polygon: Point[], point: Point) {
    /* Calculate GeographyUtilities.area of rectangle ABCD */
    let A = GeographyUtilities.area(polygon[0], polygon[1], polygon[2]) + GeographyUtilities.area(polygon[0], polygon[3], polygon[2]);

    /* Calculate GeographyUtilities.area of triangle PAB */
    let A1 = GeographyUtilities.area(point, polygon[0], polygon[1]);

    /* Calculate GeographyUtilities.area of triangle PBC */
    let A2 = GeographyUtilities.area(point, polygon[1], polygon[2]);

    /* Calculate GeographyUtilities.area of triangle PCD */
    let A3 = GeographyUtilities.area(point, polygon[2], polygon[3]);

    /* Calculate GeographyUtilities.area of triangle PAD */
    let A4 = GeographyUtilities.area(point, polygon[0], polygon[3]);

    /* Check if sum of A1, A2, A3 and A4 
    is same as A */
    return (A == A1 + A2 + A3 + A4);


    // Using INT_MAX caused overflow problems)
    const INF = 10000;

    const n = polygon.length;

    // There must be at least 3 vertices in polygon[]
    if (n < 3) {
      return false;
    }

    // Create a point for line segment from p to infinite
    let extreme = {
      x: INF,
      y: point.y
    } as Point;

    // Count intersections of the above line
    // with sides of polygon
    let count = 0, i = 0;
    do {
      let next = (i + 1) % n;

      // Check if the line segment from 'p' to
      // 'extreme' intersects with the line
      // segment from 'polygon[i]' to 'polygon[next]'
      if (GeographyUtilities.doIntersect(polygon[i], polygon[next], point, extreme)) {
        // If the point 'p' is colinear with line
        // segment 'i-next', then check if it lies
        // on segment. If it lies, return true, otherwise false
        if (GeographyUtilities.orientation(polygon[i], point, polygon[next]) == 0) {
          return GeographyUtilities.onSegment(polygon[i], point,
            polygon[next]);
        }

        count++;
      }
      i = next;
    } while (i != 0);

    // Return true if count is odd, false otherwise
    return (count % 2 == 1); // Same as (count%2 == 1)
  }


  /**
   * Given three collinear points p, q, r, the function 
   * checks if point q lies on line segment 'pr'.
   * 
   * @url https://www.geeksforgeeks.org/how-to-check-if-a-given-point-lies-inside-a-polygon
   * @param {Point} p 
   * @param {Point} q 
   * @param {Point} r 
   * @returns {boolean}
   */
  public static onSegment(p: Point, q: Point, r: Point) {
    if (q.x <= Math.max(p.x, r.x) &&
      q.x >= Math.min(p.x, r.x) &&
      q.y <= Math.max(p.y, r.y) &&
      q.y >= Math.min(p.y, r.y)) {
      return true;
    }
    return false;
  }

  /**
   * To find orientation of ordered triplet (p, q, r).
   * The function returns following values.
   * 0 --> p, q and r are collinear
   * 1 --> Clockwise
   * 2 --> Counterclockwise
   * 
   * @url https://www.geeksforgeeks.org/how-to-check-if-a-given-point-lies-inside-a-polygon
   * @param {Point} p 
   * @param {Point} q 
   * @param {Point} r 
   * @returns {boolean}
   */
  public static orientation(p: Point, q: Point, r: Point) {
    let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    if (val == 0) {
      return 0; // collinear
    }
    return (val > 0) ? 1 : 2; // clock or counterclock wise
  }

  /**
   * The function that returns true if line segment 'p1q1' and 'p2q2' intersect.
   * 
   * @url https://www.geeksforgeeks.org/how-to-check-if-a-given-point-lies-inside-a-polygon
   * @param {Point} p1 
   * @param {Point} q1 
   * @param {Point} p2 
   * @param {Point} q2 
   * @returns {boolean}
   */
  public static doIntersect(p1: Point, q1: Point, p2: Point, q2: Point) {
    // Find the four orientations needed for
    // general and special cases
    let o1 = GeographyUtilities.orientation(p1, q1, p2);
    let o2 = GeographyUtilities.orientation(p1, q1, q2);
    let o3 = GeographyUtilities.orientation(p2, q2, p1);
    let o4 = GeographyUtilities.orientation(p2, q2, q1);

    // General case
    if (o1 != o2 && o3 != o4) {
      return true;
    }

    // Special Cases
    // p1, q1 and p2 are collinear and
    // p2 lies on segment p1q1
    if (o1 == 0 && GeographyUtilities.onSegment(p1, p2, q1)) {
      return true;
    }

    // p1, q1 and p2 are collinear and
    // q2 lies on segment p1q1
    if (o2 == 0 && GeographyUtilities.onSegment(p1, q2, q1)) {
      return true;
    }

    // p2, q2 and p1 are collinear and
    // p1 lies on segment p2q2
    if (o3 == 0 && GeographyUtilities.onSegment(p2, p1, q2)) {
      return true;
    }

    // p2, q2 and q1 are collinear and
    // q1 lies on segment p2q2
    if (o4 == 0 && GeographyUtilities.onSegment(p2, q1, q2)) {
      return true;
    }

    // Doesn't fall in any of the above cases
    return false;
  }


  /**
   * Checks if one rectangle intersects with another rectangle.
   * 
   * @param {Rectangle} rect1 The rectangle to check for intersection with
   * @param {Rectangle} rect2 The other rectangle
   * @return {boolean}
   * @url https://www.geeksforgeeks.org/find-two-rectangles-overlap/
   */
  public static rectangleIntersectsRectangle(rect1: Rectangle, rect2: Rectangle) {
    // To check if either rectangle is actually a line
    if (rect1.topLeft.x == rect1.bottomRight.x || rect1.topLeft.x == rect1.bottomRight.y ||
      rect2.topLeft.x == rect2.bottomRight.x || rect2.topLeft.y == rect2.bottomRight.y) {
      // the line cannot have positive overlap
      return false;
    }

    // If one rectangle is on left side of other
    if (rect1.topLeft.x >= rect2.bottomRight.x || rect2.topLeft.x >= rect1.bottomRight.x) {
      return false;
    }

    // If one rectangle is above other
    if (rect1.bottomRight.y >= rect2.topLeft.y || rect2.bottomRight.y >= rect1.topLeft.x) {
      return false;
    }

    return true;
  }
}