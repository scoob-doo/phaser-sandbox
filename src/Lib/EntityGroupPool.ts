import { Entity } from '@/Types/Entity'
import _ from 'lodash'
import Phaser from 'phaser'

/**
 * NOTE: Will have to find a way to pass this efficiently to threads if that ever becomes necessary
 * Two options that use SharedArrayBuffers are:
 *
 * 1. Mirror component masks - would take 244.14MB but would require iteration over every entity for querying
 * 2. Mirror query functionality with sparse sets - would take 14.9GB for 1000 groups so not really an option
 *
 * Other options include:
 * 1. Do some kind of filter of the pool before passing it to the thread
 */
export default class EntityGroupPool {
  private groups: Map<number, Set<Entity>>
  private availableIds: Set<number>
  private nextId: number

  constructor() {
    this.groups = new Map()
    this.availableIds = new Set()
    this.nextId = 1
  }

  checkoutGroup(): number {
    let id: number

    if (this.availableIds.size > 0) {
      id = _.first([...this.availableIds])!
      this.availableIds.delete(id)
    } else {
      id = this.nextId++
      this.groups.set(id, new Set())
    }

    return id
  }

  getGroup(id: number): Set<Entity> {
    if (!this.groups.has(id)) this.groups.set(id, new Set())
    return this.groups.get(id)!
  }

  returnGroup(id: number): void {
    if (this.groups.has(id)) {
      const group = this.groups.get(id)!
      group.clear()
      this.availableIds.add(id)
    }
  }

  clear() {
    for (const group of this.groups.values()) group.clear()
  }

  values(): Set<Entity>[] {
    return [...this.groups.values()]
  }
}
