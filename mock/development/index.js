const menu = require('./permission/menu')
const list = require('./permission/list')
const role = require('./permission/role')
module.exports = [
  ...list,
  ...menu,
  ...role
]
