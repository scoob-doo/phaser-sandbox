import Geom from './Geom'

describe('Geom.CalculateCircularOverlap', () => {
  test('should return 0 if circles do not overlap', () => {
    const circle1 = { x: 0, y: 0, radius: 1 }
    const circle2 = { x: 3, y: 0, radius: 1 }
    const overlap = Geom.CalculateCircularOverlap(circle1, circle2)
    expect(overlap).toBe(0)
  })

  test('should return 1 if one circle is completely inside the other', () => {
    const circle1 = { x: 0, y: 0, radius: 5 }
    const circle2 = { x: 0, y: 0, radius: 1 }
    const overlap = Geom.CalculateCircularOverlap(circle1, circle2)
    expect(overlap).toBe(1)
  })

  test('should return correct overlap fraction when circles partially overlap', () => {
    const circle1 = { x: 0, y: 0, radius: 5 }
    const circle2 = { x: 4, y: 0, radius: 5 }
    const overlap = Geom.CalculateCircularOverlap(circle1, circle2)
    expect(overlap).toBeCloseTo(0.6, 1)
  })

  test('should return 0 if circles touch but do not overlap', () => {
    const circle1 = { x: 0, y: 0, radius: 1 }
    const circle2 = { x: 2, y: 0, radius: 1 }
    const overlap = Geom.CalculateCircularOverlap(circle1, circle2)
    expect(overlap).toBe(0)
  })

  test('should handle negative coordinates correctly', () => {
    const circle1 = { x: 0, y: 5, radius: 5 }
    const circle2 = { x: -4, y: 5, radius: 5 }
    const overlap = Geom.CalculateCircularOverlap(circle1, circle2)
    expect(overlap).toBeCloseTo(0.6, 1)
  })
})
