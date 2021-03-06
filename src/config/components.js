import Layout from '@/layout'
import BlankLayout from '@/layout/BlankLayout'
export const cpn = {
  Layout,
  BlankLayout,
  permission_menu: () => import('@/views/permission/menu'),
  permission_role: () => import('@/views/permission/role'),
  permission_grant: () => import('@/views/permission/grant'),
  permission_list: () => import('@/views/permission/permission'),

  category_catalog: () => import('@/views/category/catalog'),
  category_attr: () => import('@/views/category/attr'),

  system_product: () => import('@/views/system/product'),
  system_sku: () => import('@/views/system/sku'),
  system_entry: () => import('@/views/system/entry'),
  system_out: () => import('@/views/system/out'),
  system_appointment: () => import('@/views/system/appointment'),
  system_maintain: () => import('@/views/system/maintain'),

  data_dict: () => import('@/views/dataDict')
}
export const cpnArr = Object.keys(cpn)
