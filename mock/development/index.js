const authority = require('./permission/authority')
const role = require('./permission/role')
module.exports = [
  ...authority,
  ...role
]
