import { AllComponents } from '@/ECS/Component'
import GeneralComponent from '@/ECS/Component/GeneralComponent'
import ECSState from '@/State/ECSState'
import { Entity } from '@/Types/Entity'
import _ from 'lodash'

const ECSUtil = {
  EntityToObject: (eid: Entity, ecsState?: ECSState) => {
    const obj = {
      eid: eid,
    }

    for (const Component of AllComponents) {
      if (Component.has(eid)) {
        obj[Component.name] = ECSUtil.ComponentToObject(eid, Component)
      }
    }

    return obj
  },

  ComponentToObject: (eid: Entity, Component: GeneralComponent<any>) => {
    const obj = {}

    for (const key of Object.keys(Component.data)) {
      obj[key] = Component.data[key][eid]
    }

    return obj
  },
}

export default ECSUtil
