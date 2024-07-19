import SimplexNoise from './SimplexNoise'

describe('SimplexNoise', () => {
  it('getValue returns a consistent noise value for a given seed and coordinates', () => {
    const seed = 'seed'
    const coordinates = { x: 10, y: 15 }
    const value1 = SimplexNoise.GetValue(coordinates, seed)
    const value2 = SimplexNoise.GetValue(coordinates, seed)
    expect(value1).toBe(value2)
  })

  it('getValue returns different values for different seeds', () => {
    const coordinates = { x: 10, y: 15 }
    const value1 = SimplexNoise.GetValue(coordinates, 'seed1')
    const value2 = SimplexNoise.GetValue(coordinates, 'seed2')
    expect(value1).not.toBe(value2)
  })

  it('getValue returns values within expected range', () => {
    const value = SimplexNoise.GetValue({ x: 5, y: 5 }, 'rangeTestSeed')
    expect(value).toBeGreaterThanOrEqual(-1)
    expect(value).toBeLessThanOrEqual(1)
  })

  it('getValue and generate produce consistent results with the same seed', () => {
    // @AI this test is succeeding and shows that the getValue should match the generate result at the same coordinates
    const seed = 'mapSeed'
    const size = 5
    const map1 = SimplexNoise.Generate(size, seed)
    expect(map1[0][0]).toBe(SimplexNoise.GetValue({ x: 0, y: 0 }, seed))
    expect(map1[3][3]).toBe(SimplexNoise.GetValue({ x: 3, y: 3 }, seed))
  })

  it('generate produces a consistent map for a given seed', () => {
    const seed = 'mapSeed'
    const size = 5
    const map1 = SimplexNoise.Generate(size, seed)
    const map2 = SimplexNoise.Generate(size, seed)
    expect(map1).toEqual(map2)
  })

  it('generate produces different maps for different seeds', () => {
    const size = 5
    const map1 = SimplexNoise.Generate(size, 'mapSeed1')
    const map2 = SimplexNoise.Generate(size, 'mapSeed2')
    let differences = 0
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (map1[x][y] !== map2[x][y]) {
          differences++
        }
      }
    }
    expect(differences).toBeGreaterThan(0)
  })

  it('generate produces a map of the correct size', () => {
    const seed = 'sizeTestSeed'
    const size = 10
    const map = SimplexNoise.Generate(size, seed)
    expect(map.length).toBe(size)
    map.forEach((row) => {
      expect(row.length).toBe(size)
    })
  })
})
