const Mock = require('mockjs')

const routes = [{
  id: '0',
  path: '/permission',
  meta: { title: '权限管理', icon: 'lock' },
  children: [
    {
      id: '1',
      path: 'authority',
      meta: { title: '菜单管理', icon: '' },
      permissionList: [
        {
          id: '1-0',
          permission: '007',
          title: '权限007'
        },
        {
          id: '1-1',
          permission: '008',
          title: '权限008'
        }
      ]
    },
    {
      id: '2',
      path: 'role',
      meta: { title: '角色管理', icon: '' },
      permissionList: [
        {
          id: '2-0',
          permission: '007',
          title: '权限007'
        },
        {
          id: '2-1',
          permission: '008',
          title: '权限008'
        }
      ]
    }
  ]
}]

const roles = [
  {
    key: 'admin',
    name: 'admin',
    description: 'Super Administrator. Have access to view all pages.',
    routes: routes
  },
  {
    key: 'editor',
    name: 'editor',
    description: 'Normal Editor. Can see all pages except permission page',
    routes: routes.filter(i => i.path !== '/permission')// just a mock
  },
  {
    key: 'visitor',
    name: 'visitor',
    description: 'Just a visitor. Can only see the home page and the document page',
    routes: [{
      path: '',
      redirect: 'dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: { title: 'dashboard', icon: 'dashboard' }
        }
      ]
    }]
  }
]

module.exports = [
  // mock get all routes form server
  {
    url: '/vue-element-admin/routes',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: routes
      }
    }
  },

  // mock get all roles form server
  {
    url: '/vue-element-admin/roles',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: roles
      }
    }
  },

  // add role
  {
    url: '/vue-element-admin/role',
    type: 'post',
    response: {
      code: 20000,
      data: {
        key: Mock.mock('@integer(300, 5000)')
      }
    }
  },

  // update role
  {
    url: '/vue-element-admin/role/[A-Za-z0-9]',
    type: 'put',
    response: {
      code: 20000,
      message: 'success'
    }
  },

  // delete role
  {
    url: '/vue-element-admin/role/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  }
]
