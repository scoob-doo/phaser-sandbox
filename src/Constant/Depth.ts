import Settings from './Settings'

export const DepthModifier = {
  Floor: 1,
  Zone: 2,
  Furniture: 3,
  Wall: 4,
  Door: 4,
}

export const Depth = {
  Terrain: -1,
  Standard: 10, // Multiplied by y coordinate
  Max: 2_000_000,
}

export const CalcDepth = (y: number, modifier: number = 0) =>
  Depth.Standard * y * Settings.TileSize + modifier
