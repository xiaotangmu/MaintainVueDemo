
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
  redirect: '/permission/authority',
  hidden: false,
  name: 'Permission',
  meta: { title: '权限管理', icon: 'lock' },
  children: [
    {
      path: 'authority',
      component: 'permission_authority',
      name: 'Authority',
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
      path: 'warehouseOut',
      component: 'system_warehouseOut',
      name: 'warehouseOut',
      meta: { title: '出库管理', icon: '' }
    }
  ]
}]

const users = {
  'admin-token': {
    routes: routes,
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    role: '超管'
  },
  'editor-token': {
    routes: [],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor',
    role: '普通'
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
  }
]
