import { InputMode } from '@/Constant/InputMode/InputMode'
import { Entity } from '@/Types/Entity'

export enum EventType {
  Exec = 'Exec',
  TerminalOpened = 'TerminalOpened',
  TerminalClosed = 'TerminalClosed',
  EntityUpdated = 'EntityUpdated',
  LoadStarted = 'LoadStarted',
  LoadFinished = 'LoadFinished',
  EntityArrivedAtTarget = 'EntityArrivedAtTarget',
  GuiFocus = 'GuiFocus',
  GuiBlur = 'GuiBlur',
  InputModeChanged = 'InputModeChanged',
  EntitySelected = 'EntitySelected',
  EntityDeselected = 'EntityDeselected',
}

export type EventPayload = {
  [EventType.Exec]: string[]
  [EventType.TerminalOpened]: null
  [EventType.TerminalClosed]: null
  [EventType.EntityUpdated]: Entity | Entity[]
  [EventType.EntityArrivedAtTarget]: Entity
  [EventType.LoadStarted]: null
  [EventType.LoadFinished]: null
  [EventType.GuiFocus]: null
  [EventType.GuiBlur]: null
  [EventType.InputModeChanged]: { mode: InputMode | null; data?: any }
  [EventType.EntitySelected]: Entity
  [EventType.EntityDeselected]: Entity
}
