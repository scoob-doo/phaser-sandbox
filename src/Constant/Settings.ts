const Settings = {
  AutoLoad: 'Default Save',
  TestScene: false,
  Debug: false,
  DebugCoordinateGrid: false,
  DebugSpatialHashCells: false,
  DebugTick: false,
  DebugEvents: false,
  DebugPaths: false,
  DebugBuildImmediately: true,
  DebugBiomes: false,
  PointerDragSpeed: 1.5,
  WASDSpeed: 2.333,
  TileSize: 8,
  MapSize: 500, // Coordinates
  MapSizePixels: 100 * 8,
  CullingPadding: 100,
  MaxEntityCount: 2_000_000,
  Music: false,
  ScrollSpeed: 8,
  DefaultZoom: 4,
  MinimumZoom: 0,
  MaximumZoom: 16,
  TargetTPS: 10,
  TickDuration: 0,
  CenterCoordinates: { x: 0, y: 0 },
  MaxWorkers: navigator?.hardwareConcurrency ?? 4,
  LogTerminalData: false,
}

Settings.CenterCoordinates = {
  x: Settings.MapSize / 2,
  y: Settings.MapSize / 2,
}
Settings.TickDuration = 1_000 / Settings.TargetTPS
Settings.MapSizePixels = Settings.MapSize * Settings.TileSize

export default Settings
