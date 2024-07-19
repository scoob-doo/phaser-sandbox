import Delete from '@/ECS/Component/Delete'
import { EntityTypes } from './EntityTypes'
import EventManager from '@/Event/EventManager'
import { EventType } from '@/Event/EventType'
import { InputMode } from '../InputMode/InputMode'
import { Entity } from '@/Types/Entity'

export default {
  [EntityTypes.Keg]: {
    name: 'Keg',
    tooltip: 'A keg of beer',
    selectedPanel: {
      onMove: () => {},
      onCopy: () => {},
      onDeconstruct: (eid: Entity) => {
        Delete.add(eid)
      },
    },
  },

  [EntityTypes.DiningTable]: {
    name: 'Dining Table',
    tooltip:
      'Customers will only purchase meals if there is seating available at the table. Customers will still buy ale without a table.',
    selectedPanel: {
      onMove: () => {},
      onCopy: () => {},
      onDeconstruct: (eid: Entity) => {
        Delete.add(eid)
      },
    },
  },

  [EntityTypes.TransactionCounter]: {
    name: 'Transaction Counter',
    tooltip: 'A counter for selling items from the outflow stockpile directly to customers.',
    selectedPanel: {
      onMove: () => {},
      onCopy: () => {},
      onDeconstruct: (eid: Entity) => {
        Delete.add(eid)
      },
    },
  },

  [EntityTypes.CookingPot]: {
    name: 'Cooking Pot',
    tooltip: 'A large pot for cooking.',
    selectedPanel: {
      onMove: () => {},
      onCopy: () => {},
      onDeconstruct: (eid: Entity) => {
        Delete.add(eid)
      },
    },
  },

  [EntityTypes.InflowStockpile]: {
    name: 'Inflow Stockpile',
    tooltip: 'A stockpile for the inputs of a given production building.',
    selectedPanel: {
      onEdit: (eid: Entity) => {
        EventManager.emit(EventType.InputModeChanged, {
          mode: InputMode.DesignateZone,
          data: { zoneEid: eid },
        })
      },
      onDestroy: (eid: Entity) => {
        Delete.add(eid)
      },
    },
  },

  [EntityTypes.OutflowStockpile]: {
    name: 'Outflow Stockpile',
    tooltip: 'A stockpile for the products of a given production building.',
    selectedPanel: {
      onEdit: (eid: Entity) => {
        EventManager.emit(EventType.InputModeChanged, {
          mode: InputMode.DesignateZone,
          data: { zoneEid: eid },
        })
      },
      onDestroy: (eid: Entity) => {
        Delete.add(eid)
      },
    },
  },
}
