import { TypedArrayConstructor } from '@/Types/TypedArray'

export default class BufferUtil {
  static Resize(ta: TypedArrayConstructor, size: number) {
    const buffer = new SharedArrayBuffer(ta.BYTES_PER_ELEMENT * size)
    const newArray = new ta(buffer)
    return newArray
  }
}
