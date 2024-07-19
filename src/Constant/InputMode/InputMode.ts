import AutoBuildInputHandler from '@/Lib/InputHandler/AutoBuildInputHandler'
import CookingPotInputHandler from '@/Lib/InputHandler/CookingPotInputHandler'
import DiningTableInputHandler from '@/Lib/InputHandler/DiningTableInputHandler'
import DoorBuildInputHandler from '@/Lib/InputHandler/DoorBuildInputHandler'
import FloorBuildInputHandler from '@/Lib/InputHandler/FloorBuildInputHandler'
import InputHandler from '@/Lib/InputHandler/InputHandler'
import KegInputHandler from '@/Lib/InputHandler/KegInputHandler'
import SelectInputHandler from '@/Lib/InputHandler/SelectInputHandler'
import TransactionCounterInputHandler from '@/Lib/InputHandler/TransactionCounterInputHandler'
import WallBuildInputHandler from '@/Lib/InputHandler/WallBuildInputHandler'
import ZoneDesignationInputHandler from '@/Lib/InputHandler/ZoneDesignationInputHandler'
import GenericScene from '@/Phaser/Scene/GenericScene'

export enum InputMode {
  Standard = 'Standard',
  BuildStructureAuto = 'Build Structure (Auto)',
  BuildStructureWalls = 'Build Structure (Walls)',
  BuildStructureFloors = 'Build Structure (Floors)',
  BuildStructureDoors = 'Build Structure (Doors)',
  BuildFurnitureTransactionCounter = 'Build Furniture (Transaction Counter)',
  BuildFurnitureKeg = 'Build Furniture (Keg)',
  BuildFurnitureDiningTable = 'Build Furniture (Dining Table)',
  BuildFurnitureCookingPot = 'Build Furniture (Cooking Pot)',
  DesignateZone = 'Designate Zone',
}

export const getInputHandler = (
  { mode, data }: { mode: InputMode; data: any },
  scene: GenericScene,
): InputHandler => {
  switch (mode) {
    case InputMode.Standard:
      return new SelectInputHandler(scene)
    case InputMode.BuildStructureAuto:
      return new AutoBuildInputHandler(scene, data)
    case InputMode.BuildStructureWalls:
      return new WallBuildInputHandler(scene, data)
    case InputMode.BuildStructureFloors:
      return new FloorBuildInputHandler(scene, data)
    case InputMode.BuildStructureDoors:
      return new DoorBuildInputHandler(scene, data)
    case InputMode.BuildFurnitureDiningTable:
      return new DiningTableInputHandler(scene, data)
    case InputMode.BuildFurnitureCookingPot:
      return new CookingPotInputHandler(scene, data)
    case InputMode.BuildFurnitureKeg:
      return new KegInputHandler(scene, data)
    case InputMode.DesignateZone:
      return new ZoneDesignationInputHandler(scene, data)
    case InputMode.BuildFurnitureTransactionCounter:
      return new TransactionCounterInputHandler(scene, data)
    default:
      throw new Error(`Invalid menu mode ${mode}`)
  }
}
