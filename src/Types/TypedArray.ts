export type Type =
  | 'i8'
  | 'ui8'
  | 'ui8c'
  | 'i16'
  | 'ui16'
  | 'i32'
  | 'ui32'
  | 'f32'
  | 'f64'
  | 'eid'

export type ListType = readonly [Type, number]

export enum Types {
  i8 = 'i8',
  ui8 = 'ui8',
  ui8c = 'ui8c',
  i16 = 'i16',
  ui16 = 'ui16',
  i32 = 'i32',
  ui32 = 'ui32',
  f32 = 'f32',
  f64 = 'f64',
  eid = 'eid',
}

export type TypedArray =
  | Uint8Array
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array

export const ArrayTypeMap = {
  [Types.i8]: Int8Array,
  [Types.ui8]: Uint8Array,
  [Types.ui8c]: Uint8ClampedArray,
  [Types.i16]: Int16Array,
  [Types.ui16]: Uint16Array,
  [Types.i32]: Int32Array,
  [Types.ui32]: Uint32Array,
  [Types.f32]: Float32Array,
  [Types.f64]: Float64Array,
  [Types.eid]: Uint32Array,
}

export type ArrayByType = {
  [Types.i8]: Int8Array
  [Types.ui8]: Uint8Array
  [Types.ui8c]: Uint8ClampedArray
  [Types.i16]: Int16Array
  [Types.ui16]: Uint16Array
  [Types.i32]: Int32Array
  [Types.ui32]: Uint32Array
  [Types.f32]: Float32Array
  [Types.f64]: Float64Array
  [Types.eid]: Uint32Array
}

export type TypedArrayConstructor = {
  new (
    buffer: ArrayBufferLike,
    byteOffset?: number,
    length?: number,
  ): TypedArray
  BYTES_PER_ELEMENT: number
}
