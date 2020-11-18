const routes = [{
  id: '1',
  pid: 'Root',
  path: '/permission',
  component: 'Layout',
  redirect: '/permission/menu',
  hidden: false,
  name: 'Permission',
  meta: { title: '权限管理', icon: 'lock' },
  children: [
    {
      id: '1-1',
      pid: '1',
      path: 'menu',
      component: 'permission_menu',
      name: 'Menu',
      meta: { title: '菜单管理', icon: '' },
      permission: [
        {
          isPermission: true,
          permission: '007',
          title: '权限007'
        }
      ]
    },
    {
      id: '1-2',
      pid: '1',
      path: 'role',
      component: 'permission_role',
      name: 'Role',
      meta: { title: '角色管理', icon: '' }
    },
    {
      id: '1-3',
      pid: '1',
      path: 'grant',
      component: 'permission_grant',
      name: 'Grant',
      meta: { title: '授权管理', icon: '' }
    }
  ]
},
{
  id: '2',
  pid: 'Root',
  path: '/category',
  component: 'Layout',
  redirect: '/category/catalog',
  hidden: false,
  name: 'Category',
  meta: { title: '分类管理', icon: 'nested' },
  children: [
    {
      id: '2-1',
      pid: '2',
      path: 'catalog',
      component: 'category_catalog',
      name: 'Catalog',
      meta: { title: '分类目录', icon: '' }
    },
    {
      id: '2-2',
      pid: '2',
      path: 'attr',
      component: 'category_attr',
      name: 'Attr',
      meta: { title: '分类属性', icon: '' }
    }
  ]
}]
let i = 3
module.exports = [
  {
    url: '/permission/menu/routes',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: routes
      }
    }
  },
  {
    url: '/permission/menu/delete',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        message: 'success'
      }
    }
  },
  {
    url: '/permission/menu/add',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: i++
      }
    }
  },
  {
    url: '/permission/menu/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        message: 'success'
      }
    }
  }
]
