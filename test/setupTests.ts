const nodeCrypto = require('crypto')

Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: function (buffer: any) {
      return nodeCrypto.randomFillSync(buffer)
    }
  }
})
