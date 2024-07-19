import Settings from '@/Constant/Settings'

export type SparseSetBuffer = {
  lock: SharedArrayBuffer
  dense: SharedArrayBuffer
  sparse: SharedArrayBuffer
  length: SharedArrayBuffer
}

class SparseSet {
  private _hasLock: boolean = false
  private _lock: Uint8Array
  private _dense: Uint32Array
  private _sparse: Uint32Array
  private _length: Uint32Array
  private _buffer: SparseSetBuffer

  constructor(buffers: SparseSetBuffer | null = null) {
    if (!buffers) {
      buffers = {
        lock: new SharedArrayBuffer(Uint8Array.BYTES_PER_ELEMENT),
        dense: new SharedArrayBuffer(Settings.MaxEntityCount * Uint32Array.BYTES_PER_ELEMENT),
        sparse: new SharedArrayBuffer(Settings.MaxEntityCount * Uint32Array.BYTES_PER_ELEMENT),
        length: new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT),
      }
    }

    this._lock = new Uint8Array(buffers.lock).fill(0)
    this._dense = new Uint32Array(buffers.dense)
    this._sparse = new Uint32Array(buffers.sparse)
    this._length = new Uint32Array(buffers.length)
    this._buffer = buffers
  }

  get length(): number {
    return this._length[0]
  }

  get buffer(): Readonly<SparseSetBuffer> {
    return this._buffer
  }

  get dense(): Readonly<Uint32Array> {
    return this._dense
  }

  private acquireLock() {
    while (!this._hasLock) {
      const isLocked = Atomics.compareExchange(this._lock, 0, 0, 1)
      this._hasLock = isLocked === 0
    }
  }

  private releaseLock() {
    if (this._hasLock) {
      Atomics.store(this._lock, 0, 0)
      this._hasLock = false
    }
  }

  add(value: number) {
    this.acquireLock()
    if (this.length >= Settings.MaxEntityCount) throw new Error('SparseSet is full!')
    if (!this.has(value)) {
      this._dense[this.length] = value
      this._sparse[value] = this.length
      this._length[0]++
    }
    this.releaseLock()
  }

  remove(value: number) {
    this.acquireLock()
    if (this.has(value)) {
      const length = Atomics.load(this._length, 0)
      const denseIndex = Atomics.load(this._sparse, value)
      const lastValue = Atomics.load(this._dense, length - 1)
      Atomics.store(this._dense, denseIndex, lastValue)
      Atomics.store(this._sparse, lastValue, denseIndex)
      Atomics.sub(this._length, 0, 1)
    }
    this.releaseLock()
  }

  has(value: number): boolean {
    this.acquireLock()
    const index = this._sparse[value]
    const res = index < this.length && this._dense[index] === value
    this.releaseLock()
    return res
  }

  clear() {
    Atomics.store(this._length, 0, 0)
  }

  getArray() {
    this.acquireLock()
    const res = this._dense.slice(0, this.length)
    this.releaseLock()
    return res
  }

  [Symbol.iterator]() {
    let index = 0

    return {
      next: (): IteratorResult<number> => {
        if (index < this.length) {
          const value = Atomics.load(this._dense, index)
          index++
          return { value, done: false }
        } else {
          // @ts-ignore
          return { done: true }
        }
      },
    }
  }
}

export default SparseSet
