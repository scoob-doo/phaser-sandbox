export default {
  PredictPosition(body: Phaser.Physics.Arcade.Body, lookAhead: number) {
    const velocity = body.velocity
    const futureCenter = body.center
      .clone()
      .add(velocity.clone().multiply(new Phaser.Math.Vector2(lookAhead)))
    const futureCircle = new Phaser.Geom.Circle(futureCenter.x, futureCenter.y, body.radius)

    // Normalize the velocity to get the direction of movement
    const direction = velocity.clone().normalize()

    // Calculate the perpendicular offset for the right edge (rotate 90 degrees)
    const rightOffset = new Phaser.Math.Vector2(-direction.y, direction.x).scale(body.radius)
    // Calculate the perpendicular offset for the left edge (rotate -90 degrees)
    const leftOffset = new Phaser.Math.Vector2(direction.y, -direction.x).scale(body.radius)

    // Calculate the start and end points for the right and left edges
    const rightEdgeStart = body.center.clone().add(rightOffset)
    const leftEdgeStart = body.center.clone().add(leftOffset)
    const rightEdgeEnd = futureCenter.clone().add(rightOffset)
    const leftEdgeEnd = futureCenter.clone().add(leftOffset)

    // Create lines from the calculated points
    const rightEdgeLine = new Phaser.Geom.Line(
      rightEdgeStart.x,
      rightEdgeStart.y,
      rightEdgeEnd.x,
      rightEdgeEnd.y,
    )
    const leftEdgeLine = new Phaser.Geom.Line(
      leftEdgeStart.x,
      leftEdgeStart.y,
      leftEdgeEnd.x,
      leftEdgeEnd.y,
    )

    return { futureCircle, rightEdgeLine, leftEdgeLine }
  },
}
