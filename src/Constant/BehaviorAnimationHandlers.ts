import Behavior from '@/ECS/Component/Behavior'
import BehaviorType from './BehaviorType'
import KnightState from './KnightState'
import PhysicsBody from '@/ECS/Component/PhysicsBody'
import Vector2 from '@/Lib/PhaserMath/Vector2'
import ReadonlyVelocity from '@/ECS/Component/ReadonlyVelocity'
import Direction from './Direction'

export default {
  [BehaviorType.Knight]: (eid: number) => {
    const direction = {
      x: PhysicsBody.directionX[eid] === Direction.Right ? 'right' : 'left',
      y: PhysicsBody.directionY[eid] === Direction.Down ? 'down' : 'up',
    }
    switch (Behavior.state[eid]) {
      case KnightState.Idle:
        return `knight_idle_${direction.x}`

      case KnightState.Moving:
        const velocity = new Vector2(ReadonlyVelocity.x[eid], ReadonlyVelocity.y[eid])
        if (velocity.length() / PhysicsBody.maxVelocity[eid] > 0.4) {
          return `knight_gallop_${direction.x}`
        }
        return `knight_trot_${direction.x}`

      default:
        return null
    }
  },
}
