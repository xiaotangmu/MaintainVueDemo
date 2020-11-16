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
}]

module.exports = [
  {
    url: '/permission/authority/routes',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: routes
      }
    }
  }
]
