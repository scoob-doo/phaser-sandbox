export enum EntityTypes {
  Keg = 1,
  CookingPot,
  OakTree,
  Wall,
  Door,
  Floor,
  Boulder,
  Flower,
  Leaves,
  Shrubbery,
  BerryBush,
  Terrain,
  DiningTable,
  Building,
  InflowStockpile,
  OutflowStockpile,
  TransactionCounter,
}

export const EntityTypeToDescription = {
  [EntityTypes.Keg]: 'Keg',
  [EntityTypes.CookingPot]: 'Cooking Pot',
  [EntityTypes.OakTree]: 'OakTree',
  [EntityTypes.Wall]: 'Wall',
  [EntityTypes.Door]: 'Door',
  [EntityTypes.Floor]: 'Floor',
  [EntityTypes.Boulder]: 'Boulder',
  [EntityTypes.Flower]: 'Flower',
  [EntityTypes.Leaves]: 'Leaves',
  [EntityTypes.Shrubbery]: 'Shrubbery',
  [EntityTypes.BerryBush]: 'Berry Bush',
  [EntityTypes.Terrain]: 'Terrain',
  [EntityTypes.DiningTable]: 'Dining Table',
  [EntityTypes.Building]: 'Building',
  [EntityTypes.InflowStockpile]: 'Inflow Stockpile',
  [EntityTypes.OutflowStockpile]: 'Outflow Stockpile',
  [EntityTypes.TransactionCounter]: 'Transaction Counter',
}

export const EntityTypeToTooltip = {
  [EntityTypes.Keg]: 'A keg of ale.',
  [EntityTypes.InflowStockpile]: 'A stockpile for the inputs of a given production building.',
  [EntityTypes.OutflowStockpile]: 'A stockpile for the products of a given production building.',
  [EntityTypes.TransactionCounter]:
    'A counter for selling items from the outflow stockpile directly to customers.',
}
