/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const { defaults } = require('jest-config')

module.exports = {
  globals: {
    ...defaults.globals,
    crypto: require('crypto')
  }
}
