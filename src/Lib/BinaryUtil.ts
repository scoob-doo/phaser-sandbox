const BinaryUtil = {
  EvalBitmask: (flag: number, query: { mask?: number; negationMask?: number }) => {
    query.mask = query.mask ?? 0
    query.negationMask = query.negationMask ?? 0
    return (query.mask & flag) === query.mask && (query.negationMask & flag) === 0
  },

  ToSharedArrayBuffer: (buffer: any): any => {
    if (buffer instanceof ArrayBuffer) {
      const sharedBuffer = new SharedArrayBuffer(buffer.byteLength)
      new Uint8Array(sharedBuffer).set(new Uint8Array(buffer))
      return sharedBuffer
    } else if (Array.isArray(buffer)) {
      return buffer.map((item) => BinaryUtil.ToSharedArrayBuffer(item))
    } else if (buffer !== null && typeof buffer === 'object') {
      const result: any = {}
      for (const key in buffer) {
        result[key] = BinaryUtil.ToSharedArrayBuffer(buffer[key])
      }
      return result
    }
    return buffer
  },

  ToArrayBuffer: (buffer: any): any => {
    if (buffer instanceof SharedArrayBuffer) {
      const arrayBuffer = new ArrayBuffer(buffer.byteLength)
      new Uint8Array(arrayBuffer).set(new Uint8Array(buffer))
      return arrayBuffer
    } else if (Array.isArray(buffer)) {
      return buffer.map((item) => BinaryUtil.ToArrayBuffer(item))
    } else if (buffer !== null && typeof buffer === 'object') {
      const result: any = {}
      for (const key in buffer) {
        result[key] = BinaryUtil.ToArrayBuffer(buffer[key])
      }
      return result
    }
    return buffer
  },
}

export default BinaryUtil
