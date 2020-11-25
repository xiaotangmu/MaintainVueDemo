const Mock = require('mockjs')
module.exports = [
  {
    url: '/permission/list/getList',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: [{
          id: 'a7523cbcab3a447299e61a94abef05f5',
          enable: 1,
          pid: '1-1',
          sort: 1,
          name: 'hello'
        }]
      }
    }
  },
  {
    url: '/permission/list/Permission',
    type: 'post',
    response: {
      code: 20000,
      data: {
        key: Mock.mock('@integer(300, 5000)')
      }
    }
  },

  {
    url: '/permission/list/Permission',
    type: 'put',
    response: {
      code: 20000,
      message: 'success'
    }
  },

  {
    url: '/permission/list/Permission/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  },

  {
    url: '/permission/list/Enable/[A-Za-z0-9]',
    type: 'put',
    response: {
      code: 1,
      message: '更改失败'
    }
  }
]
