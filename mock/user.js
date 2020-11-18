const Mock = require('mockjs')
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const routes = [{
  path: '/permission',
  component: 'Layout',
  redirect: '/permission/menu',
  hidden: false,
  name: 'Permission',
  meta: { title: '权限管理', icon: 'lock' },
  children: [
    {
      path: 'menu',
      component: 'permission_menu',
      name: 'Menu',
      meta: { title: '菜单管理', icon: '' }
    },
    {
      path: 'role',
      component: 'permission_role',
      name: 'Role',
      meta: { title: '角色管理', icon: '' }
    },
    {
      path: 'grant',
      component: 'permission_grant',
      name: 'Grant',
      meta: { title: '授权管理', icon: '' }
    }
  ]
},
{
  path: '/category',
  component: 'Layout',
  redirect: '/category/catalog',
  hidden: false,
  name: 'Category',
  meta: { title: '分类管理', icon: 'nested' },
  children: [
    {
      path: 'catalog',
      component: 'category_catalog',
      name: 'Catalog',
      meta: { title: '分类目录', icon: '' }
    },
    {
      path: 'attr',
      component: 'category_attr',
      name: 'Attr',
      meta: { title: '分类属性', icon: '' }
    }
  ]
},
{
  path: '/system',
  component: 'Layout',
  redirect: '/system/product',
  hidden: false,
  name: 'system',
  meta: { title: '系统功能', icon: 'component' },
  children: [
    {
      path: 'product',
      component: 'system_product',
      name: 'Product',
      meta: { title: '标准产品管理', icon: '' }
    },
    {
      path: 'sku',
      component: 'system_sku',
      name: 'Sku',
      meta: { title: '库存管理', icon: '' }
    },
    {
      path: 'entry',
      component: 'system_entry',
      name: 'Entry',
      meta: { title: '入库管理', icon: '' }
    },
    {
      path: 'out',
      component: 'system_out',
      name: 'Out',
      meta: { title: '出库管理', icon: '' }
    },
    {
      path: 'appointment',
      component: 'system_appointment',
      name: 'Appointment',
      meta: { title: '维修预约', icon: '' }
    },
    {
      path: 'maintain',
      component: 'system_maintain',
      name: 'Maintain',
      meta: { title: '维修单', icon: '' }
    }
  ]
}]

const users = {
  'admin-token': {
    routes: routes,
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    role: ['admin']
  },
  'editor-token': {
    routes: [],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor',
    role: ['editor']
  }
}

module.exports = [
  // user login
  {
    url: '/vue-element-admin/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-element-admin/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/users',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: users
      }
    }
  },

  // add user
  {
    url: '/vue-element-admin/user',
    type: 'post',
    response: {
      code: 20000,
      data: {
        key: Mock.mock('@integer(300, 5000)')
      }
    }
  },

  // update user
  {
    url: '/vue-element-admin/user/[A-Za-z0-9]',
    type: 'put',
    response: {
      code: 20000,
      message: 'success'
    }
  },

  // delete user
  {
    url: '/vue-element-admin/user/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  }
]
