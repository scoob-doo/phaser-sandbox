import Vector from './Vector'
import Vector2 from './PhaserMath/Vector2'

describe('Vector.ClampMagnitude', () => {
  it('should clamp the vector magnitude to the specified range', () => {
    const vector = new Vector2(10, 0)
    const clampedVector = Vector.ClampMagnitude(vector, 5, 8)
    expect(clampedVector.length()).toBe(8)
  })
})

describe('Vector.PositionToCoordinates', () => {
  it('should convert position to coordinates based on tile size', () => {
    const pos = { x: 8, y: 8 }
    const coords = Vector.PositionToCoordinates(pos)
    expect(coords).toEqual({ x: 1, y: 1 })
  })
})

describe('Vector.CoordinatesToPosition', () => {
  it('should convert coordinates to position based on tile size', () => {
    const coordinates = { x: 3, y: 6 }
    const position = Vector.CoordinatesToPosition(coordinates)
    expect(position).toEqual({ x: 24, y: 48 })
  })
})

describe('Vector.CoordinatesToCenterPoint', () => {
  it('should calculate the center point of given coordinates', () => {
    const coord = { x: 2, y: 3 }
    const centerPoint = Vector.CoordinatesToCenterPoint(coord)
    expect(centerPoint).toEqual({ x: 20, y: 28 })
  })
})

describe('Vector.CoordinatesAreValid', () => {
  it('should validate if coordinates are within map boundaries', () => {
    const coord = { x: 10, y: 20 }
    const isValid = Vector.CoordinatesAreValid(coord)
    expect(isValid).toBe(true) // Assuming Settings.MapSize is larger than 10 and 20
  })
})

describe('Vector.StringToVector', () => {
  it('should convert a string to a vector', () => {
    const str = '10:20'
    const vector = Vector.StringToVector(str)
    expect(vector).toEqual({ x: 10, y: 20 })
  })

  it('should throw an error for invalid string format', () => {
    const str = 'invalid'
    expect(() => {
      Vector.StringToVector(str)
    }).toThrow('Invalid vector string: invalid')
  })
})

describe('Vector.VectorToString', () => {
  it('should convert a vector to a string', () => {
    const vector = { x: 10, y: 20 }
    const str = Vector.VectorToString(vector)
    expect(str).toBe('10:20')
  })
})

describe('Vector.GetAdjacentOrthogonalCoordinates', () => {
  it('should return orthogonal coordinates adjacent to a given point', () => {
    const coordinates = { x: 5, y: 5 }
    const expected = [
      { x: 5, y: 4 }, // up
      { x: 5, y: 6 }, // down
      { x: 4, y: 5 }, // left
      { x: 6, y: 5 }, // right
    ]
    const result = Vector.GetAdjacentOrthogonalCoordinates(coordinates)
    expect(result).toEqual(expect.arrayContaining(expected))
  })

  it('should return null for out-of-bounds orthogonal coordinates', () => {
    const coordinates = { x: 0, y: 0 }
    const expected = [
      null, // up (out of bounds)
      { x: 0, y: 1 }, // down
      null, // left (out of bounds)
      { x: 1, y: 0 }, // right
    ]
    const result = Vector.GetAdjacentOrthogonalCoordinates(coordinates)
    expect(result).toEqual(expect.arrayContaining(expected))
  })
})

describe('Vector.GetAdjacentDiagonalCoordinates', () => {
  it('should return diagonal coordinates adjacent to a given point', () => {
    const coordinates = { x: 5, y: 5 }
    const expected = [
      { x: 6, y: 4 }, // top-right
      { x: 6, y: 6 }, // bottom-right
      { x: 4, y: 6 }, // bottom-left
      { x: 4, y: 4 }, // top-left
    ]
    const result = Vector.GetAdjacentDiagonalCoordinates(coordinates)
    expect(result).toEqual(expect.arrayContaining(expected))
  })

  it('should return null for out-of-bounds diagonal coordinates', () => {
    const coordinates = { x: 0, y: 0 }
    const expected = [
      null, // top-right
      null, // bottom-right
      null, // bottom-left
      null, // top-left (all out of bounds)
    ]
    const result = Vector.GetAdjacentDiagonalCoordinates(coordinates)
    expect(result).toEqual(expect.arrayContaining(expected))
  })
})

describe('Vector.GetOutlineCoordinates', () => {
  it('should return outline coordinates for a given set of coordinates', () => {
    const coordinates = [{ x: 5, y: 5 }]
    const expected = [
      { x: 4, y: 4 },
      { x: 5, y: 4 },
      { x: 6, y: 4 },
      { x: 4, y: 5 },
      { x: 6, y: 5 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
      { x: 6, y: 6 },
    ]
    const result = Vector.GetOutlineCoordinates(coordinates)
    expect(result).toEqual(expect.arrayContaining(expected))
  })
})

describe('Vector.AreEqual', () => {
  it('should return true if two vectors are equal', () => {
    const v1 = { x: 10, y: 20 }
    const v2 = { x: 10, y: 20 }
    expect(Vector.AreEqual(v1, v2)).toBe(true)
  })

  it('should return false if two vectors are not equal', () => {
    const v1 = { x: 10, y: 20 }
    const v2 = { x: 20, y: 10 }
    expect(Vector.AreEqual(v1, v2)).toBe(false)
  })

  it('should return false if either vector is null', () => {
    const v1 = { x: 10, y: 20 }
    const v2 = null
    expect(Vector.AreEqual(v1, v2)).toBe(false)
  })
})

describe('Vector.CalcCoordinateDistance', () => {
  it('should calculate the maximum distance between two coordinates', () => {
    const coord1 = { x: 0, y: 0 }
    const coord2 = { x: 10, y: 20 }
    expect(Vector.CalcCoordinateDistance(coord1, coord2)).toBe(20)
  })
})

describe('Vector.FindClosestPoint', () => {
  it('should find the closest point to a target position', () => {
    const targetPosition = { x: 5, y: 5 }
    const points = [
      { x: 1, y: 1 },
      { x: 4, y: 4 },
      { x: 6, y: 6 },
    ]
    const [closestPoint, closestIndex] = Vector.FindClosestPoint(targetPosition, points)
    expect(closestPoint).toEqual({ x: 4, y: 4 })
    expect(closestIndex).toBe(1)
  })

  it('should throw an error if points array is empty', () => {
    const targetPosition = { x: 5, y: 5 }
    const points = []
    expect(() => {
      Vector.FindClosestPoint(targetPosition, points)
    }).toThrow('Points array is empty.')
  })
})

describe('Vector.CalculateNormalAndIntersection', () => {
  test('returns correct normal and normalized distance when point is directly on the line', () => {
    const line = [new Vector2(0, 0), new Vector2(10, 0)]
    const point = new Vector2(5, 0)
    const [normal, normalizedDistance] = Vector.CalculateNormalAndIntersection(line, point)

    expect(normal.x).toBeCloseTo(0)
    expect(normal.y).toBeCloseTo(0)
    expect(normalizedDistance).toBeCloseTo(0.5)
  })

  test('returns correct normal and normalized distance when point is off the line but projection is within the segment', () => {
    const line = [new Vector2(0, 0), new Vector2(10, 0)]
    const point = new Vector2(5, 5)
    const [normal, normalizedDistance] = Vector.CalculateNormalAndIntersection(line, point)

    expect(normal.x).toBeCloseTo(0)
    expect(normal.y).toBeCloseTo(-1)
    expect(normalizedDistance).toBeCloseTo(0.5)
  })

  test('returns null for normalized distance when projection is outside the segment', () => {
    const line = [new Vector2(0, 0), new Vector2(10, 0)]
    const point = new Vector2(-5, 0)
    const [normal, normalizedDistance] = Vector.CalculateNormalAndIntersection(line, point)
    expect(normal).toBeNull()
    expect(normalizedDistance).toBeNull()
  })

  test('returns correct normal and normalized distance for vertical lines [right]', () => {
    const line = [new Vector2(0, 0), new Vector2(0, 10)]
    const point = new Vector2(5, 5)
    const [normal, normalizedDistance] = Vector.CalculateNormalAndIntersection(line, point)

    expect(normal.x).toBeCloseTo(-1) // This is correct
    expect(normal.y).toBeCloseTo(0)
    expect(normalizedDistance).toBeCloseTo(0.5)
  })

  test('returns correct normal and normalized distance for vertical lines [left]', () => {
    const line = [new Vector2(0, 0), new Vector2(0, 10)]
    const point = new Vector2(-5, 5)
    const [normal, normalizedDistance] = Vector.CalculateNormalAndIntersection(line, point)

    expect(normal.x).toBeCloseTo(1) // This should be one because it's moving from left to right, but is getting -1
    expect(normal.y).toBeCloseTo(0)
    expect(normalizedDistance).toBeCloseTo(0.5)
  })

  test('returns correct normal and normalized distance for horizontal lines [up]', () => {
    const line = [new Vector2(0, 0), new Vector2(10, 0)]
    const point = new Vector2(5, 5)
    const [normal, normalizedDistance] = Vector.CalculateNormalAndIntersection(line, point)

    expect(normal.x).toBeCloseTo(0)
    expect(normal.y).toBeCloseTo(-1)
    expect(normalizedDistance).toBeCloseTo(0.5)
  })

  test('returns correct normal and normalized distance for horizontal lines [down]', () => {
    const line = [new Vector2(0, 0), new Vector2(10, 0)]
    const point = new Vector2(5, -5)
    const [normal, normalizedDistance] = Vector.CalculateNormalAndIntersection(line, point)

    expect(normal.x).toBeCloseTo(0)
    expect(normal.y).toBeCloseTo(1)
    expect(normalizedDistance).toBeCloseTo(0.5)
  })
})

describe('Vector.CalcAreaCoordinates', () => {
  it('should calculate area coordinates based on given width and height', () => {
    const baseCoord = new Vector2(2, 3)
    const width = 3
    const height = 2
    const expectedArea = [
      new Vector2(2, 2),
      new Vector2(3, 2),
      new Vector2(4, 2),
      new Vector2(2, 3),
      new Vector2(3, 3),
      new Vector2(4, 3),
    ]
    const area = Vector.CalcAreaCoordinates(baseCoord, width, height)
    expect(area).toEqual(expect.arrayContaining(expectedArea))
    expect(area.length).toBe(6)
  })

  it('should handle zero dimensions correctly by defaulting to 1', () => {
    const baseCoord = new Vector2(5, 5)
    const width = 0
    const height = 0
    const expectedArea = [baseCoord]
    const area = Vector.CalcAreaCoordinates(baseCoord, width, height)
    expect(area).toEqual(expectedArea)
  })
})
