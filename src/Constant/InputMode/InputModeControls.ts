import { InputMode } from './InputMode'

export default {
  [InputMode.Standard]: {
    controlDescriptions: [
      { controls: 'Left Click', action: 'Select' },
      { controls: 'Middle Click + Drag', action: 'Move Camera' },
      { controls: 'W A S D', action: 'Move Camera' },
    ],
  },

  [InputMode.BuildStructureAuto]: {
    controlDescriptions: [
      { controls: 'Left Click + Drag', action: 'Build Structure' },
      { controls: 'Right Click + Drag', action: 'Delete Structure' },
      { controls: 'CTRL + Left Click', action: 'Build Door' },
      { controls: 'CTRL + Right Click', action: 'Delete Door' },
      { controls: 'CTRL + Z', action: 'Undo' },
      { controls: 'Middle Click + Drag', action: 'Move Camera' },
      { controls: 'W A S D', action: 'Move Camera' },
    ],
  },

  [InputMode.BuildStructureWalls]: {
    controlDescriptions: [
      { controls: 'Left Click + Drag', action: 'Build' },
      { controls: 'Right Click + Drag', action: 'Delete' },
      { controls: 'CTRL + Z', action: 'Undo' },
      { controls: 'Middle Click + Drag', action: 'Move Camera' },
      { controls: 'W A S D', action: 'Move Camera' },
    ],
  },

  [InputMode.BuildStructureFloors]: {
    controlDescriptions: [
      { controls: 'Left Click + Drag', action: 'Build' },
      { controls: 'Right Click + Drag', action: 'Delete' },
      { controls: 'CTRL + Z', action: 'Undo' },
      { controls: 'Middle Click + Drag', action: 'Move Camera' },
      { controls: 'W A S D', action: 'Move Camera' },
    ],
  },

  [InputMode.BuildStructureDoors]: {
    controlDescriptions: [
      { controls: 'Left Click', action: 'Build' },
      { controls: 'Right Click', action: 'Delete' },
      { controls: 'CTRL + Z', action: 'Undo' },
      { controls: 'Middle Click + Drag', action: 'Move Camera' },
      { controls: 'W A S D', action: 'Move Camera' },
    ],
  },

  [InputMode.BuildFurnitureTransactionCounter]: {
    controlDescriptions: [
      { controls: 'Left Click + Drag', action: 'Build' },
      { controls: 'CTRL + Z', action: 'Undo' },
      { controls: 'Middle Click + Drag', action: 'Move Camera' },
      { controls: 'W A S D', action: 'Move Camera' },
    ],
  },

  [InputMode.BuildFurnitureKeg]: {
    controlDescriptions: [
      { controls: 'Left Click', action: 'Build' },
      { controls: 'CTRL + Z', action: 'Undo' },
      { controls: 'Middle Click + Drag', action: 'Move Camera' },
      { controls: 'W A S D', action: 'Move Camera' },
    ],
  },

  [InputMode.BuildFurnitureDiningTable]: {
    controlDescriptions: [
      { controls: 'Left Click + Drag', action: 'Build' },
      { controls: 'CTRL + Z', action: 'Undo' },
      { controls: 'Middle Click + Drag', action: 'Move Camera' },
      { controls: 'W A S D', action: 'Move Camera' },
    ],
  },

  [InputMode.BuildFurnitureCookingPot]: {
    controlDescriptions: [
      { controls: 'Left Click', action: 'Build' },
      { controls: 'CTRL + Z', action: 'Undo' },
      { controls: 'Middle Click + Drag', action: 'Move Camera' },
      { controls: 'W A S D', action: 'Move Camera' },
    ],
  },

  [InputMode.DesignateZone]: {
    controlDescriptions: [
      { controls: 'Left Click + Drag', action: 'Designate' },
      { controls: 'Right Click + Drag', action: 'Delete' },
      { controls: 'CTRL + Z', action: 'Undo' },
      { controls: 'Middle Click + Drag', action: 'Move Camera' },
      { controls: 'W A S D', action: 'Move Camera' },
    ],
  },
}
