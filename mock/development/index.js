const menu = require('./permission/menu')
const role = require('./permission/role')
module.exports = [
  ...menu,
  ...role
]
