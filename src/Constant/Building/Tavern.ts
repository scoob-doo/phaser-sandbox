import { EntityTypes } from '../EntityTypes/EntityTypes'

export default {
  furnitureRequirements: {
    [EntityTypes.TransactionCounter]: {
      minQuantity: 1,
      indoors: true,
      outdoors: false,
    },
    [EntityTypes.CookingPot]: {
      minQuantity: 1,
      indoors: true,
      outdoors: false,
    },
    [EntityTypes.Keg]: {
      minQuantity: 1,
      indoors: true,
      outdoors: false,
    },
  },
}
