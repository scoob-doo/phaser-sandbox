export default {
  IsUnique: <T>(value: T, index: number, self: T[]): boolean => self.indexOf(value) === index,
}
