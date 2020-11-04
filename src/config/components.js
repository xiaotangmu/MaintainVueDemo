import Layout from '@/layout'
export const cpn = {
  Layout,
  permission_authority: () => import('@/views/permission/menu'),
  permission_role: () => import('@/views/permission/role'),
  permission_grant: () => import('@/views/permission/grant'),
  category_catalog: () => import('@/views/category/catalog'),
  category_attr: () => import('@/views/category/attr'),
  system_product: () => import('@/views/system/product')
}
