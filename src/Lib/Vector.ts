import TVector from '@/Types/TVector'
import _ from 'lodash'
import Settings from '../Constant/Settings'
import Distance from './PhaserMath/Distance'
import Vector2 from './PhaserMath/Vector2'

export default class Vector {
  static ClampMagnitude(vector: Vector2, min: number, max: number) {
    const magnitude = vector.length()
    if (magnitude < min) {
      vector.setLength(min)
    } else if (magnitude > max) {
      vector.setLength(max)
    }
    return vector
  }

  static PositionFromPointer = (pointer: { worldX: number; worldY: number }) => ({
    x: pointer.worldX,
    y: pointer.worldY,
  })

  static CoordinatesFromPointer = (pointer: { worldX: number; worldY: number }): Vector2 =>
    new Vector2(
      _.clamp(Math.floor(pointer.worldX / Settings.TileSize), 0, Settings.MapSize - 1),
      _.clamp(Math.floor(pointer.worldY / Settings.TileSize), 0, Settings.MapSize - 1),
    )

  static PositionToCoordinates = (pos: TVector) =>
    new Vector2(
      _.clamp(Math.floor(pos.x / Settings.TileSize), 0, Settings.MapSize - 1),
      _.clamp(Math.floor(pos.y / Settings.TileSize), 0, Settings.MapSize - 1),
    )

  // This points to the top left corner which is the same origin as tiles
  static CoordinatesToPosition = (coordinates: TVector) =>
    new Vector2(coordinates.x * Settings.TileSize, coordinates.y * Settings.TileSize)

  static CoordinatesToCenterPoint = (coord: TVector): TVector => {
    return {
      x: coord.x * Settings.TileSize + Settings.TileSize / 2,
      y: coord.y * Settings.TileSize + Settings.TileSize / 2,
    }
  }

  static CoordinatesAreValid = (coord: TVector) =>
    coord.x >= 0 && coord.x < Settings.MapSize && coord.y >= 0 && coord.y < Settings.MapSize

  static StringToVector = (str: string) => {
    const [strX, strY] = str.split(':')
    const x = parseInt(strX)
    const y = parseInt(strY)
    if (isNaN(x) || isNaN(y)) throw new Error(`Invalid vector string: ${str}`)

    return new Vector2(x, y)
  }

  static VectorToString = ({ x, y }: TVector) => `${x}:${y}`

  static OrthogonalDeltas = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ]

  static DiagonalDeltas = [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
  ]

  static GetAdjacentCoordinates = (
    coordinates: TVector,
    maxX = Settings.MapSize - 1,
    maxY = maxX,
  ): (TVector | null)[] =>
    [...Vector.OrthogonalDeltas, ...Vector.DiagonalDeltas].map(({ x, y }) => {
      const nx = x + coordinates.x
      const ny = y + coordinates.y
      return nx < 0 || nx > maxX || ny < 0 || ny > maxY ? null : { x: nx, y: ny }
    })

  // Returns [up, down, left, right] -- null if out of bounds
  static GetAdjacentOrthogonalCoordinates = (
    coordinates: TVector,
    maxX = Settings.MapSize - 1,
    maxY = maxX,
  ): (TVector | null)[] =>
    Vector.OrthogonalDeltas.map(({ x, y }) => {
      const nx = coordinates.x + x
      const ny = coordinates.y + y
      return nx < 0 || nx > maxX || ny < 0 || ny > maxY ? null : { x: nx, y: ny }
    })

  // Returns [top left, top right, bottom right, bottom left] -- null if out of bounds
  static GetAdjacentDiagonalCoordinates = (coordinates: TVector): (TVector | null)[] =>
    Vector.DiagonalDeltas.map(({ x, y }) => {
      const nx = coordinates.x + x
      const ny = coordinates.y + y
      return nx < 0 || nx > Settings.MapSize - 1 || ny < 0 || ny > Settings.MapSize - 1
        ? null
        : { x: nx, y: ny }
    })

  static GetOutlineCoordinates = (coordinates: TVector[]): TVector[] => {
    // Convert the array of coordinates to a Set of strings for efficient lookup
    const originalSet = new Set(coordinates.map((coord) => `${coord.x},${coord.y}`))
    const outlineSet = new Set<string>()

    // Define all possible moves: orthogonal and diagonal
    const moves = [
      { dx: -1, dy: -1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 1 },
      { dx: 0, dy: 1 },
      { dx: 1, dy: 1 },
    ]

    coordinates.forEach((coord) => {
      moves.forEach((move) => {
        const neighbor: TVector = { x: coord.x + move.dx, y: coord.y + move.dy }
        const neighborKey = `${neighbor.x},${neighbor.y}`

        // If the neighbor is not part of the original set, add it to the outline set
        if (!originalSet.has(neighborKey)) {
          outlineSet.add(neighborKey)
        }
      })
    })

    // Convert the outline set back to an array of coordinate objects
    return [...outlineSet]
      .map((key) => {
        const [x, y] = key.split(',').map(Number)
        return { x, y }
      })
      .filter((c) => Vector.CoordinatesAreValid(c))
  }

  static AreEqual = (v1: TVector | null, v2: TVector | null) => {
    if (v1 === null || v2 === null) return false
    return v1.x === v2.x && v1.y === v2.y
  }

  static CalcCoordinateDistance = (coord1: TVector, coord2: TVector): number => {
    const dx = Math.abs(coord1.x - coord2.x)
    const dy = Math.abs(coord1.y - coord2.y)
    return Math.max(dx, dy)
  }

  /**
   * Finds the closest point to a target position from an array of points.
   * @param targetPosition The position to compare against.
   * @param points An array of Vector2 points.
   * @returns An object containing the closest point and its index in the array.
   */
  static FindClosestPoint = (targetPosition: TVector, points: TVector[]): [TVector, number] => {
    if (points.length === 0) {
      throw new Error('Points array is empty.')
    }

    let closestPoint = points[0]
    let closestDistance = Distance.BetweenPoints(targetPosition, closestPoint)
    let closestIndex = 0

    for (let i = 1; i < points.length; i++) {
      const point = points[i]
      const distance = Distance.BetweenPoints(targetPosition, point)

      if (distance < closestDistance) {
        closestDistance = distance
        closestPoint = point
        closestIndex = i
      }
    }

    return [closestPoint, closestIndex]
  }

  // Warning: Quits at first match, design conditionCheck accordingly! (Similar to find)
  static CheckHorizontalAxis = (
    radius: number,
    coordinates: TVector,
    conditionCheck: (coordinates: TVector) => boolean,
  ) => {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx === 0) continue
      const nx = coordinates.x + dx
      if (nx < 0 || nx >= Settings.MapSize) continue
      if (conditionCheck({ x: nx, y: coordinates.y })) return true
    }
    return false
  }

  // Warning: Quits at first match, design conditionCheck accordingly! (Similar to find)
  static CheckRadius = (
    radius: number,
    coordinates: TVector,
    conditionCheck: (coordinates: TVector) => boolean,
  ): boolean => {
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (dx === 0 && dy === 0) continue // Skip the current tile
        const nx = coordinates.x + dx,
          ny = coordinates.y + dy
        if (nx >= 0 && nx < Settings.MapSize && ny >= 0 && ny < Settings.MapSize) {
          if (conditionCheck({ x: nx, y: ny })) {
            return true
          }
        } else {
          continue // Edge of map behaves as if matching condition
        }
      }
    }
    return false
  }

  static Average = (vectors: TVector[]): TVector => {
    const avg = { x: 0, y: 0 }
    vectors.forEach((v) => {
      avg.x += v.x
      avg.y += v.y
    })
    avg.x /= vectors.length
    avg.y /= vectors.length
    return avg
  }

  // static CalculateNormalAndIntersection(
  //   line: [Vector2, Vector2],
  //   point: Vector2,
  // ): [Vector2 | null, number | null] {
  //   const [lineStart, lineEnd] = line

  //   // Calculate the direction vector of the line
  //   const lineDirection = lineEnd.clone().subtract(lineStart).normalize()

  //   // Calculate the vector from the start of the line to the point
  //   const startToPoint = point.clone().subtract(lineStart)

  //   // Project startToPoint onto the line direction to find the closest point on the infinite line
  //   const projectionLength = startToPoint.dot(lineDirection)
  //   const lineLength = lineStart.distance(lineEnd)

  //   // Calculate the normalized distance (0 to 1) of the closest point from the start of the line
  //   const normalizedDistance = projectionLength / lineLength

  //   // Check if the closest point is within the line segment
  //   const isWithinSegment = normalizedDistance >= 0 && normalizedDistance <= 1

  //   // Calculate the normal vector perpendicular to the line segment
  //   let normal: Vector2 | null = null
  //   if (isWithinSegment) {
  //     // Check if the point is directly on the line segment
  //     if (point.equals(lineStart.clone().add(lineDirection.clone().scale(projectionLength)))) {
  //       normal = new Vector2(0, 0)
  //     } else {
  //       normal = new Vector2(-lineDirection.y, lineDirection.x).normalize()
  //     }
  //   }

  //   return [normal, isWithinSegment ? normalizedDistance : null]
  // }
  static CalculateNormalAndIntersection(
    line: [Vector2, Vector2],
    point: Vector2,
  ): [Vector2 | null, number | null] {
    const [lineStart, lineEnd] = line

    // Calculate the direction vector of the line
    const lineDirection = lineEnd.clone().subtract(lineStart).normalize()

    // Calculate the vector from the start of the line to the point
    const startToPoint = point.clone().subtract(lineStart)

    // Project startToPoint onto the line direction to find the closest point on the infinite line
    const projectionLength = startToPoint.dot(lineDirection)
    const lineLength = lineStart.distance(lineEnd)

    // Calculate the normalized distance (0 to 1) of the closest point from the start of the line
    const normalizedDistance = projectionLength / lineLength

    // Check if the closest point is within the line segment
    const isWithinSegment = normalizedDistance >= 0 && normalizedDistance <= 1

    // Calculate the normal vector perpendicular to the line segment
    let normal: Vector2 | null = null
    if (isWithinSegment) {
      // Check if the point is directly on the line segment
      if (point.equals(lineStart.clone().add(lineDirection.clone().scale(projectionLength)))) {
        normal = new Vector2(0, 0)
      } else {
        // Calculate the vector from the closest point on the line to the point
        const closestPointToPoint = point
          .clone()
          .subtract(lineStart.clone().add(lineDirection.clone().scale(projectionLength)))

        // Calculate the normal vector based on the direction of closestPointToPoint
        normal = new Vector2(-lineDirection.y, lineDirection.x).normalize()
        if (closestPointToPoint.dot(normal) > 0) {
          normal.scale(-1)
        }
      }
    }

    return [normal, isWithinSegment ? normalizedDistance : null]
  }

  static SortVectors(...vectors: TVector[]): TVector[] {
    return vectors.sort((a, b) => {
      if (a.x !== b.x) {
        return a.x - b.x
      } else {
        return a.y - b.y
      }
    })
  }

  static CalcAreaCoordinates(coordinates: Vector2, width: number, height: number): Vector2[] {
    width = Math.max(width, 1)
    height = Math.max(height, 1)

    const area: Vector2[] = []
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        area.push(new Vector2(coordinates.x + x, coordinates.y + y))
      }
    }
    return area
  }

  static CalcWidthFromArea(area: Vector2[]): number {
    const minX = _.min(area.map((v) => v.x))
    const maxX = _.max(area.map((v) => v.x))
    return maxX - minX + 1
  }

  static CalcHeightFromArea(area: Vector2[]): number {
    const minY = _.min(area.map((v) => v.y))
    const maxY = _.max(area.map((v) => v.y))
    return maxY - minY + 1
  }
}
