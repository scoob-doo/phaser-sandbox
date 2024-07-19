import TVector from '@/Types/TVector'

export default class Distance {
  static Between(x1: number, y1: number, x2: number, y2: number) {
    const dx = x1 - x2
    const dy = y1 - y2
    return Math.sqrt(dx * dx + dy * dy)
  }

  static BetweenPoints(a: TVector, b: TVector) {
    var dx = a.x - b.x
    var dy = a.y - b.y

    return Math.sqrt(dx * dx + dy * dy)
  }
}
