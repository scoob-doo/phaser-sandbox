import _ from 'lodash'

export default {
  ThrottleLog: _.throttle((...args: any) => {
    console.log(...args)
  }, 50),
}
