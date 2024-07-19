export default class Fuzzy {
  static Equal(a: number, b: number, epsilon: number = 0.0001) {
    return Math.abs(a - b) < epsilon
  }
}
