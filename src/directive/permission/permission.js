import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const routes = store.getters && store.getters.routes

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoutes = value

      const hasPermission = routes.some(role => {
        return permissionRoutes.includes(role)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need routes! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
