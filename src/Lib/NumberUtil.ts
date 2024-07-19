import _ from 'lodash'

export default {
  FormatWholeNumber(n: number) {
    return n.toFixed(0)
  },

  CreateRoundFn: (places: number) => (num: number) => _.round(num, places),
}
