import GridUtil from './GridUtil'

describe('GridUtil', () => {
  describe('PathCoordinatesToLines', () => {
    test('should return an empty array when the path has less than two points', () => {
      expect(GridUtil.PathCoordinatesToLines([])).toEqual([])
      expect(GridUtil.PathCoordinatesToLines([{ x: 1, y: 2 }])).toEqual([])
    })

    test('should return a single line segment for two points', () => {
      const path = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ]
      const expected = [{ start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }]
      expect(GridUtil.PathCoordinatesToLines(path)).toEqual(expected)
    })

    test('should return a single line segment for multiple collinear points', () => {
      const path = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ]
      const expected = [{ start: { x: 0, y: 0 }, end: { x: 3, y: 3 } }]
      expect(GridUtil.PathCoordinatesToLines(path)).toEqual(expected)
    })

    test('should return multiple line segments for non-collinear points', () => {
      const path = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
      ]
      const expected = [
        { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
        { start: { x: 1, y: 1 }, end: { x: 1, y: 2 } },
        { start: { x: 1, y: 2 }, end: { x: 2, y: 2 } },
      ]
      expect(GridUtil.PathCoordinatesToLines(path)).toEqual(expected)
    })

    test('should handle large coordinates correctly', () => {
      const path = [
        { x: 1000, y: 1000 },
        { x: 2000, y: 2000 },
        { x: 3000, y: 3000 },
      ]
      const expected = [{ start: { x: 1000, y: 1000 }, end: { x: 3000, y: 3000 } }]
      expect(GridUtil.PathCoordinatesToLines(path)).toEqual(expected)
    })

    test('should handle negative coordinates correctly', () => {
      const path = [
        { x: -1, y: -1 },
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ]
      const expected = [{ start: { x: -1, y: -1 }, end: { x: 1, y: 1 } }]
      expect(GridUtil.PathCoordinatesToLines(path)).toEqual(expected)
    })
  })
})
