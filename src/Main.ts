// JavaScript Imports
import { ThemeUtils } from 'svelte-tweakpane-ui'
import App from './App.svelte'
import PhaserGame from './Phaser/PhaserGame'
import './App.css'

ThemeUtils.setGlobalDefaultTheme({
  ...ThemeUtils.presets.standard,
  bladeValueWidth: '125px',
})

declare global {
  interface Window {
    PhaserGame: Phaser.Game
    MousePosition: { x: number; y: number } // Screen position
  }
}

document.addEventListener('mousemove', (event) => {
  window.MousePosition = { x: event.clientX, y: event.clientY }
})

window.addEventListener('resize', () => {
  window.PhaserGame.scale.resize(window.innerWidth, window.innerHeight)
})

window.PhaserGame = PhaserGame.getInstance()

const app = new App({
  target: document.getElementById('app')!,
})

export default app
