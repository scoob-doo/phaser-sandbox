import EventEmitter from 'eventemitter3'
import { EventPayload, EventType } from './EventType'
type Listener = (...args: any[]) => void

class EventManager {
  private static emitter = new EventEmitter()

  static on(type: EventType, listener: Listener) {
    // Subscribe to an event specific to the entity's deletion
    this.emitter.on(`${type}`, listener)
  }

  static off(type: EventType, listener: Listener) {
    // Unsubscribe from the entity's deletion event
    this.emitter.off(`${type}`, listener)
  }

  // @ts-ignore
  static emit(type: EventType, payload: EventPayload[EventType] = null) {
    // Emit an event indicating the entity has been deleted
    this.emitter.emit(`${type}`, payload)
  }
}

export default EventManager
