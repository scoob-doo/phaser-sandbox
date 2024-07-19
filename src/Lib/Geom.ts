import _ from 'lodash'
import Distance from './PhaserMath/Distance'

type Circle = {
  x: number
  y: number
  radius: number
}

export default {
  CalculateCircularOverlap(overlappedCircle: Circle, overlappingCircle: Circle) {
    const distance = Distance.Between(
      overlappedCircle.x,
      overlappedCircle.y,
      overlappingCircle.x,
      overlappingCircle.y,
    )
    const sumOfRadii = overlappedCircle.radius + overlappingCircle.radius
    if (distance >= sumOfRadii) return 0

    const overlapDistance = sumOfRadii - distance
    const normalizedOverlap = overlapDistance / sumOfRadii // Change normalization base

    return _.clamp(normalizedOverlap, 0, 1)
  },
}
