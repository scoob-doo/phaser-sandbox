import MapGenState from '@/State/MapGenState'

enum Biome {
  DeepWater = 0x0952c3,
  ShallowWater = 0x096bc1,
  Coast = 0xac9969,
  Plains = 0x5a7f33,
  Forest = 0x39561a,
  DeepForest = 0x475e32,
  Foothills = 0x7a7a7a,
  Mountains = 0xa8a8a8,
  Peaks = 0xffffff,
}

export default class Generate {
  static Color(x: number, y: number, mapGenState: MapGenState) {
    const elevationValue = mapGenState.heightMaps['elevation'][x][y]
    const erosionValue = mapGenState.heightMaps['erosion'][x][y]
    const moistureValue = mapGenState.heightMaps['moisture'][x][y]

    const erosionBlendingFactor = 0.2
    const gradientSteepness = 0.2 // Adjust this value to control the steepness of the gradient
    const innerEdgeDistance = 100 * (mapGenState.mapSize / 1000) // Where the gradient should begin
    const outerEdgeDistance = 550 * (mapGenState.mapSize / 1000) // Where the gradient should end
    const centerX = mapGenState.mapSize / 2
    const centerY = mapGenState.mapSize / 2
    const maxDistance = outerEdgeDistance - innerEdgeDistance

    // Determine true elevation by combining with gradient and erosion
    const distanceX = Math.abs(x - centerX)
    const distanceY = Math.abs(y - centerY)
    const distance = Math.max(distanceX, distanceY)

    let gradientValue
    if (distance <= innerEdgeDistance) {
      gradientValue = 0
    } else if (distance >= outerEdgeDistance) {
      gradientValue = 1
    } else {
      const normalizedDistance = (distance - innerEdgeDistance) / (maxDistance - innerEdgeDistance)
      gradientValue = Math.pow(normalizedDistance, 1 / gradientSteepness)
    }

    // Apply an exponential function to the scaling factor
    const scaledErosion = erosionValue * Math.pow(1 - elevationValue, 2) * erosionBlendingFactor

    const combinedElevation = elevationValue - scaledErosion

    // Make into an island by applying square gradient
    const finalElevation = Math.max(combinedElevation - gradientValue, 0)

    if (finalElevation < 0.3) return Biome.DeepWater
    if (finalElevation < 0.35) return Biome.ShallowWater
    if (finalElevation < 0.37) return Biome.Coast

    if (finalElevation < 0.65) {
      const color = Phaser.Display.Color.IntegerToColor(Biome.Plains)

      if (moistureValue < 0.25) color.darken(0)
      else if (moistureValue < 0.5) color.darken(0.2 * 25)
      else if (moistureValue < 0.7) color.darken(0.4 * 25)
      else color.darken(0.55 * 25)

      return color.color
    }

    if (finalElevation < 0.72) return Biome.DeepForest

    if (finalElevation < 0.79) return Biome.Foothills

    if (finalElevation < 0.85) return Biome.Mountains

    return Biome.Peaks
  }
}
