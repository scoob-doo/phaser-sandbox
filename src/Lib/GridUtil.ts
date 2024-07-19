import TVector from '@/Types/TVector'

export default class GridUtil {
  /**
   * Converts an array of points into an array of line segments with minimal segments.
   * Each line segment is represented as a tuple of start and end coordinates.
   * @param path An array of tuples [x, y] representing points in the path.
   * @returns An array of line segments represented as tuples of {x, y} objects.
   */
  static PathCoordinatesToLines(
    path: TVector[],
  ): { start: { x: number; y: number }; end: { x: number; y: number } }[] {
    const lines: { start: { x: number; y: number }; end: { x: number; y: number } }[] = []
    if (path.length < 2) return lines

    let startX = path[0].x
    let startY = path[0].y
    let currentX = startX
    let currentY = startY

    for (let i = 1; i < path.length; i++) {
      const { x: nextX, y: nextY } = path[i]
      const dx = nextX - currentX
      const dy = nextY - currentY

      if (i === 1 || dx * (path[i - 1].y - startY) === dy * (path[i - 1].x - startX)) {
        currentX = nextX
        currentY = nextY
      } else {
        lines.push({ start: { x: startX, y: startY }, end: { x: currentX, y: currentY } })
        startX = currentX
        startY = currentY
        currentX = nextX
        currentY = nextY
      }
    }

    // Add the last line segment
    lines.push({ start: { x: startX, y: startY }, end: { x: currentX, y: currentY } })

    return lines
  }
}
