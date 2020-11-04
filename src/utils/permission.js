import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const routes = store.getters && store.getters.routes
    const permissionRoutes = value

    const hasPermission = routes.some(role => {
      return permissionRoutes.includes(role)
    })
    return hasPermission
  } else {
    console.error(`need routes! Like v-permission="['admin','editor']"`)
    return false
  }
}
